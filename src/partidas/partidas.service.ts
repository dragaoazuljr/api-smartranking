import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DesafiosService } from 'src/desafios/desafios.service';
import { DesafioStatus } from 'src/desafios/interfaces/desafio.interface';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { Partida } from './interfaces/partidas.interface';

@Injectable()
export class PartidasService {
    
    constructor(
        @InjectModel('Partidas') private readonly _modelPartida: Model<Partida>,
        private readonly _desafioService: DesafiosService
    ){}
        
        
    async atribuirPartidaADesafio(idDesafio: string, atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto): Promise<Partida> {
        let desafio = await this._desafioService.buscarDesafiosPorId(idDesafio);

        if(!desafio){
            throw new NotFoundException('Desafio nao encontrado');
        }

        if(!desafio.jogadores.find(jogador => jogador._id == atribuirDesafioPartidaDto.def._id)){
            throw new BadRequestException('Jogador não cadastrado nesse desafio')
        }

        const partida = new this._modelPartida(atribuirDesafioPartidaDto);
        partida.categoria = desafio.categoria;
        partida.jogadores = desafio.jogadores;
        const atualizarDesafio = await this._desafioService.atualizarStatusDesafio(idDesafio, DesafioStatus.REALIZADO, partida);
        return partida.save()
    }
}

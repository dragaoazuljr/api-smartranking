import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { Partida } from 'src/partidas/interfaces/partidas.interface';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio, DesafioStatus } from './interfaces/desafio.interface';

@Injectable()
export class DesafiosService {
    
    constructor(
        @InjectModel('Desafio') private readonly _desafioModel: Model<Desafio>,
        private readonly _jogadorService: JogadoresService,
        private readonly _categoriaService: CategoriasService
        ){}
        
        async atualizarDesafio(_id: string, atualizarDesafioDto: AtualizarDesafioDto): Promise<void> {
            if(atualizarDesafioDto.status === DesafioStatus.PENDENTE || atualizarDesafioDto.status === DesafioStatus.REALIZADO){
                throw new BadRequestException('status invalido');
            }

            let desafios = await this.buscarTodosDesafios();

            if(!desafios.find(desafio => desafio._id == _id)){
                throw new NotFoundException('Desafio nao encontrado')
            }

            this._desafioModel.findOneAndUpdate({_id}, atualizarDesafioDto).exec();
        }

        async criarDesafio(criarDesafioDto: CriarDesafioDto) {
        const jogadores = await this._jogadorService.consultarTodosJogadores();
        criarDesafioDto.jogadores.map(jogadoreDto => {
            if(!jogadores.find(jogador => jogadoreDto._id == jogador._id)){
                throw new BadRequestException(`jogador ${jogadoreDto._id} nao existe`)
            }
        })

        if(!jogadores.find(jogador => criarDesafioDto.solicitante == jogador._id)){
            throw new BadRequestException(`jogador solicitante nao existe`)
        }

        if(!criarDesafioDto.jogadores.find(jogador => jogador._id === criarDesafioDto.solicitante)){
            throw new BadRequestException('o jogador solicitante nao faz parte da lista de jogadores')
        }

        const jogadorSolicitanteTemCategoria = await this._categoriaService.jogadorPertenceAlgumaCategoria(criarDesafioDto.solicitante);

        if(!jogadorSolicitanteTemCategoria){
            throw new BadRequestException('o jogador solicitante nao pertence a nenhuma categoria')
        }

        const desafioCriado = await new this._desafioModel(criarDesafioDto).save();

        desafioCriado.categoria = jogadorSolicitanteTemCategoria.categoria;
        desafioCriado.status = DesafioStatus.PENDENTE;
        desafioCriado.dataHoraSolicitacao = new Date();

        return await desafioCriado.save()
    }

    async buscarTodosDesafios(): Promise<Desafio[]>{
        return this._desafioModel.find()
            .populate('jogadores')
            .populate('solicitante')
            .populate('partida')    
            .exec();
    }

    async buscarDesafiosPorId(_id): Promise<Desafio>{
        return await this._desafioModel.findOne({_id})
            .populate('jogadores')
            .populate('solicitante')
            .populate('partida')
            .exec();
    } 

    async consultarDesafiosDeUmJogador(idJogador): Promise<Desafio[]>{
        return this._desafioModel.find().where('jogadores').in(idJogador);
    }

    async atualizarStatusDesafio(_id: string, status: DesafioStatus, partida: Partida){
        let desafio = await this._desafioModel.findById(_id).exec();
        desafio.status = status;
        desafio.partida = partida._id;
        return this._desafioModel.findByIdAndUpdate(_id, {$set: desafio}).exec();
    }

    async deletarDesafio(_id: string): Promise<Desafio>{
        let desafios = await this.buscarTodosDesafios();
        let desafio = desafios.find(desafio => desafio._id == _id)
        if(!desafio){
            throw new NotFoundException('desafio nao encontrado');
        }
        desafio.status = DesafioStatus.CANCELADO;
        return this._desafioModel.findOneAndUpdate({_id}, {$set: desafio}).exec()
    }
}

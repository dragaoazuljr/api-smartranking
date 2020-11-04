import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {

    constructor(
        @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>
    ){}
    
    async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<void>{
        const { email } = criarJogadorDto;
        const jogadorEncontrado = await this.jogadorModel.findOne({email}).exec();
        if(jogadorEncontrado){
            throw new BadRequestException('jogador ja cadastrado')
        }else {
            await this.criar(criarJogadorDto);
        }
    }

    async atualizarJogador(atualizarJogadorDto: AtualizarJogadorDto, _id: string): Promise<void>{
        const jogadorEncontrado = await this.jogadorModel.findOne({_id}).exec();
        if(jogadorEncontrado){
            await this.atualizar(atualizarJogadorDto, _id);
        }else {
            throw new NotFoundException('jogador não encontrado')
        }
    }
    
    private async criar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        const jogadorCriado = new this.jogadorModel(criarJogadorDto);
        return await jogadorCriado.save();
    }

    private async atualizar(atualizarJogadorDto: AtualizarJogadorDto, _id: string): Promise<Jogador>{
        return await this.jogadorModel.findOneAndUpdate({_id}, {$set: atualizarJogadorDto}).exec();
    }

    async deletarJogador(_id: string): Promise <any>{
        const jogadorEncontrado = await this.jogadorModel.findOne({_id}).exec();
        if(!jogadorEncontrado){
            throw new NotFoundException('jogador não encontrado');
        }
        return await this.jogadorModel.deleteOne({_id}).exec();
    }

    async consultarJogadoresPeloId(_id: string): Promise<Jogador> {
        const jogador = await this.jogadorModel.findOne({_id}).exec();
        if(!jogador){
            throw new NotFoundException(`Jogador com id ${_id} não encontrado`)
        }
        return jogador
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return await this.jogadorModel.find().exec();
    }

}

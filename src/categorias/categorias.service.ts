import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriasDto } from './dtos/criar-categorias.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {

    constructor(
        @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
        private readonly _jogadorService: JogadoresService
    ){}

    async criarCategoria(criarCategoriaDto: CriarCategoriasDto): Promise<void>{
         let categoria = await this.categoriaModel.findOne({categoria: criarCategoriaDto.categoria}).exec();
         if(categoria){
             throw new BadRequestException('categoria ja cadastrada');
         }else {
             this.criar(criarCategoriaDto);
         }
    }

    private async criar(criarCategoriaDto: CriarCategoriasDto) {
        let categoria = new this.categoriaModel(criarCategoriaDto);
        categoria.save();
    }

    async buscarTodasCategorias(){
        return this.categoriaModel.find().populate('jogadores').exec();
    }

    async jogadorPertenceAlgumaCategoria(idJogador){
        const jogadores = await this._jogadorService.consultarTodosJogadores();
        const jogadoresFilters = jogadores.filter(jogador => jogador._id == idJogador);

        if(jogadoresFilters.length == 0){
            throw new BadRequestException(`jogador ${idJogador} invalido`)
        }

        return await this.categoriaModel.findOne().where('jogadores').in(idJogador).exec();
    }

    async buscarCategoriaPorId(_id: string){
        let categoria = await this.categoriaModel.findOne({_id}).exec();

        if(!categoria){
            throw new NotFoundException('categoria nao encontrada')
        }

        return categoria
    }

    async atualizarCategoria(atualizatCategoria: AtualizarCategoriaDto, _id: string): Promise<Categoria>{
        let categoria = await this.categoriaModel.findOne({_id}).exec();
        if(!categoria){
            throw new NotFoundException('categoria nao encontrada');
        }
        return this.categoriaModel.findByIdAndUpdate({_id}, atualizatCategoria).exec();
    }

    async atribuirJogadorACategoria(categoria: string, idJogador: string): Promise<Categoria>{
        let jogador = await this._jogadorService.consultarJogadoresPeloId(idJogador)
        let categoriaEncontrada = await this.categoriaModel.findOne({categoria}).exec();
        if(!categoriaEncontrada){
            throw new NotFoundException('Categoria nao encontrada')
        }
        if(categoriaEncontrada.jogadores.find(jog => jog._id == idJogador)){
            throw new BadRequestException('Jogador ja pertence a essa categoria');
        }
        categoriaEncontrada.jogadores.push(jogador)
        return this.categoriaModel.findOneAndUpdate({categoria}, categoriaEncontrada).exec();
    }

}

import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriasDto } from './dtos/criar-categorias.dto';
import { Categoria } from './interfaces/categoria.interface';

@Controller('api/v1/categorias')
export class CategoriasController {

    constructor(
        private readonly _categoriasService: CategoriasService
    ) {}

    @Post()
    @UsePipes(ValidationPipe)
    async criarCategorias (
        @Body() criarCategoriasDto: CriarCategoriasDto): Promise<void> {
            return await this._categoriasService.criarCategoria(criarCategoriasDto)
    }

    @Get()
    async buscarTodasCategorias(){
        return await this._categoriasService.buscarTodasCategorias();
    }

    @Get('/:_id')
    @UsePipes(ValidationPipe)
    async buscarCategoriasPorId(@Param('_id') _id: string){
        return await this._categoriasService.buscarCategoriaPorId(_id)
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async atualizarCategorias(
        @Body() atualizarCategoria: AtualizarCategoriaDto,
        @Param('_id') _id: string): Promise<Categoria>{
            return await this._categoriasService.atualizarCategoria(atualizarCategoria, _id)
        }

    @Post('/:categoria/jogadores/:idJogador')
    @UsePipes(ValidationPipe)
    async atribuirJogadoresACategoria(
        @Param('categoria') categoria: string,
        @Param('idJogador') idJogador: string ) {
            return await this._categoriasService.atribuirJogadorACategoria(categoria, idJogador)
        }
}

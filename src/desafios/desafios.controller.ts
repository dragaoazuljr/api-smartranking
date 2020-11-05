import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';

@Controller('api/v1/desafios')
export class DesafiosController {

    constructor(
        private readonly _desafioService: DesafiosService
    ) {}

    @Get()
    async buscarTodosDesafios(
        @Query('idJogador') idJogador: string
    ): Promise<Desafio[]>{
        if(idJogador){
            return this._desafioService.consultarDesafiosDeUmJogador(idJogador);
        }else {
            return this._desafioService.buscarTodosDesafios();
        }
    }

    @Post()
    @UsePipes(ValidationPipe)
    async cadastrarDesafio(
        @Body() criarDesafioDto: CriarDesafioDto): Promise<Desafio>{
            return this._desafioService.criarDesafio(criarDesafioDto)
        }
    
    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async atualizarDesafio(
        @Body() atualizarDesafioDto: AtualizarDesafioDto,
        @Param('_id') _id: string){
            return this._desafioService.atualizarDesafio(_id, atualizarDesafioDto)
        }
    
    @Delete('/:_id')
    @UsePipes(ValidationPipe)
    async apagarDesafio(
        @Param('_id') _id: string) {
            return this._desafioService.deletarDesafio(_id)
        }
}

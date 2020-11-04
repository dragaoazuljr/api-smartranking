import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { JogadoresValidacaoParametrosPipe } from './pipes/jogadores-validacao-parametros.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {

    constructor(
        private readonly _jogadorService: JogadoresService
    ){}

    @Post()
    @UsePipes(ValidationPipe)
    async criarJogador(@Body() criarJogadorDto: CriarJogadorDto){
        await this._jogadorService.criarJogador(criarJogadorDto);
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async atualizarJogador(
        @Body() atualizarJogadorDto: AtualizarJogadorDto, 
        @Param('_id', JogadoresValidacaoParametrosPipe) _id: string
    ){
        await this._jogadorService.atualizarJogador({...atualizarJogadorDto}, _id);
    }

    @Get()
    async consultarJogadores(): Promise<Jogador[]> {
        return this._jogadorService.consultarTodosJogadores();
    }

    @Get('/:_id')
    async consultarJogador(
        @Param('_id', JogadoresValidacaoParametrosPipe) _id: string
    ): Promise<Jogador> {
        return this._jogadorService.consultarJogadoresPeloId(_id)
    }

    @Delete('/:_id')
    async deletarJogador(
        @Param('_id', JogadoresValidacaoParametrosPipe) _id: string
    ){
        this._jogadorService.deletarJogador(_id)
    }
}

import { Body, Controller, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { PartidasService } from './partidas.service';

@Controller('api/v1/partidas')
export class PartidasController {

    constructor(
        private readonly _partidaService: PartidasService
    ){}

    @Post('/:idDesafio')
    @UsePipes(ValidationPipe)
    async atribuirPartidaADesafio(
        @Body() atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
        @Param('idDesafio') _id: string){
            return this._partidaService.atribuirPartidaADesafio(_id, atribuirDesafioPartidaDto)
        }
}

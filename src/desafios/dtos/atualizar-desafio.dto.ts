import { IsNotEmpty, IsDateString } from "class-validator";
import { DesafioStatus } from "../interfaces/desafio.interface";

export class AtualizarDesafioDto {
    
    @IsNotEmpty()
    @IsDateString()
    dataHoraDesafio: Date;

    @IsNotEmpty()
    status: DesafioStatus
}
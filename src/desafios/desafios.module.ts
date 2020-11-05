import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { JogadoresModule } from 'src/jogadores/jogadores.module';
import { DesafiosController } from './desafios.controller';
import { DesafiosService } from './desafios.service';
import { DesafioSchema } from './interfaces/desafio.schema';

@Module({
  controllers: [DesafiosController],
  imports: [
    MongooseModule.forFeature([{schema: DesafioSchema, name: 'Desafio'}]),
    JogadoresModule,
    CategoriasModule
  ],
  exports: [DesafiosService],
  providers: [DesafiosService]
})
export class DesafiosModule {}

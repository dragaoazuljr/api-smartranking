import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DesafiosModule } from 'src/desafios/desafios.module';
import { PartidaSchema } from './interfaces/partidas.schema';
import { PartidasController } from './partidas.controller';
import { PartidasService } from './partidas.service';

@Module({
  controllers: [PartidasController],
  providers: [PartidasService],
  imports: [
    MongooseModule.forFeature([{name: 'Partidas', schema: PartidaSchema}]),
    DesafiosModule
  ]
})
export class PartidasModule {}

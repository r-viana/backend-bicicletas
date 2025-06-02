import { Module } from '@nestjs/common';
import { BicicletasController } from './bicicletas.controller';
import { BicicletasService } from './bicicletas.service';

@Module({
  controllers: [BicicletasController],
  providers: [BicicletasService]
})
export class BicicletasModule {}

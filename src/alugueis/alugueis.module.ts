import { Module } from '@nestjs/common';
import { AlugueisController } from './alugueis.controller';
import { AlugueisService } from './alugueis.service';

@Module({
  controllers: [AlugueisController],
  providers: [AlugueisService]
})
export class AlugueisModule {}

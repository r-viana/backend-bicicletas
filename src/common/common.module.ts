import { Module } from '@nestjs/common';
import { HttpClienteService } from './http-cliente/http-cliente.service';
import { ValidacaoService } from './validacao/validacao.service';

@Module({
  providers: [HttpClienteService, ValidacaoService]
})
export class CommonModule {}

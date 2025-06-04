import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BicicletasService } from './bicicletas.service';
import { CriarBicicletaDto } from '../dtos/criaBicicleta.dto';
import { AtualizarBicicletaDto } from '../dtos/atualizaBicicleta.dto';

@Controller('bicicletas')
export class BicicletasController {
  constructor(private readonly bicicletasService: BicicletasService) {}

  @Post()
  criar(@Body() criarBicicletaDto: CriarBicicletaDto) {
    return this.bicicletasService.criar(criarBicicletaDto);
  }

  @Get()
  buscarTodas() {
    return this.bicicletasService.buscarTodas();
  }

  @Get('disponiveis')
  buscarDisponiveis() {
    return this.bicicletasService.buscarDisponiveis();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.bicicletasService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() atualizarBicicletaDto: AtualizarBicicletaDto,
  ) {
    return this.bicicletasService.atualizar(id, atualizarBicicletaDto);
  }

  @Delete(':id')
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.bicicletasService.remover(id);
  }

  @Post(':id/transferir/:estacaoId')
  transferir(
    @Param('id', ParseIntPipe) id: number,
    @Param('estacaoId', ParseIntPipe) estacaoId: number,
  ) {
    return this.bicicletasService.transferir(id, estacaoId);
  }
}

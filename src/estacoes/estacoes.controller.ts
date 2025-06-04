import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EstacoesService } from './estacoes.service';
import { CriarEstacaoDto } from '../dtos/criaEstacao.dto';
import { AtualizarEstacaoDto } from '../dtos/atualizaEstacao.dto';

@Controller('estacoes')
export class EstacoesController {
  constructor(private readonly estacoesService: EstacoesService) {}

  @Post()
  criar(@Body() criarEstacaoDto: CriarEstacaoDto) {
    return this.estacoesService.criar(criarEstacaoDto);
  }

  @Get()
  buscarTodas() {
    return this.estacoesService.buscarTodos();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.estacoesService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() atualizarEstacaoDto: AtualizarEstacaoDto,
  ) {
    return this.estacoesService.atualizar(id, atualizarEstacaoDto);
  }

  @Delete(':id')
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.estacoesService.remover(id);
  }

  @Get(':id/bicicletas')
  buscarBicicletas(@Param('id', ParseIntPipe) id: number) {
    return this.estacoesService.buscarBicicletasDaEstacao(id);
  }

  @Get(':id/bicicletas/disponiveis')
  buscarBicicletasDisponiveis(@Param('id', ParseIntPipe) id: number) {
    return this.estacoesService.buscarBicicletasDisponiveisDaEstacao(id);
  }

  @Post(':id/ativar')
  ativar(@Param('id', ParseIntPipe) id: number) {
    return this.estacoesService.ativar(id);
  }

  @Post(':id/desativar')
  desativar(@Param('id', ParseIntPipe) id: number) {
    return this.estacoesService.desativar(id);
  }
}

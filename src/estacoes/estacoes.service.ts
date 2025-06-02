import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estacao } from '../entities/estacao.entity';
import { CriarEstacaoDto } from '../dtos/criaEstacao.dto';
import { AtualizarEstacaoDto } from '../dtos/atualizaEstacao.dto';

@Injectable()
export class EstacoesService {
  constructor(
    @InjectRepository(Estacao)
    private estacaoRepository: Repository<Estacao>,
  ) {}

  async criar(criarEstacaoDto: CriarEstacaoDto): Promise<Estacao> {
    const estacao = this.estacaoRepository.create(criarEstacaoDto);
    return await this.estacaoRepository.save(estacao);
  }

  async buscarTodos(): Promise<Estacao[]> {
    return await this.estacaoRepository.find({
      relations: ['bicicletas'],
      order: { nome: 'ASC' },
    });
  }

  async buscarPorId(id: number): Promise<Estacao> {
    const estacao = await this.estacaoRepository.findOne({
      where: { id },
      relations: ['bicicletas'],
    });

    if (!estacao) {
      throw new NotFoundException(`Estação com ID ${id} não encontrada`);
    }

    return estacao;
  }

  async atualizar(id: number, atualizarEstacaoDto: AtualizarEstacaoDto): Promise<Estacao> {
    await this.buscarPorId(id); // Verifica se existe
    await this.estacaoRepository.update(id, atualizarEstacaoDto);
    return this.buscarPorId(id);
  }

  async remover(id: number): Promise<void> {
    const estacao = await this.buscarPorId(id);
    await this.estacaoRepository.remove(estacao);
  }

  async buscarDisponiveis(): Promise<Estacao[]> {
    return await this.estacaoRepository.find({
      where: { ativo: true },
      relations: ['bicicletas'],
    });
  }
}

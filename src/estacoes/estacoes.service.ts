import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estacao } from '../entities/estacao.entity';
import { CriarEstacaoDto } from '../dtos/criaEstacao.dto';
import { AtualizarEstacaoDto } from '../dtos/atualizaEstacao.dto';
import { Bicicleta } from 'src/entities/bicicleta.entity';

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
      where: { ativa: true },
      relations: ['bicicletas'],
    });
  }

  async buscarBicicletasDaEstacao(id: number): Promise<Bicicleta[]> {
    const estacao = await this.estacaoRepository.findOne({
      where: { id },
      relations: ['bicicletas'],
    });
  
    if (!estacao) {
      throw new NotFoundException(`Estação com ID ${id} não encontrada`);
    }
  
    return estacao.bicicletas || [];
  }

  async buscarBicicletasDisponiveisDaEstacao(id: number): Promise<Bicicleta[]> {
    const estacao = await this.estacaoRepository.findOne({
      where: { id },
      relations: ['bicicletas'],
    });
  
    if (!estacao) {
      throw new NotFoundException(`Estação com ID ${id} não encontrada`);
    }
  
    return estacao.bicicletas?.filter(bike => bike.disponivel) || [];
  }

  async ativar(id: number): Promise<Estacao> {
    const estacao = await this.buscarPorId(id); // Usa método existente
    estacao.ativa = true;
    return await this.estacaoRepository.save(estacao);
  }
  
  async desativar(id: number): Promise<Estacao> {
    const estacao = await this.buscarPorId(id); // Usa método existente  
    estacao.ativa = false;
    return await this.estacaoRepository.save(estacao);
  }
}

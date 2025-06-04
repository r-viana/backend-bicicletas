import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bicicleta } from '../entities/bicicleta.entity';
import { Estacao } from '../entities/estacao.entity';
import { CriarBicicletaDto } from '../dtos/criaBicicleta.dto';
import { AtualizarBicicletaDto } from '../dtos/atualizaBicicleta.dto';

@Injectable()
export class BicicletasService {
  constructor(
    @InjectRepository(Bicicleta)
    private bicicletaRepository: Repository<Bicicleta>,
    @InjectRepository(Estacao)
    private estacaoRepository: Repository<Estacao>,
  ) {}

  async criar(criarBicicletaDto: CriarBicicletaDto): Promise<Bicicleta> {
    // Verifica se a estação existe
    const estacao = await this.estacaoRepository.findOne({
      where: { id: criarBicicletaDto.estacao_id }
    });

    if (!estacao) {
      throw new NotFoundException(`Estação com ID ${criarBicicletaDto.estacao_id} não encontrada`);
    }

    const bicicleta = this.bicicletaRepository.create(criarBicicletaDto);
    return await this.bicicletaRepository.save(bicicleta);
  }

  async buscarTodas(): Promise<Bicicleta[]> {
    return await this.bicicletaRepository.find({
      relations: ['estacao'],
      order: { num_serie: 'ASC' },
    });
  }

  async buscarPorId(id: number): Promise<Bicicleta> {
    const bicicleta = await this.bicicletaRepository.findOne({
      where: { id },
      relations: ['estacao', 'alugueis'],
    });

    if (!bicicleta) {
      throw new NotFoundException(`Bicicleta com ID ${id} não encontrada`);
    }

    return bicicleta;
  }

  async atualizar(id: number, atualizarBicicletaDto: AtualizarBicicletaDto): Promise<Bicicleta> {
    await this.buscarPorId(id); // Verifica se existe

    // Se mudou a estação, verifica se a nova estação existe
    if (atualizarBicicletaDto.estacao_id) {
      const estacao = await this.estacaoRepository.findOne({
        where: { id: atualizarBicicletaDto.estacao_id }
      });

      if (!estacao) {
        throw new NotFoundException(`Estação com ID ${atualizarBicicletaDto.estacao_id} não encontrada`);
      }
    }

    await this.bicicletaRepository.update(id, atualizarBicicletaDto);
    return this.buscarPorId(id);
  }

  async remover(id: number): Promise<void> {
    const bicicleta = await this.buscarPorId(id);
    await this.bicicletaRepository.remove(bicicleta);
  }

  async buscarDisponiveis(): Promise<Bicicleta[]> {
    return await this.bicicletaRepository.find({
      where: { disponivel: true },
      relations: ['estacao'],
    });
  }

  async buscarPorEstacao(estacaoId: number): Promise<Bicicleta[]> {
    return await this.bicicletaRepository.find({
      where: { estacao_id: estacaoId },
      relations: ['estacao'],
    });
  }

  async alterarDisponibilidade(id: number, disponivel: boolean): Promise<Bicicleta> {
    await this.buscarPorId(id);
    await this.bicicletaRepository.update(id, { disponivel });
    return this.buscarPorId(id);
  }
}

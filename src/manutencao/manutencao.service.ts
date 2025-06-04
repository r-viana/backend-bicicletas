import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manutencao, StatusManutencao, TipoManutencao } from '../entities/manutencao.entity';
import { Bicicleta } from '../entities/bicicleta.entity';
import { CriarManutencaoDto } from '../dtos/criaManutencao.dto';
import { AtualizarManutencaoDto } from '../dtos/atualizaManutencao.dto';

@Injectable()
export class ManutencaoService {
  constructor(
    @InjectRepository(Manutencao)
    private manutencaoRepository: Repository<Manutencao>,
    @InjectRepository(Bicicleta)
    private bicicletaRepository: Repository<Bicicleta>,
  ) {}

  async criar(criarManutencaoDto: CriarManutencaoDto): Promise<Manutencao> {
    // Verifica se a bicicleta existe
    const bicicleta = await this.bicicletaRepository.findOne({
      where: { id: criarManutencaoDto.bicicleta_id }
    });

    if (!bicicleta) {
      throw new NotFoundException(`Bicicleta com ID ${criarManutencaoDto.bicicleta_id} não encontrada`);
    }

    // Verifica se já existe manutenção ativa para esta bicicleta
    const manutencaoAtiva = await this.manutencaoRepository.findOne({
      where: { 
        bicicleta_id: criarManutencaoDto.bicicleta_id,
        status: StatusManutencao.EM_ANDAMENTO 
      }
    });

    if (manutencaoAtiva) {
      throw new BadRequestException('Bicicleta já possui manutenção em andamento');
    }

    const manutencao = this.manutencaoRepository.create({
      ...criarManutencaoDto,
      status: StatusManutencao.AGENDADA,
      tipo: criarManutencaoDto.tipo || TipoManutencao.PREVENTIVA,
    });

    return await this.manutencaoRepository.save(manutencao);
  }

  async buscarTodos(): Promise<Manutencao[]> {
    return await this.manutencaoRepository.find({
      relations: ['bicicleta'],
      order: { data_agendada: 'ASC' },
    });
  }

  async buscarPorId(id: number): Promise<Manutencao> {
    const manutencao = await this.manutencaoRepository.findOne({
      where: { id },
      relations: ['bicicleta'],
    });

    if (!manutencao) {
      throw new NotFoundException(`Manutenção com ID ${id} não encontrada`);
    }

    return manutencao;
  }

  async atualizar(id: number, atualizarManutencaoDto: AtualizarManutencaoDto): Promise<Manutencao> {
    await this.buscarPorId(id); // Verifica se existe

    await this.manutencaoRepository.update(id, atualizarManutencaoDto);
    return this.buscarPorId(id);
  }

  async remover(id: number): Promise<void> {
    const manutencao = await this.buscarPorId(id);
    
    if (manutencao.status === StatusManutencao.EM_ANDAMENTO) {
      throw new BadRequestException('Não é possível remover manutenção em andamento');
    }

    await this.manutencaoRepository.remove(manutencao);
  }

  async iniciar(id: number, responsavel?: string): Promise<Manutencao> {
    const manutencao = await this.buscarPorId(id);

    if (manutencao.status !== StatusManutencao.AGENDADA) {
      throw new BadRequestException('Manutenção deve estar agendada para ser iniciada');
    }

    // Marca a bicicleta como indisponível
    await this.bicicletaRepository.update(manutencao.bicicleta_id, {
      disponivel: false
    });

    // Atualiza a manutenção
    await this.manutencaoRepository.update(id, {
      status: StatusManutencao.EM_ANDAMENTO,
      data_inicio: new Date(),
      responsavel: responsavel || manutencao.responsavel,
    });

    return this.buscarPorId(id);
  }

  async finalizar(id: number, custo?: number): Promise<Manutencao> {
    const manutencao = await this.buscarPorId(id);

    if (manutencao.status !== StatusManutencao.EM_ANDAMENTO) {
      throw new BadRequestException('Manutenção deve estar em andamento para ser finalizada');
    }

    const agora = new Date();

    // Marca a bicicleta como disponível e atualiza última manutenção
    await this.bicicletaRepository.update(manutencao.bicicleta_id, {
      disponivel: true,
      ultima_manutencao: agora,
    });

    // Finaliza a manutenção
    await this.manutencaoRepository.update(id, {
      status: StatusManutencao.CONCLUIDA,
      data_conclusao: agora,
      custo: custo || 0,
    });

    return this.buscarPorId(id);
  }

  async cancelar(id: number): Promise<Manutencao> {
    const manutencao = await this.buscarPorId(id);

    if (manutencao.status === StatusManutencao.CONCLUIDA) {
      throw new BadRequestException('Não é possível cancelar manutenção já concluída');
    }

    // Se estava em andamento, libera a bicicleta
    if (manutencao.status === StatusManutencao.EM_ANDAMENTO) {
      await this.bicicletaRepository.update(manutencao.bicicleta_id, {
        disponivel: true
      });
    }

    await this.manutencaoRepository.update(id, {
      status: StatusManutencao.CANCELADA,
    });

    return this.buscarPorId(id);
  }

  async buscarPorStatus(status: StatusManutencao): Promise<Manutencao[]> {
    return await this.manutencaoRepository.find({
      where: { status },
      relations: ['bicicleta'],
      order: { data_agendada: 'ASC' },
    });
  }

  async buscarPorBicicleta(bicicletaId: number): Promise<Manutencao[]> {
    return await this.manutencaoRepository.find({
      where: { bicicleta_id: bicicletaId },
      relations: ['bicicleta'],
      order: { data_agendada: 'DESC' },
    });
  }

  async buscarAgendadas(): Promise<Manutencao[]> {
    return this.buscarPorStatus(StatusManutencao.AGENDADA);
  }

  async buscarEmAndamento(): Promise<Manutencao[]> {
    return this.buscarPorStatus(StatusManutencao.EM_ANDAMENTO);
  }
}

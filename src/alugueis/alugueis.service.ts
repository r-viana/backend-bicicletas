import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aluguel, StatusAluguel } from '../entities/aluguel.entity';
import { Bicicleta } from '../entities/bicicleta.entity';
import { Estacao } from '../entities/estacao.entity';
import { CriarAluguelDto } from '../dtos/criaAluguel.dto';
import { AtualizarAluguelDto } from '../dtos/atualizaAluguel.dto';

@Injectable()
export class AlugueisService {
  constructor(
    @InjectRepository(Aluguel)
    private aluguelRepository: Repository<Aluguel>,
    @InjectRepository(Bicicleta)
    private bicicletaRepository: Repository<Bicicleta>,
    @InjectRepository(Estacao)
    private estacaoRepository: Repository<Estacao>,
  ) {}

  async criar(criarAluguelDto: CriarAluguelDto): Promise<Aluguel> {
    // Verifica se a bicicleta existe e está disponível
    const bicicleta = await this.bicicletaRepository.findOne({
      where: { id: criarAluguelDto.bicicleta_id }
    });

    if (!bicicleta) {
      throw new NotFoundException(`Bicicleta com ID ${criarAluguelDto.bicicleta_id} não encontrada`);
    }

    if (!bicicleta.disponivel) {
      throw new BadRequestException('Bicicleta não está disponível para aluguel');
    }

    // Verifica se a estação origem existe
    const estacaoOrigem = await this.estacaoRepository.findOne({
      where: { id: criarAluguelDto.estacao_origem_id }
    });

    if (!estacaoOrigem) {
      throw new NotFoundException(`Estação origem com ID ${criarAluguelDto.estacao_origem_id} não encontrada`);
    }

    // Marca a bicicleta como indisponível
    await this.bicicletaRepository.update(
      criarAluguelDto.bicicleta_id, 
      { disponivel: false }
    );

    // Cria o aluguel
    const aluguel = this.aluguelRepository.create({
      ...criarAluguelDto,
      status: StatusAluguel.ATIVO,
      inicio: new Date(),
    });

    return await this.aluguelRepository.save(aluguel);
  }

  async buscarTodos(): Promise<Aluguel[]> {
    return await this.aluguelRepository.find({
      relations: ['bicicleta', 'estacaoOrigem', 'estacaoDestino'],
      order: { inicio: 'DESC' },
    });
  }

  async buscarPorId(id: number): Promise<Aluguel> {
    const aluguel = await this.aluguelRepository.findOne({
      where: { id },
      relations: ['bicicleta', 'estacaoOrigem', 'estacaoDestino'],
    });

    if (!aluguel) {
      throw new NotFoundException(`Aluguel com ID ${id} não encontrado`);
    }

    return aluguel;
  }

  async finalizar(id: number, estacaoDestinoId: number): Promise<Aluguel> {
    const aluguel = await this.buscarPorId(id);

    if (aluguel.status !== StatusAluguel.ATIVO) {
      throw new BadRequestException('Aluguel não está ativo');
    }

    // Verifica se a estação destino existe
    const estacaoDestino = await this.estacaoRepository.findOne({
      where: { id: estacaoDestinoId }
    });

    if (!estacaoDestino) {
      throw new NotFoundException(`Estação destino com ID ${estacaoDestinoId} não encontrada`);
    }

    const agora = new Date();
    const tempoAluguel = agora.getTime() - aluguel.inicio.getTime();
    const horas = Math.ceil(tempoAluguel / (1000 * 60 * 60)); // Converte para horas
    const valorTotal = horas * 5; // R$ 5 por hora

    // Atualiza o aluguel
    await this.aluguelRepository.update(id, {
      estacao_destino_id: estacaoDestinoId,
      fim: agora,
      status: StatusAluguel.FINALIZADO,
      valor_total: valorTotal,
    });

    // Marca a bicicleta como disponível e atualiza sua estação
    await this.bicicletaRepository.update(aluguel.bicicleta_id, {
      disponivel: true,
      estacao_id: estacaoDestinoId,
    });

    return this.buscarPorId(id);
  }

  async cancelar(id: number): Promise<Aluguel> {
    const aluguel = await this.buscarPorId(id);

    if (aluguel.status !== StatusAluguel.ATIVO) {
      throw new BadRequestException('Aluguel não está ativo');
    }

    // Marca o aluguel como cancelado
    await this.aluguelRepository.update(id, {
      status: StatusAluguel.CANCELADO,
      fim: new Date(),
    });

    // Marca a bicicleta como disponível novamente
    await this.bicicletaRepository.update(aluguel.bicicleta_id, {
      disponivel: true,
    });

    return this.buscarPorId(id);
  }

  async buscarAtivos(): Promise<Aluguel[]> {
    return await this.aluguelRepository.find({
      where: { status: StatusAluguel.ATIVO },
      relations: ['bicicleta', 'estacaoOrigem'],
    });
  }

  async buscarPorUsuario(usuarioId: number): Promise<Aluguel[]> {
    return await this.aluguelRepository.find({
      where: { usuario_id: usuarioId },
      relations: ['bicicleta', 'estacaoOrigem', 'estacaoDestino'],
      order: { inicio: 'DESC' },
    });
  }
}

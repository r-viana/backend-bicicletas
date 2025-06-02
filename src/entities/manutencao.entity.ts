import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Bicicleta } from './bicicleta.entity';

export enum TipoManutencao {
  PREVENTIVA = 'preventiva',
  CORRETIVA = 'corretiva',
  EMERGENCIAL = 'emergencial'
}

export enum StatusManutencao {
  AGENDADA = 'agendada',
  EM_ANDAMENTO = 'em_andamento',
  CONCLUIDA = 'concluida',
  CANCELADA = 'cancelada'
}

@Entity('manutencoes')
export class Manutencao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bicicleta_id: number;

  @Column({
    type: 'enum',
    enum: TipoManutencao,
    default: TipoManutencao.PREVENTIVA
  })
  tipo: TipoManutencao;

  @Column({
    type: 'enum',
    enum: StatusManutencao,
    default: StatusManutencao.AGENDADA
  })
  status: StatusManutencao;

  @Column({ length: 500 })
  descricao: string;

  @Column({ type: 'date' })
  data_agendada: Date;

  @Column({ type: 'timestamp', nullable: true })
  data_inicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  data_conclusao: Date;

  @Column({ length: 100, nullable: true })
  responsavel: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  custo: number;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;

  @ManyToOne(() => Bicicleta, bicicleta => bicicleta.manutencoes)
  @JoinColumn({ name: 'bicicleta_id' })
  bicicleta: Bicicleta;
}

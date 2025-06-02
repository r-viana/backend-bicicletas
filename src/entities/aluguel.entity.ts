import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Bicicleta } from './bicicleta.entity';
import { Estacao } from './estacao.entity';

export enum StatusAluguel {
  ATIVO = 'ativo',
  FINALIZADO = 'finalizado',
  CANCELADO = 'cancelado'
}

@Entity('alugueis')
export class Aluguel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario_id: number;

  @Column()
  bicicleta_id: number;

  @Column()
  estacao_origem_id: number;

  @Column({ nullable: true })
  estacao_destino_id: number;

  @Column({
    type: 'enum',
    enum: StatusAluguel,
    default: StatusAluguel.ATIVO
  })
  status: StatusAluguel;

  @CreateDateColumn()
  inicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fim: Date;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  valor_total: number;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;

  @ManyToOne(() => Bicicleta, bicicleta => bicicleta.alugueis)
  @JoinColumn({ name: 'bicicleta_id' })
  bicicleta: Bicicleta;

  @ManyToOne(() => Estacao, estacao => estacao.alugueis_origem)
  @JoinColumn({ name: 'estacao_origem_id' })
  estacao_origem: Estacao;

  @ManyToOne(() => Estacao, estacao => estacao.alugueis_destino)
  @JoinColumn({ name: 'estacao_destino_id' })
  estacao_destino: Estacao;
}

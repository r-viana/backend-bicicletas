import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Estacao } from './estacao.entity';
import { Aluguel } from './aluguel.entity';
import { Manutencao } from './manutencao.entity';

export enum StatusBicicleta {
  DISPONIVEL = 'disponivel',
  ALUGADA = 'alugada',
  MANUTENCAO = 'manutencao',
  FORA_DE_SERVICO = 'fora_de_servico'
}

@Entity('bicicletas')
export class Bicicleta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  num_serie: string;

  @Column()
  estacao_id: number;

  @Column()
  disponivel: boolean;


  @Column({ type: 'date', nullable: true })
  ultima_manutencao: Date;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;

  @ManyToOne(() => Estacao, estacao => estacao.bicicletas)
  @JoinColumn({ name: 'estacao_id' })
  estacao: Estacao;

  @OneToMany(() => Aluguel, aluguel => aluguel.bicicleta)
  alugueis: Aluguel[];

  @OneToMany(() => Manutencao, manutencao => manutencao.bicicleta)
  manutencoes: Manutencao[];
}

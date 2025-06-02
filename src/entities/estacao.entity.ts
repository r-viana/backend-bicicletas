import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Bicicleta } from './bicicleta.entity';
import { Aluguel } from './aluguel.entity';

@Entity('estacoes')
export class Estacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 255 })
  endereco: string;

  @Column({length: 50})
  googlePlusCode: string;

    @Column()
  capacidade_total: number;

  @Column({ default: 0 })
  vagas_disponiveis: number;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  criado_em: Date;

  @UpdateDateColumn()
  atualizado_em: Date;

  @OneToMany(() => Bicicleta, bicicleta => bicicleta.estacao)
  bicicletas: Bicicleta[];

  @OneToMany(() => Aluguel, aluguel => aluguel.estacao_origem)
  alugueis_origem: Aluguel[];

  @OneToMany(() => Aluguel, aluguel => aluguel.estacao_destino)
  alugueis_destino: Aluguel[];
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Aluguel } from './aluguel.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column()
  senha: string;

  @Column({ unique: true, length: 11 })
  cpf: string;

  @Column({ length: 15, nullable: true })
  telefone: string;

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  data_cadastro: Date;

  @OneToMany(() => Aluguel, aluguel => aluguel.usuario)
  alugueis: Aluguel[];
}

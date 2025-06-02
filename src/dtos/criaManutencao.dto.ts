import { IsNumber, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsString, MaxLength, MinLength } from 'class-validator';
import { TipoManutencao, StatusManutencao } from '../entities/manutencao.entity';

export class CriarManutencaoDto {
  @IsNumber()
  @IsNotEmpty()
  bicicleta_id: number;

  @IsEnum(TipoManutencao)
  @IsOptional()
  tipo?: TipoManutencao;

  @IsEnum(StatusManutencao)
  @IsOptional()
  status?: StatusManutencao;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  descricao: string;

  @IsDateString()
  @IsNotEmpty()
  data_agendada: string;

  @IsDateString()
  @IsOptional()
  data_inicio?: string;

  @IsDateString()
  @IsOptional()
  data_conclusao?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  responsavel?: string;

  @IsNumber()
  @IsOptional()
  custo?: number;
}

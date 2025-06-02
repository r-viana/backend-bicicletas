import { IsNumber, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { StatusAluguel } from '../entities/aluguel.entity';

export class CriarAluguelDto {
  @IsNumber()
  @IsNotEmpty()
  usuario_id: number;

  @IsNumber()
  @IsNotEmpty()
  bicicleta_id: number;

  @IsNumber()
  @IsNotEmpty()
  estacao_origem_id: number;

  @IsNumber()
  @IsOptional()
  estacao_destino_id?: number;

  @IsEnum(StatusAluguel)
  @IsOptional()
  status?: StatusAluguel;

  @IsDateString()
  @IsOptional()
  fim?: string;

  @IsNumber()
  @IsOptional()
  valor_total?: number;
}

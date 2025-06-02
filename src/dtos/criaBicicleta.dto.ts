import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsDateString, MaxLength, MinLength } from 'class-validator';

export class CriarBicicletaDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  num_serie: string;

  @IsNumber()
  @IsNotEmpty()
  estacao_id: number;

  @IsBoolean()
  @IsOptional()
  disponivel?: boolean;

  @IsDateString()
  @IsOptional()
  ultima_manutencao?: string;
}

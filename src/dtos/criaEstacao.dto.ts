import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, MaxLength, MinLength } from 'class-validator';

export class CriarEstacaoDto { //criando com verificadores
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  nome: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  endereco: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  googlePlusCode: string;

  @IsNumber()
  @IsNotEmpty()
  capacidade_total: number;

  @IsNumber()
  @IsOptional()
  vagas_disponiveis?: number;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}

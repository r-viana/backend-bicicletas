import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches } from 'class-validator';

export class CriarUsuarioDto {
  @IsString()
  @MaxLength(100)
  nome: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  senha: string;

  @IsString()
  @Matches(/^\d{11}$/, { message: 'CPF deve ter 11 dígitos numéricos' })
  cpf: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  telefone?: string;
}

import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches, IsBoolean } from 'class-validator';

export class AtualizarUsuarioDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  senha?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$/, { message: 'CPF deve ter 11 dígitos numéricos' })
  cpf?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  telefone?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
// O DTO AtualizarUsuarioDto permite a atualização parcial dos dados do usuário, onde cada campo é opcional.
// Isso significa que você pode atualizar apenas os campos que deseja modificar, sem a necessidade de enviar todos os dados do usuário novamente.
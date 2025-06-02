import { PartialType } from '@nestjs/mapped-types';
import { CriarBicicletaDto } from './criaBicicleta.dto';

export class AtualizarBicicletaDto extends PartialType(CriarBicicletaDto) {}

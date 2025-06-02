import { PartialType } from '@nestjs/mapped-types';
import { CriarEstacaoDto } from './criaEstacao.dto';

export class AtualizarEstacaoDto extends PartialType(CriarEstacaoDto) {}

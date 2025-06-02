import { PartialType } from '@nestjs/mapped-types';
import { CriarManutencaoDto } from './criaManutencao.dto';

export class AtualizarManutencaoDto extends PartialType(CriarManutencaoDto) {}

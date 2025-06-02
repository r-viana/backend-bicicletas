import { PartialType } from '@nestjs/mapped-types';
import { CriarAluguelDto } from './criaAluguel.dto';

export class AtualizarAluguelDto extends PartialType(CriarAluguelDto) {}

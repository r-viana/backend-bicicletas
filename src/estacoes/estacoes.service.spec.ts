import { Test, TestingModule } from '@nestjs/testing';
import { EstacoesService } from './estacoes.service';

describe('EstacoesService', () => {
  let service: EstacoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstacoesService],
    }).compile();

    service = module.get<EstacoesService>(EstacoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

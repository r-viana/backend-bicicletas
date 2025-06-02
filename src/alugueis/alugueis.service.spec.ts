import { Test, TestingModule } from '@nestjs/testing';
import { AlugueisService } from './alugueis.service';

describe('AlugueisService', () => {
  let service: AlugueisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlugueisService],
    }).compile();

    service = module.get<AlugueisService>(AlugueisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

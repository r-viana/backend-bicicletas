import { Test, TestingModule } from '@nestjs/testing';
import { EstacoesController } from './estacoes.controller';

describe('EstacoesController', () => {
  let controller: EstacoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstacoesController],
    }).compile();

    controller = module.get<EstacoesController>(EstacoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

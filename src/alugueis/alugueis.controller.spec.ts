import { Test, TestingModule } from '@nestjs/testing';
import { AlugueisController } from './alugueis.controller';

describe('AlugueisController', () => {
  let controller: AlugueisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlugueisController],
    }).compile();

    controller = module.get<AlugueisController>(AlugueisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

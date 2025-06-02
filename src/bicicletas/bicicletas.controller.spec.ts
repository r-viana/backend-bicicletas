import { Test, TestingModule } from '@nestjs/testing';
import { BicicletasController } from './bicicletas.controller';

describe('BicicletasController', () => {
  let controller: BicicletasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BicicletasController],
    }).compile();

    controller = module.get<BicicletasController>(BicicletasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

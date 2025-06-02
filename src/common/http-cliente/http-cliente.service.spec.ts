import { Test, TestingModule } from '@nestjs/testing';
import { HttpClienteService } from './http-cliente.service';

describe('HttpClienteService', () => {
  let service: HttpClienteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpClienteService],
    }).compile();

    service = module.get<HttpClienteService>(HttpClienteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

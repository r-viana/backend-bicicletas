import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../config/database.config';
import { Estacao } from '../entities/estacao.entity';
import { Bicicleta } from '../entities/bicicleta.entity';
import { Aluguel } from '../entities/aluguel.entity';
import { Manutencao } from '../entities/manutencao.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
        entities: [Estacao, Bicicleta, Aluguel, Manutencao],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Estacao, Bicicleta, Aluguel, Manutencao]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

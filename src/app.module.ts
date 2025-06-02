import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { EstacoesModule } from './estacoes/estacoes.module';
import { BicicletasModule } from './bicicletas/bicicletas.module';
import { AlugueisModule } from './alugueis/alugueis.module';
import { ManutencaoModule } from './manutencao/manutencao.module';
import { RelatoriosModule } from './relatorios/relatorios.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, authConfig],
    }),
    DatabaseModule,
    AuthModule,
    EstacoesModule,
    BicicletasModule,
    AlugueisModule,
    ManutencaoModule,
    RelatoriosModule,
    UsuariosModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AccountModule } from './account/account.module';
import { PrismaModule } from 'src/infrastructure/database/connection/prisma.module';
import configuration from 'src/shared/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    PrismaModule,
    AccountModule,
  ],
})
export class AppModule {}

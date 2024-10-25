import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountRepository } from '@/src/domain/repositories/account.repository';
import { PrismaModule } from '@/src/infrastructure/database/connection/prisma.module';
import { GenerateAccountNumberUtils } from '@/src/shared/utils/generate-account-number';
import { CustomCacheModule } from '../transaction/cache/cache.module';
import { CheckAccountUtils } from '../utils/check-account.utils';

@Module({
  imports: [PrismaModule, CustomCacheModule],
  controllers: [AccountController],
  providers: [
    AccountRepository,
    AccountService,
    GenerateAccountNumberUtils,
    CheckAccountUtils,
  ],
})
export class AccountModule {}

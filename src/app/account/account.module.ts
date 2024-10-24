import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountRepository } from '@/src/domain/repositories/account.repository';
import { PrismaModule } from '@/src/infrastructure/database/connection/prisma.module';
import { GenerateAccountNumberUtils } from '@/src/shared/utils/generate-account-number';

@Module({
  imports: [PrismaModule],
  controllers: [AccountController],
  providers: [AccountRepository, AccountService, GenerateAccountNumberUtils],
})
export class AccountModule {}

import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionRepository } from '@/src/domain/repositories/transaction.repository';
import { PrismaModule } from '@/src/infrastructure/database/connection/prisma.module';
import { AccountRepository } from '@/src/domain/repositories/account.repository';
import { QueueModule } from './queues/queue.module';
import { DepositProcessor } from './queues/processors/deposit.processor';
import { CheckJobsDeposit } from './queues/processors/check-jobs.processor';
import { WithdrawProcessor } from './queues/processors/withdraw.processor';
import { TransferProcessor } from './queues/processors/transfer.processor';

@Module({
  imports: [QueueModule, PrismaModule],
  controllers: [TransactionController],
  providers: [
    TransactionRepository,
    TransactionService,
    AccountRepository,
    DepositProcessor,
    WithdrawProcessor,
    TransferProcessor,
    CheckJobsDeposit,
  ],
  exports: [DepositProcessor],
})
export class TransactionModule {}

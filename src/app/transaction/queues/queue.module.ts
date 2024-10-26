import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TransactionsMicroservice } from '../microservices/transactions.microservice';
import { CustomCacheModule } from '../cache/cache.module';
import { AccountRepository } from '@/src/domain/repositories/account.repository';
import { TransactionRepository } from '@/src/domain/repositories/transaction.repository';
import { CheckAccountUtils } from '../../utils/check-account.utils';
import { AccountsToCacheUtils } from '../../utils/accounts-to-cache.utils';
import { DepositConsumer } from './consumer/deposit.consumer';
import { DepositProcessor } from './processors/deposit.processor';
import { WithdrawConsumer } from './consumer/withdraw.consumer';
import { WithdrawProcessor } from './processors/withdraw.processor';
import { TransferConsumer } from './consumer/transfer.consumer';
import { TransferProcessor } from './processors/transfer.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: `${process.env.REDIS_HOST}`,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue(
      {
        name: 'deposit',
      },
      {
        name: 'withdraw',
      },
      {
        name: 'transfer',
      },
    ),
    CustomCacheModule,
  ],
  providers: [
    DepositProcessor,
    DepositConsumer,
    WithdrawProcessor,
    WithdrawConsumer,
    TransferProcessor,
    TransferConsumer,
    TransactionsMicroservice,
    AccountRepository,
    TransactionRepository,
    CheckAccountUtils,
    AccountsToCacheUtils,
  ],
  exports: [BullModule],
})
export class QueueModule {}

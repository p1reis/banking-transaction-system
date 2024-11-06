import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { AccountRepository } from '@/src/domain/repositories/account.repository';
import { TransactionRepository } from '@/src/domain/repositories/transaction.repository';

import { CustomCacheModule } from '../cache/cache.module';
import { DepositService } from '../services/deposit.service';
import { WithdrawService } from '../services/withdraw.service';
import { TransferService } from '../services/transfer.service';
import { CreateTransactionService } from '../services/create-transaction.service';
import { DepositConsumer } from './consumer/deposit.consumer';
import { WithdrawConsumer } from './consumer/withdraw.consumer';
import { TransferConsumer } from './consumer/transfer.consumer';
import { DepositProcessor } from './processors/deposit.processor';
import { WithdrawProcessor } from './processors/withdraw.processor';
import { TransferProcessor } from './processors/transfer.processor';
import { CheckAccountUtils } from '../../utils/check-account.utils';
import { AccountsToCacheUtils } from '../../utils/accounts-to-cache.utils';

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

    AccountRepository,
    TransactionRepository,

    DepositService,
    WithdrawService,
    TransferService,
    CreateTransactionService,

    DepositConsumer,
    WithdrawConsumer,
    TransferConsumer,

    DepositProcessor,
    WithdrawProcessor,
    TransferProcessor,

    CheckAccountUtils,
    AccountsToCacheUtils,
  ],
  exports: [BullModule],
})
export class QueueModule { }

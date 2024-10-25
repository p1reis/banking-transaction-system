import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TransactionWorker } from './transaction.worker';
import { TransactionQueue } from './transaction.queue';
import { TransactionsMicroservice } from '../microservices/transactions.microservice';
import { CustomCacheModule } from '../cache/cache.module';
import { AccountRepository } from '@/src/domain/repositories/account.repository';
import { TransactionRepository } from '@/src/domain/repositories/transaction.repository';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: `${process.env.REDIS_HOST}`,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({
      name: 'transactions',
    }),
    CustomCacheModule,
  ],
  providers: [
    TransactionQueue,
    TransactionWorker,
    TransactionsMicroservice,
    AccountRepository,
    TransactionRepository,
  ],
  exports: [BullModule],
})
export class QueueModule {}

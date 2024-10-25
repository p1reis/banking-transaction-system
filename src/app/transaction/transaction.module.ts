import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionRepository } from '@/src/domain/repositories/transaction.repository';
import { PrismaModule } from '@/src/infrastructure/database/connection/prisma.module';
import { AccountRepository } from '@/src/domain/repositories/account.repository';
import { QueueModule } from './queues/queue.module';
import { CustomCacheModule } from './cache/cache.module';

@Module({
  imports: [PrismaModule, QueueModule, CustomCacheModule],
  controllers: [TransactionController],
  providers: [TransactionRepository, TransactionService, AccountRepository],
})
export class TransactionModule {}

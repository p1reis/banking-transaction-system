import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { CreateDepositDto } from '../dto/create-deposit.dto';

@Injectable()
export class TransactionQueue {
  constructor(@InjectQueue('transactions') private transactionQueue: Queue) {}

  async addDepositJob(jobData: CreateDepositDto) {
    await this.transactionQueue.add('deposit', jobData);
  }
}

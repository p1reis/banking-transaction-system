import { Processor, WorkerHost } from '@nestjs/bullmq';
import { TransactionsMicroservice } from '../microservices/transactions.microservice';
import { Job } from 'bullmq';
import {
  DepositMapper,
  TransferMapper,
  WithdrawMapper,
} from '../../mappers/transaction.mapper';

@Processor('transactions')
export class TransactionWorker extends WorkerHost {
  constructor(
    private readonly transactionMicroService: TransactionsMicroservice,
  ) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'deposit': {
        console.log('processing deposit');
        const { type, from, value } = job.data;
        await this.transactionMicroService.processDeposit({
          type,
          from,
          value,
        });
        const transaction =
          await this.transactionMicroService.createTransaction({
            type,
            cuid: from,
            value,
          });
        return DepositMapper.map(transaction);
      }
      case 'withdraw': {
        console.log('processing withdraw');
        const { type, from, value } = job.data;
        await this.transactionMicroService.processWithdraw({
          type,
          from,
          value,
        });
        const transaction =
          await this.transactionMicroService.createTransaction({
            type,
            cuid: from,
            value,
          });
        return WithdrawMapper.map(transaction);
      }
      case 'transfer': {
        console.log('processing transfer');
        const { type, from, to, value } = job.data;
        await this.transactionMicroService.processTransfer({
          type,
          from,
          to,
          value,
        });
        const transaction =
          await this.transactionMicroService.createTransaction({
            type,
            cuid: from,
            value,
          });
        return TransferMapper.map(transaction);
      }
    }
  }
}

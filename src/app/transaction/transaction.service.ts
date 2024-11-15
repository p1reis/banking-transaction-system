import { Injectable } from '@nestjs/common';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CheckJobsDeposit } from './queues/processors/check-jobs.processor';
import { DepositProcessor } from './queues/processors/deposit.processor';
import { TransferProcessor } from './queues/processors/transfer.processor';
import { WithdrawProcessor } from './queues/processors/withdraw.processor';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly depositProcessor: DepositProcessor,
    private readonly withdrawProcessor: WithdrawProcessor,
    private readonly transferProcessor: TransferProcessor,
    private readonly checkingJobs: CheckJobsDeposit,
  ) { }

  async deposit({ type, destiny, amount }: CreateDepositDto) {
    return await this.depositProcessor.execute({ type, destiny, amount });
  }

  async withdraw({ type, origin, amount }: CreateWithdrawDto) {
    return await this.withdrawProcessor.execute({ type, origin, amount });
  }

  async transfer({ type, origin, destiny, amount }: CreateTransferDto) {
    return await this.transferProcessor.execute({ type, origin, destiny, amount });
  }

  async checkJobs() {
    return await this.checkingJobs.process();
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }
  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class TransactionService {
  constructor(
    @InjectQueue('transactions') private transactionQueue: Queue,
  ) { }

  async deposit({ type, from, value }: CreateDepositDto) {
    try {
      const job = await this.transactionQueue.add('deposit', {
        type,
        from,
        value,
      });
      console.log('Job added:', job.id);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to deposit.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async withdraw({ type, from, value }: CreateWithdrawDto) {
    try {
      const job = await this.transactionQueue.add('withdraw', {
        type,
        from,
        value,
      });
      console.log('Job added:', job.id);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to withdraw.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async transfer({ type, from, to, value }: CreateTransferDto) {
    try {
      const job = await this.transactionQueue.add('transfer', {
        type,
        from,
        to,
        value,
      });
      console.log('Job added:', job.id);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to transfer.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateWithdrawDto } from '../../dto/create-withdraw.dto';

@Injectable()
export class WithdrawProcessor {
  constructor(@InjectQueue('withdraw') private withdrawQueue: Queue) { }

  async execute({ type, origin, amount }: CreateWithdrawDto) {
    await this.withdrawQueue.add('withdraw', { type, origin, amount });
  }
}

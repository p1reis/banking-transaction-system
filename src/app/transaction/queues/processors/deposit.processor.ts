import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateDepositDto } from '../../dto/create-deposit.dto';

@Injectable()
export class DepositProcessor {
  constructor(@InjectQueue('deposit') private depositQueue: Queue) { }

  async execute({ type, destiny, amount }: CreateDepositDto) {
    await this.depositQueue.add('deposit', { type, destiny, amount });
  }
}

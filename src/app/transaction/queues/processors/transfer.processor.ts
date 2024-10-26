import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateTransferDto } from '../../dto/create-transfer.dto';

@Injectable()
export class TransferProcessor {
    constructor(@InjectQueue('transfer') private transferQueue: Queue) { }

    async execute({ type, from, to, value }: CreateTransferDto) {
        await this.transferQueue.add('transfer', { type, from, to, value });
    }
}
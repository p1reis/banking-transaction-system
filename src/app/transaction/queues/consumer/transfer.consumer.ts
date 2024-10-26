import { Job, Queue } from 'bull';
import { InjectQueue, OnQueueActive, OnQueueCompleted, OnQueueFailed, OnQueueWaiting, Process, Processor } from '@nestjs/bull';
import { TransactionTypeEnum } from '@prisma/client';

import { TransactionsMicroservice } from '../../microservices/transactions.microservice';
import { HttpStatus, Logger } from '@nestjs/common';

interface genericJob {
    type: TransactionTypeEnum,
    from: string,
    to: string,
    value: number
}

@Processor('transfer')
export class TransferConsumer {
    constructor(
        private readonly transactionMicroService: TransactionsMicroservice,
        @InjectQueue('transfer') private transferQueue: Queue,
    ) { }

    @Process('transfer')
    async execute(job: Job<genericJob>) {
        const { type, from, to, value } = job.data;
        await this.transactionMicroService.processTransfer({
            type,
            from,
            to,
            value,
        });
    }

    @OnQueueWaiting()
    async onWaiting(job: Job) {
        const waiting = await this.transferQueue.getWaiting();
        const jobsWaiting = waiting.length || '0';
        Logger.log(`There is ${jobsWaiting} jobs waiting to get process.`);
    }

    @OnQueueCompleted()
    async onCompleted(job: Job) {
        const jobsNumber = await this.transferQueue.count();
        const jobsActive = await this.transferQueue.getActiveCount();

        if (jobsNumber == 0 && jobsActive == 0) {
            await this.transferQueue.empty()
            Logger.log(`Queue is already completed.`);
        }
    }

    @OnQueueActive()
    onActive(job: Job) {
        Logger.log(`Processing ${job.name} in job ${job.id}...`);
    }

    @OnQueueFailed()
    public async onQueueFailed(job: Job): Promise<void> {
        Logger.log(`${job.name} in job ${job.id} has failed: ${job.failedReason}`, HttpStatus.BAD_REQUEST);
    }
}

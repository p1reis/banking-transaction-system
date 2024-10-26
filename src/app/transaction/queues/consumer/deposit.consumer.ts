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

@Processor('deposit')
export class DepositConsumer {
    constructor(
        private readonly transactionMicroService: TransactionsMicroservice,
        @InjectQueue('deposit') private depositQueue: Queue,
    ) { }

    @Process('deposit')
    async execute(job: Job<genericJob>) {
        const { type, from, value } = job.data;
        await this.transactionMicroService.processDeposit({
            type,
            from,
            value,
        });
    }

    @OnQueueWaiting()
    async onWaiting(job: Job) {
        const waiting = await this.depositQueue.getWaiting();
        const jobsWaiting = waiting.length || '0';
        Logger.log(`There is ${jobsWaiting} jobs waiting to get process.`);
    }

    @OnQueueCompleted()
    async onCompleted(job: Job) {
        const jobsNumber = await this.depositQueue.count();
        const jobsActive = await this.depositQueue.getActiveCount();

        if (jobsNumber == 0 && jobsActive == 0) {
            await this.depositQueue.empty()
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

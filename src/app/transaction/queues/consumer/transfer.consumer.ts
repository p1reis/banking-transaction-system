import { Job, Queue } from 'bull';
import {
  InjectQueue,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueWaiting,
  Process,
  Processor,
} from '@nestjs/bull';

import { TransferService } from '../../services/transfer.service';
import { Logger } from '@nestjs/common';
import { TransferJob } from '@/src/domain/interfaces/jobs.interface';

@Processor('transfer')
export class TransferConsumer {
  constructor(
    private readonly transferService: TransferService,
    @InjectQueue('transfer') private transferQueue: Queue,
  ) { }

  @Process('transfer')
  async execute(job: Job<TransferJob>) {
    const { type, origin, destiny, amount } = job.data;
    await this.transferService.execute({
      type,
      origin,
      destiny,
      amount,
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
      await this.transferQueue.empty();
      Logger.log(`Queue is already completed.`);
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    Logger.log(`Processing ${job.name} in job ${job.id}...`);
  }

  @OnQueueFailed()
  public async onQueueFailed(job: Job): Promise<void> {
    Logger.log(
      `${job.name} in job ${job.id} has failed: ${job.failedReason}`
    );
  }
}

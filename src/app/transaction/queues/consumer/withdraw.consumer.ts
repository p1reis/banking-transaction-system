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

import { WithdrawService } from '../../services/withdraw.service';
import { HttpStatus, Logger } from '@nestjs/common';
import { WithdrawJob } from '@/src/domain/interfaces/jobs.interface';

@Processor('withdraw')
export class WithdrawConsumer {
  constructor(
    private readonly withdrawService: WithdrawService,
    @InjectQueue('withdraw') private withdrawQueue: Queue,
  ) { }

  @Process('withdraw')
  async execute(job: Job<WithdrawJob>) {
    const { type, origin, amount } = job.data;
    await this.withdrawService.execute({
      type,
      origin,
      amount,
    });
  }

  @OnQueueWaiting()
  async onWaiting(job: Job) {
    const waiting = await this.withdrawQueue.getWaiting();
    const jobsWaiting = waiting.length || '0';
    Logger.log(`There is ${jobsWaiting} jobs waiting to get process.`);
  }

  @OnQueueCompleted()
  async onCompleted(job: Job) {
    const jobsNumber = await this.withdrawQueue.count();
    const jobsActive = await this.withdrawQueue.getActiveCount();

    if (jobsNumber == 0 && jobsActive == 0) {
      await this.withdrawQueue.empty();
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
      `${job.name} in job ${job.id} has failed: ${job.failedReason}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

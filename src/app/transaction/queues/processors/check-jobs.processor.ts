import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class CheckJobsDeposit {
    constructor(
        @InjectQueue('deposit') private depositQueue: Queue,
        @InjectQueue('withdraw') private withdrawQueue: Queue,
        @InjectQueue('transfer') private transferQueue: Queue,
    ) { }

    async process() {
        const depositwaitingJobs = await this.depositQueue.getWaiting();
        const depositactiveJobs = await this.depositQueue.getActive();
        const depositcompletedJobs = await this.depositQueue.getCompleted();
        const depositfailedJobs = await this.depositQueue.getFailed();

        const withdrawWaitingJobs = await this.withdrawQueue.getWaiting();
        const withdrawActiveJobs = await this.withdrawQueue.getActive();
        const withdrawCompletedJobs = await this.withdrawQueue.getCompleted();
        const withdrawFailedJobs = await this.withdrawQueue.getFailed();

        const transferWaitingJobs = await this.transferQueue.getWaiting();
        const transferActiveJobs = await this.transferQueue.getActive();
        const transferCompletedJobs = await this.transferQueue.getCompleted();
        const transferFailedJobs = await this.transferQueue.getFailed();

        return {
            deposit: {
                waitingJobs: depositwaitingJobs,
                activeJobs: depositactiveJobs,
                completedJobs: depositcompletedJobs,
                failedJobs: depositfailedJobs,
            },
            withdraw: {
                waitingJobs: withdrawWaitingJobs,
                activeJobs: withdrawActiveJobs,
                completedJobs: withdrawCompletedJobs,
                failedJobs: withdrawFailedJobs,
            },
            transfer: {
                waitingJobs: transferWaitingJobs,
                activeJobs: transferActiveJobs,
                completedJobs: transferCompletedJobs,
                failedJobs: transferFailedJobs,
            }
        }
    }
}

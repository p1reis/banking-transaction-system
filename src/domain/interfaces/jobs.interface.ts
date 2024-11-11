import { TransactionTypeEnum } from "@prisma/client";

export interface DepositJob {
    type: TransactionTypeEnum;
    destiny: string;
    amount: number;
}

export interface WithdrawJob {
    type: TransactionTypeEnum;
    origin: string;
    amount: number;
}

export interface TransferJob {
    type: TransactionTypeEnum;
    origin: string;
    destiny: string;
    amount: number;
}
import { TransactionTypeEnum } from "@prisma/client";

export interface DepositJob {
    type: TransactionTypeEnum;
    destiny: string;
    value: number;
}

export interface WithdrawJob {
    type: TransactionTypeEnum;
    origin: string;
    value: number;
}

export interface TransferJob {
    type: TransactionTypeEnum;
    origin: string;
    destiny: string;
    value: number;
}
import { TransactionTypeEnum } from "@prisma/client";

export interface GenericJob {
    type: TransactionTypeEnum;
    from: string;
    to: string;
    value: number;
}
import { Injectable } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/database/connection/prisma.service';

@Injectable()
export class TransactionRepository {
    constructor(private readonly prisma: PrismaService) { }

    private get transaction() {
        return this.prisma.transaction;
    }

    async create(data: Prisma.TransactionCreateInput): Promise<Transaction> {
        const transaction = await this.transaction.create({
            data,
            include: {
                accountFrom: {
                    include: { transactionsFrom: { select: { cuid: true } } },
                }
            }
        });

        return transaction;
    }

    async findUnique(cuid: string): Promise<Transaction> {
        return await this.transaction.findUnique({
            where: {
                cuid,
            },
        });
    }
}

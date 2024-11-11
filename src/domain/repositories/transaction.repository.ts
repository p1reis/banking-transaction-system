import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/database/connection/prisma.service';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) { }

  private get transaction() {
    return this.prisma.transaction;
  }

  private get account() {
    return this.prisma.account;
  }

  processDeposit(destiny: string, value: number) {
    const deposit = this.account.update({
      where: { cuid: destiny },
      data: {
        balance: {
          increment: value,
        },
      },
    });

    const transaction = this.transaction.create({
      data: {
        type: 'DEPOSIT',
        accountFrom: { connect: { cuid: destiny } },
        value
      },
      include: {
        accountFrom: {
          select: {
            firstName: true,
            lastName: true,
            number: true,
            balance: true,
          },
        },
      },
    });

    return this.prisma.$transaction([deposit, transaction]);
  }

  processWithdraw(from: string, value: number) {
    const withdraw = this.account.update({
      where: { cuid: from },
      data: {
        balance: {
          decrement: value,
        },
      },
    });

    const transaction = this.transaction.create({
      data: {
        type: 'WITHDRAW',
        accountFrom: { connect: { cuid: from } },
        value
      },
      include: {
        accountFrom: {
          select: {
            firstName: true,
            lastName: true,
            number: true,
            balance: true,
          },
        },
      },
    });

    return this.prisma.$transaction([withdraw, transaction]);
  }

  processTransfer(origin: string, destiny: string, value: number) {
    const updatedOrigin = this.account.update({
      where: { cuid: origin },
      data: {
        balance: {
          decrement: value,
        },
      },
    });

    const updatedDestiny = this.account.update({
      where: { cuid: destiny },
      data: {
        balance: {
          increment: value,
        },
      },
    });

    const transaction = this.transaction.create({
      data: {
        type: 'TRANSFER',
        accountFrom: { connect: { cuid: origin } },
        accountTo: { connect: { cuid: destiny } },
        value
      },
      include: {
        accountFrom: {
          select: {
            firstName: true,
            lastName: true,
            number: true,
            balance: true,
          },
        },
        accountTo: {
          select: {
            firstName: true,
            lastName: true,
            number: true,
            balance: true,
          },
        },
      },
    });

    return this.prisma.$transaction([updatedOrigin, updatedDestiny, transaction]);
  }

  async findUnique(cuid: string): Promise<Transaction> {
    return await this.transaction.findUnique({
      where: {
        cuid,
      },
    });
  }
}

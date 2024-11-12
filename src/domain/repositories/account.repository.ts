import { Injectable } from '@nestjs/common';
import { Account, Prisma } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/database/connection/prisma.service';

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) { }

  private get account() {
    return this.prisma.account;
  }

  async create(data: Prisma.AccountCreateInput): Promise<Account> {
    const account = await this.account.create({
      data,
    });

    return account;
  }

  async findUnique(number: string): Promise<Account> {
    return await this.account.findUnique({
      where: {
        number,
      },
    });
  }

  async findAll(): Promise<Account[]> {
    return await this.account.findMany();
  }

  async findUniqueByName(
    firstName: string,
    lastName: string,
  ): Promise<Account> {
    return await this.account.findFirst({
      where: {
        AND: {
          firstName: { equals: firstName },
          lastName: { equals: lastName },
        },
      },
    });
  }
}

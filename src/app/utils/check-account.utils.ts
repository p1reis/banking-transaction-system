import { Inject, Injectable } from '@nestjs/common';

import { AccountRepository } from '@/src/domain/repositories/account.repository';
import { Account } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CheckAccountUtils {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly accountRepository: AccountRepository,
  ) {}

  async checkIfAccountExists({ firstName, lastName }): Promise<Account> {
    const accountsInCache = await this.cacheManager.get<string>(`accounts`);

    if (accountsInCache) {
      const accounts = JSON.parse(accountsInCache);

      const account = accounts.find(
        (acc: { firstName: string; lastName: string }) =>
          acc.firstName === firstName && acc.lastName === lastName,
      );

      return account ? account : null;
    }

    const accountInDatabase = await this.accountRepository.findUniqueByName(
      firstName,
      lastName,
    );

    return accountInDatabase ? accountInDatabase : null;
  }
}

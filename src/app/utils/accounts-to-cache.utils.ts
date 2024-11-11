import { Inject, Injectable } from '@nestjs/common';

import { Account } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AccountsToCacheUtils {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  async sendingAccountsToCache(accounts: Account[]) {
    const accountsToCache = accounts.map((account) => ({
      cuid: account.cuid,
      number: account.number,
      name: `${account.firstName} ${account.lastName}`,
      balance: account.balance,
    }));

    await this.cacheManager.set(`accounts`, JSON.stringify(accountsToCache));
  }
}

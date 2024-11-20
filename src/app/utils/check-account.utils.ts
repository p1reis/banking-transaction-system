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
  ) { }

  async checkIfAccountExistsByCpf(cpf): Promise<Account> {
    const accountsInCache = await this.cacheManager.get<string>(`accounts`);

    if (accountsInCache) {
      const accounts = JSON.parse(accountsInCache);

      const account = accounts.find(
        (acc: { cpf: string }) =>
          acc.cpf === cpf,
      );

      return account ? account : null;
    }

    const accountInDatabase = await this.accountRepository.findUnique(cpf);

    return accountInDatabase ? accountInDatabase : null;
  }

  async checkIfAccountExistsByNumber(number: string): Promise<Account> {
    const accountsInCache = await this.cacheManager.get<string>(`accounts`);

    if (accountsInCache) {
      const accounts = JSON.parse(accountsInCache);

      const account = accounts.find(
        (acc: { number: string }) => acc.number === number,
      );

      return account ? account : null;
    }

    const accountInDatabase = await this.accountRepository.findUnique(number);

    return accountsInCache ? accountInDatabase : null;
  }
}

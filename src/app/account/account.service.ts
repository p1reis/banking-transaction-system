import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { AccountRepository } from '@/src/domain/repositories/account.repository';

import { CreateAccountMapped } from '@/src/domain/interfaces/accountMapped.interface';
import { GenerateAccountNumberUtils } from '@/src/shared/utils/generate-account-number';

import { AccountMapper } from '../mappers/account.mapper';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { CheckAccountUtils } from '../utils/check-account.utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AccountService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly accountRepository: AccountRepository,
    private readonly generateAccountNumber: GenerateAccountNumberUtils,
    private readonly checkAccountUtils: CheckAccountUtils,
  ) { }

  async createAccount({
    firstName,
    lastName,
    balance,
  }: CreateAccountDto): Promise<CreateAccountMapped> {
    try {
      const accountExists = await this.checkAccountUtils.checkIfAccountExists({
        firstName,
        lastName,
      });

      if (accountExists) {
        throw new HttpException(
          'Account already exists.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (balance < 0) {
        throw new HttpException(
          'Balance must be a positive value.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newAccount = await this.accountRepository.create({
        number: this.generateAccountNumber.generateAccountNumber(),
        firstName,
        lastName,
        balance,
      });

      const accounts = await this.accountRepository.findAll();
      const accountsToCache = accounts.map((account) => ({
        number: account.number,
        firstName: account.firstName,
        lastName: account.lastName,
        createdAt: account.createdAt,
      }));

      await this.cacheManager.set(`accounts`, JSON.stringify(accountsToCache));

      return AccountMapper.newAccount(newAccount);
    } catch (error) {
      throw new HttpException(
        `Account creation failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAllAccounts() {
    return `This action returns all account`;
  }

  async findOneAccount(number: string) {
    const accountIsInCache = await this.checkAccountUtils.accountIsInCache(number)
    const accountInDatabase = await this.accountRepository.findUnique(number);

    if (accountIsInCache) {
      return AccountMapper.accountFound(accountIsInCache);
    }

    if (accountInDatabase) {
      return AccountMapper.accountFound(accountInDatabase);
    }

    throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
  }

  updateAccount(number: string, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${number} account`;
  }

  removeAccount(number: string) {
    return `This action removes a #${number} account`;
  }
}

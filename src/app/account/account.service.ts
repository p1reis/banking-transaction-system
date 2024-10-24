import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AccountRepository } from '@/src/domain/repositories/account.repository';

import { AccountMapped } from '@/src/domain/interfaces/accountMapped.interface';
import { GenerateAccountNumberUtils } from '@/src/shared/utils/generate-account-number';

import { AccountMapper } from '../mappers/account.mapper';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly generateAccountNumber: GenerateAccountNumberUtils,
  ) {}

  async createAccount({
    firstName,
    lastName,
    balance,
  }: CreateAccountDto): Promise<AccountMapped> {
    console.log('Criando conta com:', { firstName, lastName, balance });

    if (balance < 0) {
      throw new HttpException(
        'Balance must be a positive value.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const account = await this.accountRepository.create({
      number: this.generateAccountNumber.generateAccountNumber(),
      firstName,
      lastName,
      balance,
    });

    return AccountMapper.map(account);
  }

  findAllAccounts() {
    return `This action returns all account`;
  }

  findOneAccount(number: string) {
    return `This action returns a #${number} account`;
  }

  updateAccount(number: string, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${number} account`;
  }

  removeAccount(number: string) {
    return `This action removes a #${number} account`;
  }
}

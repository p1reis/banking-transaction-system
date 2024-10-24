import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRepository } from '@/src/domain/repositories/transaction.repository';
import { AccountRepository } from '@/src/domain/repositories/account.repository';
import { DepositMapper, WithdrawMapper } from '../mappers/transaction.mapper';
import { DepositMapped, WithdrawMapped } from '@/src/domain/interfaces/transactionsMapped.interface';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly transactionRepository: TransactionRepository,
  ) { }

  async deposit({
    type,
    from,
    value,
  }: CreateDepositDto): Promise<DepositMapped> {
    const account = this.accountRepository.findUnique(from);

    if (!account) {
      throw new HttpException('Account not found.', HttpStatus.NOT_FOUND);
    }
    const cuid = (await account).cuid;

    try {
      const newBalance = (await account).balance + value;

      await this.accountRepository.updateBalance(cuid, newBalance);
      const transaction = await this.createTransaction({ type, cuid, value });

      return DepositMapper.map(transaction);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to create deposit.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async withdraw({
    type,
    from,
    value,
  }: CreateWithdrawDto): Promise<WithdrawMapped> {
    const account = this.accountRepository.findUnique(from);

    if (!account) {
      throw new HttpException('Account not found.', HttpStatus.NOT_FOUND);
    }

    const cuid = (await account).cuid;
    const balance = (await account).balance;

    if (balance < value) {
      throw new HttpException(
        `Your withdraw value can't be lower than your current balance`,
        HttpStatus.BAD_REQUEST)
    }

    try {
      const newBalance = balance - value;

      await this.accountRepository.updateBalance(cuid, newBalance);
      const transaction = await this.createTransaction({ type, cuid, value });

      return WithdrawMapper.map(transaction);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to realize withdraw.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createTransaction({ type, cuid, value }: CreateTransactionDto) {
    return await this.transactionRepository.create({
      type,
      accountFrom: { connect: { cuid: cuid } },
      value,
    });
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }
  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}

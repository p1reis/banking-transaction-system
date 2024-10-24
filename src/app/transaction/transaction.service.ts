import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRepository } from '@/src/domain/repositories/transaction.repository';
import { AccountRepository } from '@/src/domain/repositories/account.repository';
import { DepositMapper, TransferMapper, WithdrawMapper } from '../mappers/transaction.mapper';
import { DepositMapped, TransferMapped, WithdrawMapped } from '@/src/domain/interfaces/transactionsMapped.interface';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';

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
    const account = await this.accountRepository.findUnique(from);

    if (!account) {
      throw new HttpException('Account not found.', HttpStatus.NOT_FOUND);
    }
    const cuid = account.cuid;

    try {
      const newBalance = account.balance + value;

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
    const account = await this.accountRepository.findUnique(from);

    if (!account) {
      throw new HttpException('Account not found.', HttpStatus.NOT_FOUND);
    }

    const cuid = account.cuid;
    const balance = account.balance;

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

  async transfer({
    type,
    from,
    to,
    value,
  }: CreateTransferDto): Promise<TransferMapped> {
    const accountFrom = await this.accountRepository.findUnique(from);
    const accountTo = await this.accountRepository.findUnique(to);

    if (!accountFrom) {
      throw new HttpException('Origin account not found.', HttpStatus.NOT_FOUND);
    }

    if (!accountTo) {
      throw new HttpException('Destiny account not found.', HttpStatus.NOT_FOUND);
    }

    const origin = {
      cuid: accountFrom.cuid,
      balance: accountFrom.balance,
      value: value,
    }

    const destiny = {
      cuid: accountTo.cuid,
      balance: accountTo.balance,
      value: value,
    }

    try {

      await this.accountRepository.updateBalance(origin.cuid, origin.balance - value);
      await this.accountRepository.updateBalance(destiny.cuid, destiny.balance + value);
      const transaction = await this.createTransaction({ type, cuid: origin.cuid, to: destiny.cuid, value });

      return TransferMapper.map(transaction);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to realize transfer.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createTransaction({ type, cuid, to, value }: CreateTransactionDto) {
    return await this.transactionRepository.create({
      type,
      accountFrom: { connect: { cuid: cuid } },
      accountTo: { connect: { cuid: to } },
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

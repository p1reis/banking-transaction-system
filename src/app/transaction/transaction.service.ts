import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRepository } from '@/src/domain/repositories/transaction.repository';
import { AccountRepository } from '@/src/domain/repositories/account.repository';
import { DepositMapper } from '../mappers/transaction.mapper';
import { DepositMapped } from '@/src/domain/interfaces/transactionsMapped.interface';
import { CreateDepositDto } from './dto/create-deposit.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

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

      await this.accountRepository.addValue(cuid, newBalance);
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

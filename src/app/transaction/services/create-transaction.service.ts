import { TransactionRepository } from '@/src/domain/repositories/transaction.repository';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

export class CreateTransactionService {
    constructor(
        private readonly transactionRepository: TransactionRepository,
    ) { }

    async execute({ type, cuid, to, value }: CreateTransactionDto) {
        const transaction = await this.transactionRepository.create({
            type,
            accountFrom: { connect: { cuid: cuid } },
            accountTo: { connect: { cuid: to != undefined ? to : cuid } },
            value,
        });

        return transaction;
    }
}

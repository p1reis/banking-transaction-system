import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../../src/app/transaction/transaction.controller';
import { TransactionService } from '../../src/app/transaction/transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [TransactionService],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

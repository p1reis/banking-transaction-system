import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Patch('deposit')
  @UsePipes(new ValidationPipe({ transform: true }))
  async deposit(@Body() createDepositDto: CreateDepositDto) {
    return await this.transactionService.deposit(createDepositDto);
  }

  @Patch('withdraw')
  @UsePipes(new ValidationPipe({ transform: true }))
  async withdraw(@Body() createWithdrawDto: CreateWithdrawDto) {
    return await this.transactionService.withdraw(createWithdrawDto);
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}

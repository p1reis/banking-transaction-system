import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    return await this.accountService.createAccount(createAccountDto);
  }

  @Get()
  findAll() {
    return this.accountService.findAllAccounts();
  }

  @Get(':number')
  findOne(@Param('number') number: string) {
    return this.accountService.findOneAccount(number);
  }

  @Patch(':number')
  update(
    @Param('number') number: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountService.updateAccount(number, updateAccountDto);
  }

  @Delete(':number')
  remove(@Param('number') number: string) {
    return this.accountService.removeAccount(number);
  }
}

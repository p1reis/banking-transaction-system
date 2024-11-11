import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { TransactionTypeEnum } from '@prisma/client';

export class CreateWithdrawDto {
  @IsEnum(TransactionTypeEnum, { message: `Transaction type must be WITHDRAW` })
  @IsNotEmpty({ message: `Transaction type must be WITHDRAW` })
  type: TransactionTypeEnum;

  @IsString()
  @IsNotEmpty({ message: `"Origin" field must be an valid account number` })
  origin: string;

  @IsPositive()
  @IsNotEmpty()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: `"Amount" field must be a decimal number` },
  )
  amount: number;
}

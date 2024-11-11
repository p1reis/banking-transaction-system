import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { TransactionTypeEnum } from '@prisma/client';

export class CreateTransferDto {
  @IsEnum(TransactionTypeEnum, { message: `Transaction type must be TRANSFER` })
  @IsNotEmpty({ message: `Transaction type must be TRANSFER` })
  type: TransactionTypeEnum;

  @IsString()
  @IsNotEmpty({ message: `"From" field must be an valid account number` })
  origin: string;

  @IsString()
  @IsNotEmpty({ message: 'To field must be an valid account number' })
  destiny: string;

  @IsPositive()
  @IsNotEmpty()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: `"Amount" field must be a decimal number'` },
  )
  amount: number;
}

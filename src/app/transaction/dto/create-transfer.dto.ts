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
  from: string;

  @IsString()
  @IsNotEmpty({ message: 'To field must be an valid account number' })
  to: string;

  @IsPositive()
  @IsNotEmpty()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: `"Value" field must be a decimal number'` },
  )
  value: number;
}

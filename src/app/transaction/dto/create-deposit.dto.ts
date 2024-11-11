import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { TransactionTypeEnum } from '@prisma/client';

export class CreateDepositDto {
  @IsEnum(TransactionTypeEnum, { message: `Transaction type must be DEPOSIT` })
  @IsNotEmpty({ message: `Transaction type must be DEPOSIT` })
  type: TransactionTypeEnum;

  @IsString()
  @IsNotEmpty({ message: `"Destiny" field must be an valid account number` })
  destiny: string;

  @IsPositive()
  @IsNotEmpty()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: `"Value" field must be a decimal number'` },
  )
  value: number;
}

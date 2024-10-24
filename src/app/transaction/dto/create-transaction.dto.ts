import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { TransactionTypeEnum } from '@prisma/client'

export class CreateTransactionDto {
    @IsEnum(TransactionTypeEnum)
    type: TransactionTypeEnum;

    @IsString()
    @IsNotEmpty()
    cuid: string;

    @IsString()
    @IsOptional()
    to?: string;

    @IsPositive()
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 }, { message: `"Value" field must be a decimal number'` })
    value: number;
}
import { IsNotEmpty, IsNumber, IsPositive, IsString, Matches } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty({ message: `"firstName" field must be an valid account number` })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: `"lastName" field must be an valid account number` })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, { message: 'CPF must match a valid CPF format' })
  cpf: string;

  @IsPositive()
  @IsNotEmpty()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: `"Value" field must be a decimal number'` },
  )
  balance: number;
}

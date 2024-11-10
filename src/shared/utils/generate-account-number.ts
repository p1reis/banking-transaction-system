import { Injectable } from '@nestjs/common';
import { Chance } from 'chance';

@Injectable()
export class GenerateAccountNumberUtils {
  private chance = new Chance();

  generateAccountNumber(): string {
    let accountNumber: string;
    let isValid = false;

    while (!isValid) {
      const parte1 = this.chance.integer({ min: 10000, max: 99999 }).toString();
      const parte2 = this.chance.integer({ min: 10, max: 99 }).toString();

      accountNumber = `${parte1}-${parte2}`;

      isValid = this.luhnCheck(accountNumber.replace('-', ''));
    }

    return accountNumber;
  }

  private luhnCheck(number: string): boolean {
    let sum = 0;
    let shouldDouble = false;

    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }
}

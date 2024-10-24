import { Injectable } from '@nestjs/common';
import { Chance } from 'chance';

@Injectable()
export class GenerateAccountNumberUtils {
  private chance = new Chance();

  generateAccountNumber(): string {
    const parte1 = this.chance.integer({ min: 1000, max: 9999 }).toString();
    const parte2 = this.chance.integer({ min: 10, max: 99 }).toString();
    return `${parte1}-${parte2}`;
  }
}

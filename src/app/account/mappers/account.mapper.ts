import { Account } from '@prisma/client';

export class AccountMapper {
  static newAccount(raw?: Account) {
    return {
      message: 'Account created successfully!',
      account: {
        number: raw?.number,
        name: `${raw?.firstName} ${raw?.lastName}`,
        cpf: raw.cpf,
        balance: raw?.balance ? raw?.balance : 0,
        createdAt: raw?.createdAt,
      },
    };
  }
  static accountFound(raw?: Account) {
    return {
      account: {
        number: raw?.number,
        name: `${raw?.firstName} ${raw?.lastName}`,
        balance: raw?.balance ? raw?.balance : 0,
        createdAt: raw?.createdAt,
      },
    };
  }
}

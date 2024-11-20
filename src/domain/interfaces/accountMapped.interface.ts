export interface CreateAccountMapped {
  message: string;
  account: {
    number: string;
    name: string;
    cpf: string;
    balance: number;
  };
}

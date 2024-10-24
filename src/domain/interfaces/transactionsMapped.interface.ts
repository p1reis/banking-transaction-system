export interface DepositMapped {
  cuid: string;
  type: string;
  when: Date;
  from: string;
  accountNumber: string;
  depositValue: number;
  newBalance: number;
}

export interface WithdrawMapped {
  cuid: string;
  type: string;
  when: Date;
  from: string;
  accountNumber: string;
  withdrawValue: number;
  newBalance: number;
}

import { uuidv7 } from 'uuidv7';

export class TransactionDto {
  cpf!: string;
  amount!: number;
  transactionId!: string;

  constructor(partial: Partial<TransactionDto>) {
    Object.assign(this, partial);
    this.transactionId = partial.transactionId ?? uuidv7();
  }
}
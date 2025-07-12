import { Injectable } from '@nestjs/common';

@Injectable()
export class MlRiskScorerService {
  evaluate(transaction: { cpf: string; amount: number }) {
    const score = Math.min(100, transaction.amount / 10);
    console.log('ML Score result:', {
      ...transaction,
      score: Math.round(score),
    });
  }
}
import { Injectable, Logger } from '@nestjs/common';
import { KafkaProducerService } from '../producer/kafka-producer.service';
import { TransactionDto } from '../dto/transaction.dto';
import { DecisionType } from '../enums/decision-type.enum';

export interface AntifraudResult {
  transactionId: string;
  cpf: string;
  amount: number;
  heuristicScore: number;
  decision: DecisionType;
}

@Injectable()
export class AntifraudService {
  constructor(private readonly logger: Logger, private producer: KafkaProducerService) {}

  async evaluate(transaction: TransactionDto){
    const { cpf, amount, transactionId } = transaction;

    const heuristicScore = this.calculateHeuristicScore(amount);
    const decision = this.getDecision(heuristicScore);

    const result: AntifraudResult = {
      transactionId,
      cpf,
      amount,
      heuristicScore,
      decision,
    };
    
    await this.producer.emitHeuristicEvaluated(result);
    this.logger.log(`Heuristic evaluation result for transaction ${transactionId}`, JSON.stringify(result));
  }

  private calculateHeuristicScore(amount: number): number {
    if (amount >= 10000) return 95;
    if (amount >= 5000) return 85;
    if (amount >= 2000) return 75;
    if (amount >= 1000) return 65;
    if (amount >= 500) return 50;
    return 10;
  }

  private getDecision(score: number): DecisionType {
    if (score >= 90) return DecisionType.BLOCK;
    if (score >= 70) return DecisionType.REVIEW;
    return DecisionType.APPROVE;
  }
}

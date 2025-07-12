import { Injectable, OnModuleInit } from '@nestjs/common';
import { MlRiskScorerService } from '../service/ml-risk-scorer.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  constructor(private readonly scorer: MlRiskScorerService) {}

  onModuleInit() {
    // Simulação de consumo do Kafka
    const sample = { cpf: '12345678900', amount: 2000 };
    this.scorer.evaluate(sample);
  }
}
import { Module } from '@nestjs/common';
import { KafkaConsumerService } from './consumer/kafka-consumer.service';
import { MlRiskScorerService } from './service/ml-risk-scorer.service';

@Module({
  providers: [KafkaConsumerService, MlRiskScorerService],
})
export class AppModule {}
import { Module, Logger } from '@nestjs/common';
import { KafkaConsumerService } from './src/consumer/kafka-consumer.service';
import { AntifraudService } from './src/service/antifraud.service';
import { KafkaProvider } from './src/provider/kafka.provider';

@Module({
  providers: [
    Logger, 
    KafkaProvider,
    KafkaConsumerService,
    AntifraudService,
  ],
})
export class AppModule {}

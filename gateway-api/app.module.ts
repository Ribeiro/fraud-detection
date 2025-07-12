import { Module, Logger } from '@nestjs/common';
import { TransactionService } from './src/services/transaction.service';
import { TransactionController } from './src/controllers/transaction.controller';
import { KafkaProvider } from './src/providers/kafka.provider';
import { RedisProvider } from './src/providers/redis.provider';

@Module({
  controllers: [TransactionController],
  providers: [
    Logger,
    KafkaProvider,
    RedisProvider,
    TransactionService,
  ],
})
export class AppModule {}

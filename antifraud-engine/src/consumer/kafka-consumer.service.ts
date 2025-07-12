import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { AntifraudService } from '../service/antifraud.service';
import { KafkaPublisherSubscriber, handleNack } from 'msg-broker-lib';
import { MessageSubscriber } from 'msg-broker-lib/dist/brokers/interfaces/subscriber/MessageSubscriber';
import { TransactionDto } from './../dto/transaction.dto';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  constructor(
    private readonly antifraud: AntifraudService,
    private readonly logger: Logger,
    @Inject(KafkaPublisherSubscriber)
    private readonly kafka: MessageSubscriber,
  ) {}

  async onModuleInit() {
    try {
      await this.kafka.subscribe(
        {
          destination: 'transaction.requested',
          consumerGroup: 'antifraud-engine-group',
        },
        async (msg, control) => {
          try {
            this.logger.log(
              `Raw Kafka message: ${JSON.stringify(msg)}`,
              KafkaConsumerService.name,
            );

            const input = msg as unknown as TransactionDto;

            if (!input?.cpf || !input?.amount || !input?.transactionId) {
              throw new Error('Invalid transaction input received from Kafka');
            }

            await this.antifraud.evaluate(input);
            await control.ack();
          } catch (error) {
            this.logger.error(
              `Error processing transaction`,
              error instanceof Error ? error.stack : String(error),
              KafkaConsumerService.name,
            );
            await handleNack(control, error instanceof Error ? error : undefined);
          }
        },
      );
    } catch (error) {
      this.logger.error(
        `Failed to subscribe to Kafka`,
        error instanceof Error ? error.stack : String(error),
        KafkaConsumerService.name,
      );
    }
  }
}

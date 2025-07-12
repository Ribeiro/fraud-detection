import { Injectable, Logger } from '@nestjs/common';
import { KafkaPublisherSubscriber } from 'msg-broker-lib';
import { AntifraudResult } from 'src/service/antifraud.service';

@Injectable()
export class KafkaProducerService {
  constructor(
    private readonly logger: Logger,
    private readonly kafkaClient: KafkaPublisherSubscriber,
  ) {}

  async emitHeuristicEvaluated(event: AntifraudResult) {
    try {
      await this.kafkaClient.publish(
        {
          destination: 'transaction.heuristicEvaluated',
          key: event?.cpf ?? 'unknown',
          headers: {
            'x-origin': 'antifraud-engine',
          },
        },
        event,
      );

      this.logger.log(
        `Heuristic evaluation published for CPF ${event?.cpf}`,
        KafkaProducerService.name,
      );
    } catch (error) {
      this.logger.error(
        'Failed to publish heuristic evaluation to Kafka',
        error instanceof Error ? error.stack : String(error),
        KafkaProducerService.name,
      );
      throw new Error('Failed to process heuristic evaluation');
    }
  }
}

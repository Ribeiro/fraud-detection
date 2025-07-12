import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Redis } from "ioredis";
import { KafkaPublisherSubscriber, handleNack } from "msg-broker-lib";
import { TransactionDto } from "src/dtos/transaction.dto";
import { EvaluationType } from '../enums/evaluation-type.enum';

@Injectable()
export class TransactionService implements OnModuleInit {
  constructor(
    @Inject(KafkaPublisherSubscriber)
    private readonly kafka: KafkaPublisherSubscriber,

    @Inject(Redis)
    private readonly redis: Redis,

    private readonly logger: Logger
  ) {}

  async onModuleInit() {
    await this.kafka.subscribe(
      {
        destination: "transaction.heuristicEvaluated",
        consumerGroup: "gateway-api-group",
      },
      async (msg, control) =>
        await this.handleEvaluation(EvaluationType.HEURISTIC, msg, control)
    );

    await this.kafka.subscribe(
      {
        destination: "transaction.mlEvaluated",
        consumerGroup: "gateway-api-group",
      },
      async (msg, control) => await this.handleEvaluation(EvaluationType.ML, msg, control)
    );
  }

  async initiateTransaction(payload: TransactionDto) {
    await this.kafka.publish(
      {
        destination: "transaction.requested",
        key: payload.cpf,
        headers: { "x-origin": "gateway-api" },
      },
      payload
    );

    this.logger.log(
      `Published transaction.requested for CPF ${payload.cpf}`,
      TransactionService.name
    );

    return { status: "PENDING", ...payload };
  }

  private async handleEvaluation(
    type: EvaluationType,
    msg: any,
    control: any
  ) {
    try {
      const key = `tx:${msg.transactionId}`;
      const existingRaw = await this.redis.get(key);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};

      const updated = { ...existing, [type]: msg };

      if (updated.heuristic && updated.ml) {
        await this.kafka.publish(
          {
            destination: "transaction.result",
            key: msg.cpf ?? "unknown",
            headers: { "x-origin": "gateway-api" },
          },
          {
            transactionId: msg.transactionId,
            cpf: msg.cpf,
            heuristic: updated.heuristic,
            ml: updated.ml,
          }
        );

        await this.redis.del(key);
        this.logger.log(
          `Published transaction.result for CPF ${msg.cpf}`,
          TransactionService.name
        );
      } else {
        await this.redis.set(key, JSON.stringify(updated), "EX", 300);
        this.logger.log(
          `Partial evaluation saved for ${msg.cpf} (${type})`,
          TransactionService.name
        );
      }

      await control.ack();
    } catch (error) {
      this.logger.error(
        `Error during handleEvaluation (${type})`,
        error instanceof Error ? error.stack : String(error),
        TransactionService.name
      );
      await handleNack(control, error instanceof Error ? error : undefined);
    }
  }
}

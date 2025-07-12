import { Provider } from '@nestjs/common';
import { KafkaPublisherSubscriber } from 'msg-broker-lib';

export const KafkaProvider: Provider = {
  provide: KafkaPublisherSubscriber,
  useFactory: () => {
    const brokers = process.env.KAFKA_BROKERS?.split(',') ?? ['localhost:9092'];
    return new KafkaPublisherSubscriber(brokers);
  },
};

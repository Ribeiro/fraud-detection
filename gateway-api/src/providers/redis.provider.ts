import { Provider } from '@nestjs/common';
import { Redis } from 'ioredis';

export const RedisProvider: Provider = {
  provide: Redis,
  useFactory: () => {
    const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
    return new Redis(redisUrl);
  },
};

import { Module } from '@nestjs/common';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: `${process.env.REDIS_HOST}`,
            port: Number(process.env.REDIS_PORT),
          },
        });

        return {
          store: store as unknown as CacheStore,
          ttl: 3 * 60000,
          max: 50,
        };
      },
    }),
  ],
  exports: [CacheModule], // Certifique-se de exportar o CacheModule
})
export class CustomCacheModule {}

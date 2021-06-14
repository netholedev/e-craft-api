import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    return this.cache.get(key);
  }

  async set(key: string, value: any) {
    return this.cache.set(key, value);
  }

  async delete(key: string) {
    return this.cache.del(key);
  }
}

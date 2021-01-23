import Redis from 'ioredis';

// retry strategy for Azure (https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-best-practices)
// reconnect on error (https://www.npmjs.com/package/ioredis#reconnect-on-error)
const redisOpts: Redis.RedisOptions = {
    retryStrategy: (times: number) => Math.min(times * 10000, 15000),
    reconnectOnError: (err: Error) => err.message.includes('READONLY'),
    connectTimeout: 15000,
};

const getRedis = () => new Redis(<string>process.env.ONERAIL_CLOUD_REDIS_CONNECTION_STRING, redisOpts);

let redisInstance: Redis.Redis;

/**
 * Gets a connection to redis server
 * @param newInstance set to true to create a new redis connection
 * @returns reusable redis instance or a new one
 */
export function redis(newInstance: boolean = false): Redis.Redis {
    if (newInstance) {
        return getRedis();
    }

    if (!redisInstance) {
        redisInstance = getRedis();
    }
    return redisInstance;
}

export function __setMockServer(redisMock: any) {
    redisInstance = redisMock;
}

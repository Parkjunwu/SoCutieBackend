// import { PubSub } from 'graphql-subscriptions';

// const pubsub = new PubSub();


// import { RedisPubSub } from 'graphql-redis-subscriptions';
// const pubsub = new RedisPubSub();

// export default pubsub;

// redis 서버의 pubsub
// 시작하기 전에 redis 서버 먼저 실행 됬는지 확인.
// redis-server
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

const options = {
  // host: "127.0.0.1",
  // port: 6379,
  host: process.env.REDIS_DOMAIN_NAME,
  port: Number(process.env.PORT_NUMBER),
  retryStrategy: times => {
    // reconnect after
    return Math.min(times * 50, 2000);
  }
};

const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options)
});

export default pubsub;

// 실제 들어갈 애는 같기만 하면 되니까 최대한 작은 데이터를 넣음. number 는 안되네.
// 유저간 메세지
export const NEW_MESSAGE = "1"

// Notification 알림
export const NEW_NOTIFICATION = "2"

// 그냥 메세지 받았다는 것만
export const GET_MESSAGE = "3"
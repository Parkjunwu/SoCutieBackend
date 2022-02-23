import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export default pubsub;


// 실제 들어갈 애는 같기만 하면 되니까 최대한 작은 데이터를 넣음. number 는 안되네.
// 유저간 메세지
export const NEW_MESSAGE = "1"

// Notification 알림
export const NEW_NOTIFICATION = "2"
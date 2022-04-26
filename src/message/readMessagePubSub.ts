import pubsub, { READ_MESSAGE } from "../pubsub";

const pubSubReadMessageNeedRoomIdAndUserId = async(roomId:number,userId:number) => {
  try {
    await pubsub.publish(READ_MESSAGE,{
      readUpdate:{
        roomId,
        userId,
      },
    });
  } catch (e) {
    console.log("readMessage pubsub 에러")
    console.log("readMessage error message is : "+e);
  }
};

export default pubSubReadMessageNeedRoomIdAndUserId;
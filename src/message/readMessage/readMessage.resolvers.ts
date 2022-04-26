import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";
import pubSubReadMessageNeedRoomIdAndUserId from "../readMessagePubSub";

const readMessageFn: Resolver = async(_,{id},{client,loggedInUser}) =>{ 
  const message = await client.message.findFirst({
    where:{
      id,
      room:{
        UserOnRoom:{
          some:{
            userId:loggedInUser.id
          }
        }
      },
      userId:{
        not:loggedInUser.id
      },
    },
    select:{
      roomId:true
    },
  });

  if(!message) return {ok:false, error:"Message not found"};

  await client.message.update({
    where:{
      id
    },
    data:{
      read:true
    },
    select:{
      id:true
    },
  });

  const roomId = message.roomId;
  const userId = loggedInUser.id;
  await pubSubReadMessageNeedRoomIdAndUserId(roomId,userId);

  return {ok:true};
}

const resolver:Resolvers = {
  Mutation: {
    readMessage:protectResolver(readMessageFn)
  }
}
export default resolver;
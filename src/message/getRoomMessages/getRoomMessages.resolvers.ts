import { Resolver, Resolvers } from "../../types"
import { protectResolver } from "../../user/user.utils";

// 처음에는 seeRoom 으로 받음. 근데 그럴 필요가 있나? 캐시 id 받을라면 그래 해야하나?
const getRoomMessagesFn: Resolver = async(_,{roomId,cursorId},{client,loggedInUser}) => {
  // 유저와 연결된 room 이 있는지.
  const userOnRoom = await client.userOnRoom.findUnique({
    where:{
      userId_roomId:{
        userId:loggedInUser.id,
        roomId
      }
    },
  });
  if(!userOnRoom) {
    return null;
  };
  return await client.message.findMany({
    where:{
      roomId,
    },
    orderBy:{
      createdAt:"desc",
    },
    include:{
      user:{
        select:{
          id:true,
          userName:true,
          avatar:true,
        }
      }
    },
    take:20,
    ...(cursorId && {cursor: cursorId, skip:1})
  })
}

const resolver:Resolvers = {
  Query:{
    getRoomMessages:protectResolver(getRoomMessagesFn)
  }
};

export default resolver;
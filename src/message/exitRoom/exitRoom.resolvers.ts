import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const exitRoomFn: Resolver = async(_,{roomId},{client,loggedInUser}) => {
  // 얘가 더 낫긴 한데 방도 없앨라면 아래가 나을듯
  // const room = await client.userOnRoom.findUnique({
  //   where:{
  //     userId_roomId:{
  //       userId:loggedInUser.id,
  //       roomId
  //     }
  //   },
  //   select:{
  //     userId:true
  //   }
  // });
  const room = await client.room.findFirst({
    where:{
      id:roomId,
      UserOnRoom:{
        some:{
          userId:loggedInUser.id
        }
      }
    },
    select:{
      UserOnRoom:{
        select:{
          userId:true
        }
      }
    }
  })
  if(!room) return {ok:false, error:"room not found"}
  
  // 유저가 나밖에 없어 그러면 room 자체를 삭제.
  if(room.UserOnRoom.length === 1){
    await client.room.delete({
      where:{
        id:roomId
      },
      select:{
        id:true
      }
    })
  } else {
    // userOnRoom 제거 하면 알아서 적용 됨. user 에 userOnRoom 목록과 room 에 userOnRoom 목록.
    await client.userOnRoom.delete({
      where:{
        userId_roomId:{
          userId:loggedInUser.id,
          roomId
        }
      },
      select:{
        userId:true,
      }
    });
  };
  
  return {ok:true}
};

const resolver:Resolvers = {
  Mutation: {
    exitRoom:protectResolver(exitRoomFn)
  }
}
export default resolver;

import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";


const isAlreadyRoomFn: Resolver = async(_,{userId},{client,loggedInUser}) => {
  // 자기 자신만의 방을 만듦. 얘도 이상한거
  if(userId === loggedInUser.id) {
    console.log("isAlreadyRoom // 자기 자신의 방을 만드는 이상한 쿼리를 날림. 해킹 가능성 있음.")
    return { state: "WRONG_ACCESS" };
  }
  
  const user = await client.user.findUnique({
    where:{
      id:userId
    },
    select:{
      id:true,
    }
  });

  if(!user) return { state: "NO_USER" };

  const alreadyRoomHave = await client.room.findFirst({
    where:{
      AND:[
        {
          UserOnRoom:{
            some:{
              userId:loggedInUser.id
            }
          }
        },
        {
          UserOnRoom:{
            some:{
              userId
            }
          }
        }
      ]
    },
    select:{
      id:true,
    },
  });

  return alreadyRoomHave ? { state: "HAVE", room:alreadyRoomHave } : { state: "NOT_HAVE" };
};

const resolver: Resolvers = {
  Query: {
    isAlreadyRoom:protectResolver(isAlreadyRoomFn)
  }
};

export default resolver;
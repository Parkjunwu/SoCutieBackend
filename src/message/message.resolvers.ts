import { Resolver, Resolvers } from "../types";


const talkingToFn:Resolver = async({id},_,{client,loggedInUser}) => client.user.findFirst({
  where:{
    UserOnRoom:{
      some:{
        roomId:id
      },
    },
    id:{
      not:loggedInUser.id
    }
  },
  select:{
    id:true,
    userName:true,
    avatar:true
  }
})


const lastMessageFn:Resolver = async({id},_,{client,loggedInUser}) => {
  // 어차피 Room 을 받는 resolver 가 전부 protectResolver 라서 체크할 필요는 없을 거 같긴 한데 그래도.
  const userOnRoom = await client.userOnRoom.findUnique({
    where:{
      userId_roomId:{
        userId:loggedInUser.id,
        roomId:id
      }
    },
  });
  if(!userOnRoom) {
    return null;
  };
  return await client.message.findFirst({
    where:{
      roomId:id,
    },
    orderBy:{
      createdAt:"desc",
    },
    // unreadTotal 이 있으면 상대방 거니까 user 를 안 받아도 될 거 같긴한데 일단 받음.
    // include:{
    //   user:{
    //     select:{
    //       id:true,
    //       userName:true,
    //       avatar:true
    //     }
    //   },
    // },
  })
}

const unreadTotalFn:Resolver = async({id},_,{client,loggedInUser}) => {
  if(!loggedInUser) return 0
  return client.message.count({
    where:{
      roomId:id,
      user:{
        id:{
          not:loggedInUser.id
        }
      },
      read:false
    }
  })
}


const resolver:Resolvers = {
  // 얘 때문에 못받는 거였음.
  // Message: {
  //   user:userFn
  // },
  Room: {
    talkingTo:talkingToFn,
    lastMessage:lastMessageFn,
    unreadTotal:unreadTotalFn,
  },
}

export default resolver
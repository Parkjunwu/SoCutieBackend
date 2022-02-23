import { Resolver, Resolvers } from "../types";

const userFn:Resolver = async({id},_,{client}) => {
  const result = await client.message.findUnique({where:{id}}).user()
  // client.message.findUnique({where:{id},select:{user:true}})
  // console.log(result)
  return result
}
const usersFn:Resolver = async({id},_,{client}) => client.user.findMany({
  where:{
    UserOnRoom:{
      some:{
        roomId:id
      }
    }
  }
})

// const messagesFn:Resolver = async({id},_,{client}) => client.message.findMany({where:{roomId:id}, take:20});
const messagesFn:Resolver = async({id},_,{client,loggedInUser}) => {
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
  return await client.message.findMany({
    where:{
      roomId:id,
    },
    take:20,
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
  Message: {
    user:userFn
  },
  Room: {
    users:usersFn,
    messages:messagesFn,
    unreadTotal:unreadTotalFn,
  },
}

export default resolver
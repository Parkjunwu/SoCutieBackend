
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../user.utils";

// 아직 차단했다고 뭐를 막는건 구현 안했음. 글고 지금은 id 만 넣고 relation 으로 구현 안함.
const blockUserFn: Resolver = async(_,{id},{client,loggedInUser}) => {
  // 유저 존재 하는지
  const isUser = await client.user.findUnique({
    where:{
      id
    },
    select:{
      blockUsers:true,
    }
  })
  // 해당 id 유저가 없을 때.
  if(!isUser) {
    return {ok:false, error:"해당 유저가 존재하지 않습니다."}
  }
  // 이미 있으면 그냥 ok 반환.
  if(isUser.blockUsers.includes(id)) {
    return {ok:true};
  }
  // 차단 목록에 넣음.
  await client.user.update({
    where:{
      id:loggedInUser.id
    },
    data:{
      blockUsers:{
        push:id
      }
    },
    select:{
      id:true,
    }
  });
  return {ok:true};
}
const resolver:Resolvers = {
  Mutation: {
    blockUser:protectResolver(blockUserFn)
  }
}

export default resolver;
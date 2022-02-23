
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../user.utils";

// 아직 차단했다고 뭐를 막는건 구현 안했음. 글고 지금은 id 만 넣고 relation 으로 구현 안함.
const unblockUserFn: Resolver = async(_,{id},{client,loggedInUser}) => {
  // 유저 존재 하는지
  const isUser = await client.user.findUnique({
    where:{
      id
    },
    select:{
      blockUsers:true,
    }
  })
  // 해당 유저가 없을 때.
  if(!isUser) {
    return {ok:false, error:"해당 유저가 존재하지 않습니다."}
  }
  // 차단 목록에 없으면 할 필요가 없으니 ok 반환
  const idIndex = isUser.blockUsers.indexOf(id)
  if(idIndex === -1) {
    return {ok:true}
  }

  // 새로운 id 목록 Array
  const newIdArr = isUser.blockUsers
  newIdArr.splice(idIndex,1);
  
  // 차단 목록에 넣음
  await client.user.update({
    where:{
      id:loggedInUser.id
    },
    data:{
      blockUsers:{
        set:newIdArr
      }
    },
    // 최소한만 받아
    select:{
      id:true,
    },
  });
  return {ok:true};
}
const resolver:Resolvers = {
  Mutation: {
    unblockUser:protectResolver(unblockUserFn)
  }
}

export default resolver;
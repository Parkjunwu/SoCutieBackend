import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";

const logicSeePostLikes: Resolver = async(_,{id,cursorId},{client}) => {
  const take = 20;
  const likeUsers = await client.user.findMany({
    where:{
      postLikes:{
        some:{
          postId:id
        }
      }
    },
    take,
    ...(cursorId && { cursor: { id: cursorId }, skip: 1 }),
    select:{
      id:true,
      userName:true,
      avatar:true,
    },
  });

  const likeUsersCount = likeUsers.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = likeUsersCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = likeUsers[likeUsersCount-1].id;
    return {
      cursorId,
      hasNextPage:true,
      likeUsers,
    };
  } else {
    return {
      hasNextPage:false,
      likeUsers,
    };
  }
};


const seePostLikesFn:Resolver = async(_,{id,cursorId},{client}) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSeePostLikes(_,{id,cursorId},{client},null),
    "seePostLikes"
  );
}
const resolver:Resolvers = {
  Query:{
    seePostLikes:seePostLikesFn
  }
}
export default resolver
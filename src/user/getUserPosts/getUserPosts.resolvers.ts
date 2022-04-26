import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";

const logicGetUserPosts: Resolver = async(_,{userId,cursorId},{client}) => {
  console.log("getUserPosts")
  const take = 50;
  
  const posts = await client.post.findMany({
    where:{
      userId
    },
    orderBy:{
      createdAt:"desc"
    },
    take,
    ...(cursorId && { skip:1 , cursor: { id: cursorId } })
  });
  
  const postsCount = posts.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = postsCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = posts[postsCount-1].id;
    return {
      cursorId,
      hasNextPage:true,
      posts,
    };
  } else {
    return {
      hasNextPage:false,
      posts,
    };
  }
};

const resolver:Resolvers = {
  Query :{
    getUserPosts:async(_, {userId,cursorId}, {client}) => {
      return paginationErrorCheckNeedLogicAndQueryName(
        await logicGetUserPosts(_,{userId,cursorId},{client},null),
        "getUserPosts"
      );
    }
  }
};

export default resolver;
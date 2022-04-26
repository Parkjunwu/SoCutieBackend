import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../user.utils";

const logicGetMePosts: Resolver = async(_,{cursorId},{client,loggedInUser}) => {
  const take = 20;
  
  const posts = await client.post.findMany({
    where:{
      userId:loggedInUser.id
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

const getMePostsFn = async(_, {cursorId}, {client,loggedInUser}) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicGetMePosts(_,{cursorId},{client,loggedInUser},null),
    "getMePosts"
  );
}

const resolver:Resolvers = {
  Query :{
    getMePosts:protectResolver(getMePostsFn)
  }
};

export default resolver;
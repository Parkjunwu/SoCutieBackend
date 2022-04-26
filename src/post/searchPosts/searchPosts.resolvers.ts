import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";

const logicSearchPosts: Resolver = async(_,{keyword,cursorId},{client}) => {
  const take = 10;
  const posts = await client.post.findMany({
    where:{
      caption:{
        contains:keyword
      }
    },
    orderBy:{
      createdAt:"desc"
    },
    take,
    ...(cursorId && {cursor:{id:cursorId}, skip:1})
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

const searchPostsFn: Resolver = async(_,{keyword,cursorId},{client}) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSearchPosts(_,{keyword,cursorId},{client},null),
    "searchPosts"
  );
};

const resolver: Resolvers = {
  Query:{
    searchPosts:searchPostsFn
  }
};

export default resolver
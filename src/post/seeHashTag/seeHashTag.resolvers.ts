import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";

const logicSeeHashTag: Resolver = async(_,{name,cursorId},{client}) => {
  const take = 20;
  const posts = await client.post.findMany({
    where:{
      PostOnHashTag:{
        some:{
          hashtag:{
            name,
          },
        },
      },
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

const seeHashTagFn: Resolver = async(_,{name,cursorId},{client}) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSeeHashTag(_,{name,cursorId},{client},null),
    "seeHashTag"
  );
  
  // const take = 20;

  // // cursorId 는 프론트에서 써야 할듯.
  // // const result = await client.hashTag.findUnique({
  // //   where:{
  // //     name
  // //   },
  // // });

  // // 얜 totalPosts 를 못받음. post 를 받는거라. 여기서 나온 id 로 받든가 해야겠군
  // const result = await client.post.findMany({
  //   where:{
  //     PostOnHashTag:{
  //       some:{
  //         hashtag:{
  //           name,
  //         },
  //       },
  //     },
  //   },
  //   take,
  //   ...(cursorId && {cursor:cursorId, skip:1})
  // });
  // console.log(result);
  // return result;
};

const resolver: Resolvers = {
  Query:{
    seeHashTag:seeHashTagFn
  }
}
export default resolver
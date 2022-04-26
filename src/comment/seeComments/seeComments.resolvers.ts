import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";

const logicSeeComments: Resolver = async(_,{postId,cursorId},{client}) => {
  const take = 20;
  const comments = await client.comment.findMany({
    where:{
      postId
    },
    orderBy:{
      createdAt:"desc"
    },
    take,
    ...(cursorId && { cursor: { id: cursorId }, skip: 1 }),
    include:{
      user:{
        select:{
          id:true,
          userName:true,
          avatar:true,
        }
      }
    }
  });

  const commentsCount = comments.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = commentsCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = comments[commentsCount-1].id;
    return {
      cursorId,
      hasNextPage:true,
      comments,
    };
  } else {
    return {
      hasNextPage:false,
      comments,
    };
  }
};

const seeCommentsFn: Resolver = async(_,{postId,cursorId},{client}) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSeeComments(_,{postId,cursorId},{client},null),
    "seeComments"
  );

  // const take = 20;
  // const comments = await client.comment.findMany({
  //   where:{
  //     postId
  //   },
  //   take,
  //   ...(cursorId && { cursor: cursorId, skip: 1 }),
  //   include:{
  //     user:{
  //       select:{
  //         id:true,
  //         userName:true,
  //         avatar:true,
  //       }
  //     }
  //   }
  // });

  // const commentsCount = comments.length;

  // // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  // const isHaveHaveNextPage = commentsCount === take;

  // if( isHaveHaveNextPage ){
  //   const cursorId = comments[commentsCount-1].id;
  //   return {
  //     cursorId,
  //     hasNextPage:true,
  //     comments,
  //   };
  // } else {
  //   return {
  //     hasNextPage:false,
  //     comments,
  //   };
  // }
};

const resolver: Resolvers = {
  SeeCommentsResponse:{
    // 프론트엔드에서 subscription mutation 데이터 받기 위함... 데이터 형식을 프론트엔드에서 못바꿔서..
    isNotFetchMore:() => false,
  },
  Query:{
    seeComments:seeCommentsFn,
  }
};

export default resolver;
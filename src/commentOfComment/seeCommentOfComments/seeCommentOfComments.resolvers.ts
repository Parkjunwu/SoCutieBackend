import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";

const logicSeeCommentOfComments: Resolver = async(_,{commentId,cursorId},{client}) => {
  const take = 5;
  const commentOfComments = await client.commentOfComment.findMany({
    where:{
      commentId
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

  const commentOfCommentsCount = commentOfComments.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = commentOfCommentsCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = commentOfComments[commentOfCommentsCount-1].id;
    return {
      cursorId,
      hasNextPage:true,
      commentOfComments,
    };
  } else {
    return {
      hasNextPage:false,
      commentOfComments,
    };
  }
}

const seeCommentOfCommentsFn: Resolver = async(_,{commentId,cursorId},{client}) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSeeCommentOfComments(_,{commentId,cursorId},{client},null),
    "seeCommentOfComments"
  );
  // client.commentOfComment.findMany({
  //   where:{
  //     commentId
  //   },
  //   take:20,
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
}
const resolver: Resolvers = {
  GetRoomMessagesResponse:{
    // 프론트엔드에서 subscription mutation 데이터 받기 위함... 데이터 형식을 프론트엔드에서 못바꿔서..
    isNotFetchMore:() => false,
  },
  Query:{
    seeCommentOfComments:seeCommentOfCommentsFn,
  }
};

export default resolver;
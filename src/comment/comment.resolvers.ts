import { Resolver, Resolvers } from "../types"

// userId 가 typeDefs 에 없는데 받아지네?!
const isMineFn:Resolver = ({userId},_,{loggedInUser}) => userId===loggedInUser?.id

const totalLikesFn:Resolver = ({id},_,{client}) => client.commentLike.count({
  where:{
    commentId:id
  }
});

const totalCommentOfCommentsFn:Resolver = ({id},_,{client}) => client.commentOfComment.count({
  where:{
    commentId:id
  },
});

const isLikedFn:Resolver = async({id},_,{client,loggedInUser}) => {
  if(!loggedInUser) return null;
  const result = await client.commentLike.findFirst({
    where:{
      commentId:id,
      userId:loggedInUser.id
    },
    select:{
      id:true,
    },
  });
  return Boolean(result);
}

const resolver:Resolvers = {
  Comment:{
    isMine:isMineFn,
    totalLikes:totalLikesFn,
    totalCommentOfComments:totalCommentOfCommentsFn,
    isLiked:isLikedFn
  }
}

export default resolver;
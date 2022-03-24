import { Resolver, Resolvers } from "../../types";

const seeCommentOfCommentLikesFn: Resolver = (_,{commentOfCommentId,cursorId},{client}) => client.user.findMany({
  where:{
    commentOfCommentLikes:{
      some:{
        commentOfCommentId
      }
    }
  },
  take:20,
  ...(cursorId && { cursor: cursorId, skip: 1 }),
  select:{
    id:true,
    userName:true,
    avatar:true,
  },
});

const resolver: Resolvers = {
  Query:{
    seeCommentOfCommentLikes:seeCommentOfCommentLikesFn,
  }
};

export default resolver;
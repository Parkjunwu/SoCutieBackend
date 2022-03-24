import { Resolver, Resolvers } from "../../types";

const seeCommentOfCommentsFn: Resolver = (_,{commentId,cursorId},{client}) => client.commentOfComment.findMany({
  where:{
    commentId
  },
  take:20,
  ...(cursorId && { cursor: cursorId, skip: 1 }),
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

const resolver: Resolvers = {
  Query:{
    seeCommentOfComments:seeCommentOfCommentsFn,
  }
};

export default resolver;
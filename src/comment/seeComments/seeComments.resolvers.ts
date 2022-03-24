import { Resolver, Resolvers } from "../../types";

const seeCommentsFn: Resolver = async(_,{postId,cursorId},{client}) => {
  const take = 20;
  return client.comment.findMany({
    where:{
      postId
    },
    take,
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
}
const resolver: Resolvers = {
  Query:{
    seeComments:seeCommentsFn,
  }
};

export default resolver;
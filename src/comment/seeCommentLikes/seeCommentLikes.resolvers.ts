import { Resolver, Resolvers } from "../../types";

const seeCommentLikesFn: Resolver = async(_,{commentId,cursorId},{client}) => {
  const take = 20;
  return client.user.findMany({
    where:{
      commentLikes:{
        some:{
          commentId
        }
      }
    },
    take,
    ...(cursorId && { cursor: cursorId, skip: 1 }),
    select:{
      id:true,
      userName:true,
      avatar:true,
    },
  });
}
const resolver: Resolvers = {
  Query:{
    seeCommentLikes:seeCommentLikesFn,
  }
};

export default resolver;
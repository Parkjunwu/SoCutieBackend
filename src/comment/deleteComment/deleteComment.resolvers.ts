import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const deleteCommentFn:Resolver = async(_,{id},{loggedInUser,client}) => {
  const comment = await client.comment.findUnique({
    where:{
      id
    },
    select:{
      userId:true
    }
  });
  if(!comment) {
    return { ok:false, error:"comment not found"}
  } else if (comment.userId !== loggedInUser.id) {
    return { ok:false, error:"Not authorized"}
  }
  await client.comment.delete({
    where:{
      id
    },
    select:{
      id:true,
    },
  });
  return {ok:true}
}

const resolver:Resolvers = {
  Mutation: {
    deleteComment:protectResolver(deleteCommentFn)
  }
}
export default resolver
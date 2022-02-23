import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const deleteCommentOfCommentFn:Resolver = async(_,{id},{loggedInUser,client}) => {
  const commentOfComment = await client.commentOfComment.findUnique({
    where:{
      id
    },
    select:{
      userId:true
    }
  });
  if(!commentOfComment) {
    return { ok:false, error:"commentOfComment not found" }
  } else if (commentOfComment.userId !== loggedInUser.id) {
    return { ok:false, error:"Not authorized" }
  }
  await client.commentOfComment.delete({
    where:{
      id
    },
    select:{
      id:true
    },
  });
  return {ok:true}
}

const resolver:Resolvers = {
  Mutation: {
    deleteCommentOfComment:protectResolver(deleteCommentOfCommentFn)
  }
}
export default resolver
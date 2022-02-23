import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const editCommentOfCommentFn: Resolver = async(_,{id,payload},{client,loggedInUser}) => {
  const commentOfComment = await client.commentOfComment.findUnique({
    where:{
      id
    },
    select:{
      userId:true
    }
  })
  if (!commentOfComment) {
    return { ok:false, error:"commentOfComment not found" }
  } else if (commentOfComment.userId !== loggedInUser.id) {
    return { ok:false, error:"Not authorized" }
  }
  await client.commentOfComment.update({
    where:{
      id
    },
    data:{
      payload,
    },
    select:{
      id:true
    }
  })
  return {ok:true}
}

const resolver:Resolvers = {
  Mutation :{
    editCommentOfComment:protectResolver(editCommentOfCommentFn)
  }
}
export default resolver
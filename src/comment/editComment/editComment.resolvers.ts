import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const editCommentFn: Resolver = async(_,{id,payload},{client,loggedInUser}) => {
  const comment = await client.comment.findUnique({
    where:{
      id
    },
    select:{
      userId:true
    }
  });
  if (!comment) {
    return {ok:false, error:"comment not found"}
  } else if (comment.userId !== loggedInUser.id) {
    return {ok:false, error:"Not authorized"}
  }
  await client.comment.update({
    where:{
      id
    },
    data:{
      payload,
    },
    select:{
      id:true,
    },
  });
  return {ok:true}
}

const resolver:Resolvers = {
  Mutation :{
    editComment:protectResolver(editCommentFn)
  }
}
export default resolver
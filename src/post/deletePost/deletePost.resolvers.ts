import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const deletePostFn:Resolver = async(_,{id},{loggedInUser,client}) => {
  const post = await client.post.findUnique({where:{id},select:{userId:true}})
  if(!post) {
    return { ok:false, error:"post not found"}
  } else if (post.userId !== loggedInUser.id) {
    return { ok:false, error:"Not authorized"}
  }
  await client.post.delete({where:{id}})
  return {ok:true}
}

const resolver:Resolvers = {
  Mutation: {
    deletePost:protectResolver(deletePostFn)
  }
}
export default resolver
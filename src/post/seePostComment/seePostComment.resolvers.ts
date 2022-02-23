import { Resolver, Resolvers } from "../../types"

const seePostCommentFn:Resolver = (_,{id},{client}) => 
  client.comment.findMany({
    where:{
      postId: id,
    },
    orderBy:{
      createdAt: "asc",
    }
  })

// client.post.findUnique({where:{id},select:{comments:true}}).comments()

const resolver:Resolvers = {
  Query:{
    seePostComment:seePostCommentFn
  }
}
export default resolver;
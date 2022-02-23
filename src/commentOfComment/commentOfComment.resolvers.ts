import { Resolver, Resolvers } from "../types"

const isMineFn:Resolver = ({userId},_,{loggedInUser}) => userId === loggedInUser?.id

const totalLikesFn:Resolver = ({id},_,{client}) => client.commentOfCommentLike.count({
  where:{
    commentOfCommentId:id
  }
})

const resolver:Resolvers = {
  CommentOfComment:{
    isMine:isMineFn,
    totalLikes:totalLikesFn
  }
}

export default resolver;
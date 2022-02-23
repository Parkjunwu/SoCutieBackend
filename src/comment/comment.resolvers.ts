import { Resolver, Resolvers } from "../types"

// userId 가 typeDefs 에 없는데 받아지네?!
const isMineFn:Resolver = ({userId},_,{loggedInUser}) => userId===loggedInUser?.id

const totalLikesFn:Resolver = ({id},_,{client}) => client.commentLike.count({
  where:{
    commentId:id
  }
})

const resolver:Resolvers = {
  Comment:{
    isMine:isMineFn,
    totalLikes:totalLikesFn
  }
}

export default resolver;
import { Resolver, Resolvers } from "../types"

// 얜 그냥 받는데에서 include 해서 쓰는게 더 낫지 않을까?
const userFn:Resolver = ({userId},_,{client}) => client.user.findUnique({where:{id:userId}})

const likesFn:Resolver = ({id},_,{client}) => client.postLike.count({where:{postId:id}})

const isMineFn:Resolver = ({userId},_,{loggedInUser}) => userId === loggedInUser?.id

const commentNumberFn:Resolver = ({id},_,{client}) => client.comment.count({where:{
  postId:id
}})

const isLikedFn: Resolver = async({id},_,{loggedInUser,client}) => {
  if(!loggedInUser) return false;
  const ok = await client.postLike.findUnique({
    where:{
      postId_userId:{
        postId:id,
        userId:loggedInUser.id,
      }
    },
    select:{
      id:true,
    }
  });
  return Boolean(ok);
};

// 혹시 comment 도 받을거면 user include 까지 같이


const resolver: Resolvers = {
  Post:{
    user:userFn,
    likes:likesFn,
    isMine:isMineFn,
    commentNumber:commentNumberFn,
    isLiked:isLikedFn,
  },
} 

export default resolver
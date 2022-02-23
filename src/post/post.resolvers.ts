import { Resolver, Resolvers } from "../types"

// 관계라서 받는건가??
const userFn:Resolver = ({userId},_,{client}) => client.user.findUnique({where:{id:userId}})

// 근데 이걸 할 필요가 있나? 그냥 이름 누르면 그 이름으로 검색하면 되는데
const hashTagsFn:Resolver = ({id},_,{client}) => client.hashTag.findMany({
  where:{
    PostOnHashTag:{
      some:{
        postId:id
      }
    }
  },
  // pagination 구현해야함
})


const likesFn:Resolver = ({id},_,{client}) => client.postLike.count({where:{postId:id}})

const isMineFn:Resolver = ({userId},_,{loggedInUser}) => userId === loggedInUser?.id

const commentsFn:Resolver = ({id},_,{client}) => client.comment.findMany({
  where:{
    postId:id,
  },
  include:{
    // user:true,
    // user 다른 정보 받으려면 밑에 더 추가
    user:{
      select:{
        id:true,
        userName:true,
        avatar:true
      }
    },
  },
})

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
  })
  return Boolean(ok);
}

// 얘는 수만 세면 되니까 postOnHashTag 를 count 함.
const totalPostsFn:Resolver = ({id},_,{client}) => client.postOnHashTag.count({
  where:{
    hashtagId:id
  }
})
// client.post.count({
//   where:{
//     PostOnHashTag:{
//       some:{
//         hashtagId:id
//       }
//     }
//   }
// })


// 얘는 post 를 가져와야 하니까 post.findMany 로 가져옴. postOnHashTag.findMany 하면 postOnHashTag 가 반환되니까.
// const postsFn:Resolver = async ({id},{page=1,cursorId},{client}) => {
//   const take = 10
//   // const a = await client.hashTag.findUnique({where:{id}}).posts({
//   //   take,
//   //   skip:take*(page-1),
//   //   ...(cursorId && {cursor:{id:cursorId}})
//   // })
//   const posts = await client.post.findMany({
//     where:{
//       PostOnHashTag:{
//         some:{
//           hashtagId:id
//         }
//       }
//     },
//     take,
//     skip:take*(page-1),
//     ...(cursorId && {cursor:{id:cursorId}})
//   })
//   // console.log(a)
//   return {posts, cursorId: posts[posts.length -1].id,page: page +1}
// }

const resolver: Resolvers = {
  Post:{
    user:userFn,
    hashTags:hashTagsFn,
    likes:likesFn,
    isMine:isMineFn,
    comments:commentsFn,
    commentNumber:commentNumberFn,
    isLiked:isLikedFn,
  },
  HashTag:{
    totalPosts:totalPostsFn,
    // posts:postsFn,
  }
} 

export default resolver
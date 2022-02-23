import { Resolver, Resolvers } from "../../types";

const seePostLikesFn:Resolver = async(_,{id,cursorId},{client}) => {
  // 그리고 resolver 도 바꿔야 겠네.

  // const a = await client.user.findMany({where:{likes:{some:{postId:id}}}})
  const a = await client.user.findMany({
    where:{
      postLikes:{
        some:{
          postId:id
        }
      }
    },
    take:15,
    ...(cursorId && { cursor: cursorId, skip:1 })
  });
  // const b = await client.postLike.findMany({where:{postId:id},select:{user:true}})
  // const c = await client.post.findUnique({where:{id}}).likes({select:{user:true}})
  // const d = (await client.post.findUnique({where:{id},select:{likes:{select:{user:true}}}})).likes
  // console.log(a)
  // console.log(b)
  // console.log(c)
  // const obj = b.map(obj=>obj.user)
  // console.log(obj)

  return a;
  // return b.map(obj=>obj.user)
}
const resolver:Resolvers = {
  Query:{
    seePostLikes:seePostLikesFn
  }
}
export default resolver
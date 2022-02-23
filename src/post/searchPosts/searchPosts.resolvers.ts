import { Resolver, Resolvers } from "../../types";

const searchPostsFn: Resolver = (_,{keyword,page=1},{client}) => client.post.findMany({
  where:{
    caption:{
      contains:keyword
    }
  },
  take:10,
  skip:10*(page-1)
})
// .posts({
//   take:10,
//   skip:10*(page-1)
// })

const resolver: Resolvers = {
  Query:{
    searchPosts:searchPostsFn
  }
}
export default resolver
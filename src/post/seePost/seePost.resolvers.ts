import { Resolver, Resolvers } from "../../types";

const seePostFn:Resolver = (_,{id},{client,}) => client.post.findUnique({where:{id}})


const resolver:Resolvers = {
  Query: {
    seePost:seePostFn
  }
}

export default resolver
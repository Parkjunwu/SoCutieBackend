import { Resolver, Resolvers } from "../../types";

const seePostFn:Resolver = async(_,{id},{client,}) => {
  const result =await client.post.findUnique({where:{id}});
  console.log(result);
  return result;
}

const resolver:Resolvers = {
  Query: {
    seePost:seePostFn
  }
}

export default resolver
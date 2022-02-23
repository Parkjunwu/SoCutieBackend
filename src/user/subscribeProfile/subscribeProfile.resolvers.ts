import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../user.utils";


const subscribeProfileFn:Resolver = (_,{id},{client}) => client.user.findUnique({
  where:{
    id
  },
  select:{
    id:true,
    userName:true,
    avatar:true
  }
})

const resolver:Resolvers = {
  Query:{
    subscribeProfile:protectResolver(subscribeProfileFn)
  }
}

export default resolver;
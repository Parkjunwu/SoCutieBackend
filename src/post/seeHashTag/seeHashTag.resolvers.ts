import { Resolver, Resolvers } from "../../types";

const seeHashTagFn: Resolver = (_,{name},{client}) => client.hashTag.findUnique({where:{name}})

const resolver: Resolvers = {
  Query:{
    seeHashTag:seeHashTagFn
  }
}
export default resolver
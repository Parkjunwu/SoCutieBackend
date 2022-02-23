import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../user.utils";

const deleteAccountFn: Resolver = async(_,__,{client,loggedInUser}) => {
  await client.user.delete({
    where:{
      id:loggedInUser.id
    },
    select:{
      id:true,
    }
  });
  return {ok:true};
}
const resolver:Resolvers = {
  Mutation: {
    deleteAccount:protectResolver(deleteAccountFn)
  }
}

export default resolver;
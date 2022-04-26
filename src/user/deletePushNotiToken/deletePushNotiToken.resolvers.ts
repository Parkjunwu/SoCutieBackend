import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../user.utils";

const deletePushNotiTokenFn: Resolver = async (
  _,
  __,
  { loggedInUser, client }
) => {
  await client.user.update({
    where:{
      id:loggedInUser.id
    },
    data:{
      deviceToken:null,
    },
    select:{
      id:true
    },
  });
  // console.log("delete token!")
  return { ok: true };
};

const resolver: Resolvers = {
  Mutation: {
    deletePushNotiToken: protectResolver(deletePushNotiTokenFn),
  },
};
export default resolver;

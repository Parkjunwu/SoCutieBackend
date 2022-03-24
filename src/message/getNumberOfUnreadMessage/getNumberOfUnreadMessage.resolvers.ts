import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

// cursor 도 만들어야 할듯
const getNumberOfUnreadMessageFn:Resolver = (_,__,{client,loggedInUser}) => client.message.count({
  where:{
    room:{
      UserOnRoom:{
        some:{
          userId:loggedInUser.id
        }
      }
    },
    userId:{
      not:loggedInUser.id
    },
    read:false,
  },
});

const resolver:Resolvers = {
  Query: {
    getNumberOfUnreadMessage:protectResolver(getNumberOfUnreadMessageFn)
  }
};

export default resolver;
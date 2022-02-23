import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

// cursor 도 만들어야 할듯
const getNumberOfUnreadNotificationFn:Resolver = (_,__,{client,loggedInUser}) => client.notification.count({
  where:{
    subscribeUserId:loggedInUser.id,
    read:false,
  },
});

const resolver:Resolvers = {
  Query: {
    getNumberOfUnreadNotification:protectResolver(getNumberOfUnreadNotificationFn)
  }
};

export default resolver;
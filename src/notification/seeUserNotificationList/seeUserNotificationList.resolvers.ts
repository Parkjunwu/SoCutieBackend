import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

// cursor 도 만들어야 할듯
const seeUserNotificationListFn:Resolver = async(_,{cursorId},{client,loggedInUser}) => {
  const take = 20;
  return client.notification.findMany({
    where:{
      OR:[
        // 그 외
        {subscribeUserId:loggedInUser.id},
        // 팔로잉한 사람이 post 올렸을 때
        {AND:[
          {which:"FOLLOWING_WRITE_POST"},
          {publishUser:{
            followers:{
              some:{
                id:loggedInUser.id
              }
            }
          }}
        ]}
      ]
    },
    take,
    ...(cursorId && { cursor:cursorId, skip:1}),
    orderBy:{
      createdAt:"desc"
    },
    // include 해줘야 받아짐.
    include:{
      publishUser:{
        select:{
          id:true,
          userName:true,
          avatar:true,
        }
      }
    }
  });
}
const resolver:Resolvers = {
  Query: {
    seeUserNotificationList:protectResolver(seeUserNotificationListFn)
  }
}

export default resolver;
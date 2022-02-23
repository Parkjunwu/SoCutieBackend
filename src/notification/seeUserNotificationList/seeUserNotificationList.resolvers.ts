import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

// cursor 도 만들어야 할듯
const seeUserNotificationListFn:Resolver = (_,__,{client,loggedInUser}) => client.notification.findMany({
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
})

const resolver:Resolvers = {
  Query: {
    seeUserNotificationList:protectResolver(seeUserNotificationListFn)
  }
}

export default resolver;
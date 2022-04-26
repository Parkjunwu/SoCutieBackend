import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const logicSeeUserNotificationList: Resolver = async(_,{cursorId},{client,loggedInUser}) => {
  const take = 20;
  const notification = await client.notification.findMany({
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
    orderBy:{
      createdAt:"desc"
    },
    take,
    ...(cursorId && { cursor: { id: cursorId }, skip:1}),
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

  const notificationCount = notification.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = notificationCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = notification[notificationCount-1].id;
    return {
      cursorId,
      hasNextPage:true,
      notification,
    };
  } else {
    return {
      hasNextPage:false,
      notification,
    };
  }
}

// cursor 도 만들어야 할듯
const seeUserNotificationListFn:Resolver = async(_,{cursorId},{client,loggedInUser}) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSeeUserNotificationList(_,{cursorId},{client,loggedInUser},null),
    "seeUserNotificationList"
  );

  // const take = 20;
  // return client.notification.findMany({
  //   where:{
  //     OR:[
  //       // 그 외
  //       {subscribeUserId:loggedInUser.id},
  //       // 팔로잉한 사람이 post 올렸을 때
  //       {AND:[
  //         {which:"FOLLOWING_WRITE_POST"},
  //         {publishUser:{
  //           followers:{
  //             some:{
  //               id:loggedInUser.id
  //             }
  //           }
  //         }}
  //       ]}
  //     ]
  //   },
  //   take,
  //   ...(cursorId && { cursor:cursorId, skip:1}),
  //   orderBy:{
  //     createdAt:"desc"
  //   },
  //   // include 해줘야 받아짐.
  //   include:{
  //     publishUser:{
  //       select:{
  //         id:true,
  //         userName:true,
  //         avatar:true,
  //       }
  //     }
  //   }
  // });
}
const resolver:Resolvers = {
  SeeUserNotificationListResponse:{
    // 프론트엔드에서 subscription mutation 데이터 받기 위함... 데이터 형식을 프론트엔드에서 못바꿔서..
    isNotFetchMore:() => false,
  },
  Query: {
    seeUserNotificationList:protectResolver(seeUserNotificationListFn)
  }
}

export default resolver;
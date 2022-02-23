import { PrismaClient } from "@prisma/client";
import pubsub, { NEW_NOTIFICATION } from "./pubsub";


export const pushNotificationUploadPost: (client:PrismaClient, loggedInUserId:number) => Promise<void> = async(client, loggedInUserId) =>{
  try {
    // 완료 후 notification 전송 + subscription pubsub 전송
    const notification = await client.notification.create({
      data:{
        which:"FOLLOWING_WRITE_POST",
        publishUser:{
          connect:{
            id:loggedInUserId
          }
        }
      },
      // include 안하면 안받아짐. 글고 몇개 안쓸 거니까 걔네만 받아
      include:{
        publishUser:{
          // select 랑 include 같이 못씀.
          select:{
            id:true,
            userName:true,
            avatar:true,
            followers:{
              select:{
                id:true
              }
            },
          },
        },
      }
    });
    // console.log(JSON.stringify(notification));
    // subscription 전송
    await pubsub.publish(NEW_NOTIFICATION,{userNotificationUpdate:notification})
    // await pubsub.publish(NEW_NOTIFICATION,{userNotificationUpdate:{...notification}})
  } catch (e) {
    console.log(e);
    console.log("notification, subscription 에서 문제 발생")
  }
};


// whichNotification 목록 (알림 종류)
  // MY_POST_GET_LIKE                   // 유저의 포스트에 좋아요
  // MY_POST_GET_COMMENT                // 유저의 포스트에 댓글
  // MY_COMMENT_GET_LIKE                // 유저의 댓글에 좋아요
  // MY_COMMENT_GET_COMMENT             // 유저의 댓글에 대댓글
  // MY_COMMENT_OF_COMMENT_GET_LIKE     // 유저의 대댓글에 좋아요
  // FOLLOW_ME                          // 유저를 팔로우
  // 댓글에서 언급 도 만들어야 겠군. 대댓글 단거에 댓글 달린 것도 받는게 나을라나? 여기선 유저 언급한게 나을라나?
  // 알림이 많을 수록 좋을 듯. 그리고 유저간의 내용으로. 뭐가 있습니다 이런거보다는. 사람들은 새로운 거를 원함. 특히 다른 사람들의.

type which = "MY_POST_GET_LIKE" | "MY_POST_GET_COMMENT" | "MY_COMMENT_GET_LIKE" | "MY_COMMENT_GET_COMMENT" | "MY_COMMENT_OF_COMMENT_GET_LIKE" | "FOLLOW_ME"

export const pushNotificationNotUploadPost: (client:PrismaClient, whichNotification:which, loggedInUserId:number, subscribeUserId:number) => Promise<void> = async(client, whichNotification, loggedInUserId, subscribeUserId) => {
  try {
    const notification = await client.notification.create({
      data:{
        which: whichNotification,
        publishUser: {
          connect: {
            id:loggedInUserId
          }
        },
        subscribeUserId
      },
      //include 해야 유저 정보 pubsub 으로 보낼 수 있음.
      include: {
        publishUser: {
          select: {
            id:true,
            userName:true,
            avatar:true,
          }
        },
      }
    });
    // subscription 전송
    await pubsub.publish(NEW_NOTIFICATION,{userNotificationUpdate:notification});
    // await pubsub.publish(NEW_NOTIFICATION,{userNotificationUpdate:{...notification}})
  } catch (e) {
    console.log(e);
    console.log("notification, subscription 에서 문제 발생")
  }
};


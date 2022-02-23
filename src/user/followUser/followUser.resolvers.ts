// import pubsub, { NEW_NOTIFICATION } from "../../pubsub";
import { pushNotificationNotUploadPost } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../user.utils";

const followUserFn: Resolver = async (
  _,
  { id },
  { loggedInUser, client }
) => {
  // const ok = await client.user.findUnique({ where: { id } });
  const ok = await client.user.count({ where: { id } });
  if (!ok) {
    return { ok: false, error: "That user doesn't exist" };
  }
  await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      following: {
        connect: {
          id,
        },
      },
    },
    select:{
      id:true,
    },
  });

  // 팔로우 완료 후 notification, subscription
  await pushNotificationNotUploadPost(client, "FOLLOW_ME", loggedInUser.id, id);
  // try {
  //   const notification = await client.notification.create({
  //     data:{
  //       which:"FOLLOW_ME",
  //       publishUser:{
  //         connect:{
  //           id:loggedInUser.id
  //         }
  //       },
  //       subscribeUserId:id
  //     },
  //     //include 해야 유저 정보 pubsub 으로 보낼 수 있음.
  //     include:{
  //       publishUser:{
  //         select:{
  //           id:true,
  //           userName:true,
  //           avatar:true,
  //         }
  //       },
  //     }
  //   });
  //   // subscription 전송
  //   await pubsub.publish(NEW_NOTIFICATION,{userNotificationUpdate:{...notification}})
  // } catch (e) {
  //   console.log(e);
  //   console.log("notification, subscription 에서 문제 발생")
  // }
  

  return { ok: true };
};

const resolver: Resolvers = {
  Mutation: {
    followUser: protectResolver(followUserFn),
  },
};
export default resolver;

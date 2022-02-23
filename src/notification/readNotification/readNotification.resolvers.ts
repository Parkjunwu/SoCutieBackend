import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const readNotificationFn: Resolver = async(_,__,{client,loggedInUser}) => { 
  try {
    await client.notification.updateMany({
      where:{
        subscribeUserId:loggedInUser.id,
        read:false,
      },
      data:{
        read:true,
      }
    })
  } catch (e) {
    console.log(e);
    console.log("readNotification // 알림 읽음 처리에서 오류 발생");
    return {ok:false, error:"알 수 없는 에러입니다. 같은 문제가 계속 발생 시 문의 주시면 감사드리겠습니다."}
  };
  return {ok:true};
};

const resolver:Resolvers = {
  Mutation: {
    readNotification:protectResolver(readNotificationFn)
  }
}
export default resolver;
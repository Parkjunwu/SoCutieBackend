import { withFilter } from "graphql-subscriptions";
import pubsub, { GET_MESSAGE } from "../../pubsub";

// 그냥 왔다는 알림만 보냄. 만약 핸드폰 알림이 이거 필요하면 roomUpdate 에 id:Int 로 구현.
// roomUpdate 에 할라면 받는 유저 정보가 없어서 그거를 어디에 집어넣던가 해야함.

const resolver = {
  Subscription:{
    justAlertThereIsNewMessage:{
      subscribe: 
      async (parent, args, context, info) => {
        if(!context.loggedInUser?.id) {
          console.log("로그인 안한 유저가 메세지 이용함. 해킹 가능성 있음.")
          throw new Error("로그인 후 이용 가능합니다.");
        }
        try {
          return withFilter(
            () => pubsub.asyncIterator(GET_MESSAGE),
            ({justAlertThereIsNewMessage},_,{loggedInUser}) => {
              // justAlertThereIsNewMessage 가 { userId: 1 } 같은 객체가 아니고 그냥 userId 임. 헷갈리면 변경해
              return justAlertThereIsNewMessage === loggedInUser.id;
            }
          )(parent, args, context,info)
        } catch (e) {
          console.log(e);
          throw new Error("Something wrong");
        }
      }
    }
  }
};

export default resolver;


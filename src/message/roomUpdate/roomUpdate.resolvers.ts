import { withFilter } from "graphql-subscriptions";
import pubsub, { NEW_MESSAGE } from "../../pubsub";
import client from "../../client";

// roomUpdate 에 할라면 받는 유저 정보가 없어서 그거를 어디에 집어넣던가 해야함.
// 여기에는 받는 유저 정보가 없음. 이거를 보내야 함. 혹은 뭐 roomId 사용하든가 해야함.
// 보내는 자료형이 Message 라서 subscribeToMore 에 쓸라면 그대로 써야함. 받는 유저 정보를 넣고 싶은데 이거 때문에 애매

const resolver = {
  Subscription:{
    roomUpdate:{
      subscribe: 
      async (parent, args, context, info) => {
        if(!context.loggedInUser?.id) {
          console.log("로그인 안한 유저가 메세지 이용함. 해킹 가능성 있음.")
          throw new Error("로그인 후 이용 가능합니다.");
        }
        if(!args.id) {
          try {
            return withFilter(
              () => pubsub.asyncIterator(NEW_MESSAGE),
              async({roomUpdate}:{roomUpdate:{roomId:number}},_,{loggedInUser}) => {
                const ok = await client.room.findFirst({
                  where:{
                    UserOnRoom:{
                      some:{
                        userId:loggedInUser.id
                      }
                    },
                    id:roomUpdate.roomId,
                  },
                  select:{
                    id:true
                  },
                });
                return Boolean(ok);
              }
            )(parent, args, context,info)
          } catch (e) {
            console.log(e);
            throw new Error("Something wrong");
          }
        }
        const room = await client.room.findFirst({
          where:{
            id:args.id,
            UserOnRoom:{
              some:{
                userId:context.loggedInUser.id
              }
            },
          },
          select:{
            id:true
          }
        })
        if(!room) {
          throw new Error("Cannot see this.");
        }
        try {
          return withFilter(
            () => pubsub.asyncIterator(NEW_MESSAGE),
            ({roomUpdate},{id}) => {
              return roomUpdate.roomId === id
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


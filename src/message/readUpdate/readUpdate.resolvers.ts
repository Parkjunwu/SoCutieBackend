import { withFilter } from "graphql-subscriptions";
import pubsub, { READ_MESSAGE } from "../../pubsub";
import client from "../../client";


const resolver = {
  Subscription:{
    readUpdate:{
      subscribe: 
      async (parent, args, context, info) => {
        if(!context.loggedInUser?.id) {
          console.log("로그인 안한 유저가 메세지 이용함. 해킹 가능성 있음.")
          throw new Error("로그인 후 이용 가능합니다.");
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
            id:true,
          }
        })
        if(!room) {
          throw new Error("Cannot see this.");
        }
        try {
          return withFilter(
            () => pubsub.asyncIterator(READ_MESSAGE),
            ({readUpdate},{id},{loggedInUser}) => {
              console.log(readUpdate);
              return readUpdate.roomId === id && readUpdate.userId !== loggedInUser.id
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


import { withFilter } from "graphql-subscriptions";
import pubsub, { NEW_NOTIFICATION } from "../../pubsub";

// const subscribeFn = 

const resolver = {
  Subscription:{
    userNotificationUpdate:{
      subscribe: 
      // ()=>pubsub.asyncIterator(NEW_MESSAGE)
      async (parent, args, context, info) => {
        // context.loggedInUser.id
        if(!context.loggedInUser.id) {
          throw new Error("Cannot see this.");
        }
        return withFilter(
          () => pubsub.asyncIterator(NEW_NOTIFICATION),
          async({userNotificationUpdate},_,{loggedInUser}) => {
            if(userNotificationUpdate.which === "FOLLOWING_WRITE_POST") {
              // 이건 follower 받고 그걸로 확인. 데이터베이스 한번만 들어가지만 보내는 사람 팔로워가 커지면 데이터 양이 커짐. 이게 서버로 가서 확인된 유저에게 보내는 건지. 이러면 이게 짱이지만 메커니즘을 정확히 몰라서 좋을 지는 잘 모르겟음.
              const array = userNotificationUpdate.publishUser.followers
              const id = loggedInUser.id
              for(let i in array) {
                console.log(i)
                if(array[i].id === id) {
                  return true;
                }
              }
              return false;
              //얘는 follower 안받고 보낸 유저 id 가 내 팔로워에 있나로 확인. post 업로드 마다 모든 유저가 데이터베이스로 확인해야함. 이게 더 안좋겟군.
              // console.log(userNotificationUpdate.publishUser.followers.include({id:loggedInUser.id}));
              // return userNotificationUpdate.publishUser.followers.include({id:loggedInUser.id})
              // const ok = await client.user.findFirst({
              //     where:{
              //       id:loggedInUser.id,
              //       following:{
              //         some:{
              //           id:userNotificationUpdate.publishUserId
              //         }
              //       }
              //     },
              //     select:{
              //       id:true
              //     }
              //   });
              //   // console.log(ok)
              // return Boolean(ok);
            } else {
              return userNotificationUpdate.subscribeUserId === loggedInUser.id;
            }


            // switch (userNotificationUpdate.which) {
            //   case 'FOLLOWING_WRITE_POST':
            //     // 만약 이렇게 되면 데이터베이스 엄청 빡세겠는데 ,, 올릴 때마다 유저 전부 다 확인해서 받아.
            //     // 아니면 following 목록을 따로 받아서 그걸로 확인? 그게 더 에바인가?
            //     // 그것도 아니면 room 같은거 만들어서 거기 포함되있냐로 확인.. 흠.

            //     // 얘는 userId 가 글쓴이 (유저 본인 말고 글 쓴 사람) !!!!!
            //     const ok = client.user.findFirst({
            //       where:{
            //         id:loggedInUser.id,
            //         following:{
            //           some:{
            //             id:userNotificationUpdate.userId
            //           }
            //         }
            //       }
            //     });
            //     return Boolean(ok);

            //   // 나머진 다 똑같네

            //   // case 'MY_POST_GET_LIKE':
            //   // case 'MY_POST_GET_COMMENT':
            //   // case 'MY_COMMENT_GET_LIKE':
            //   // case 'MY_COMMENT_GET_COMMENT':
            //   // case 'MY_COMMENT_OF_COMMENT_GET_LIKE':
            //   // case 'FOLLOW_ME':
            //   //   // userNotificationUpdate.  userId  === loggedInUser.id
            //   //   // 얘는 userId 가 나 (받는 유저 자신) !!!!!
            //   //   return userNotificationUpdate.subscribeUserId === loggedInUser.id;

            //   default:
            //     return userNotificationUpdate.subscribeUserId === loggedInUser.id;
            // }

          }
        )(parent, args, context,info)
      }
    }
  }
};

export default resolver;


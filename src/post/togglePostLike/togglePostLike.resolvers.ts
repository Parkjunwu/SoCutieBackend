// import pubsub, { NEW_NOTIFICATION } from "../../pubsub";
import { pushNotificationNotUploadPost } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const togglePostLikeFn:Resolver = async(_,{id},{client,loggedInUser}) => {
  const post = await client.post.count({
    where:{id},
  })
  if(!post) return {ok:false,error:"post not found"}
  const likeWhere = {
    postId_userId:{
      postId:id,
      userId:loggedInUser.id
    }
  }
  const like = await client.postLike.findUnique({
    where:likeWhere,
    select:{
      id:true,
    },
  })
  if(like) {
    await client.postLike.delete({where:likeWhere})
  } else {
    const result = await client.postLike.create({
      data:{
        userId:loggedInUser.id,
        postId:id
        // user:{
        //   connect:{
        //     id:loggedInUser.id
        //   }
        // },
        // post:{
        //   connect:{
        //     id
        //     // id:post.id
        //   }
        // }
      },
      select:{
        post:{
          select:{
            userId:true
          }
        }
      }
    });

    // 좋아요 완료 후 notification, subscription
    await pushNotificationNotUploadPost(client, "MY_POST_GET_LIKE", loggedInUser.id, result.post.userId);
    // if(result) {     // 이렇게 안해도 될듯
    // try {
    //   const notification = await client.notification.create({
    //     data:{
    //       which:"MY_POST_GET_LIKE",
    //       publishUser:{
    //         connect:{
    //           id:loggedInUser.id
    //         }
    //       },
    //       subscribeUserId:result.post.userId
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

    //   console.log(notification);
      
    //   // subscription 전송
    //   await pubsub.publish(NEW_NOTIFICATION,{userNotificationUpdate:{...notification}})
    // } catch (e) {
    //   console.log(e);
    //   console.log("notification, subscription 에서 문제 발생")
    // }
  } 

  return {ok:true}
}

const resolver:Resolvers = {
  Mutation:{
    togglePostLike:protectResolver(togglePostLikeFn)
  }
}
export default resolver
// import pubsub, { NEW_NOTIFICATION } from "../../pubsub";
import { pushNotificationNotUploadPost } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const togglePostLikeFn:Resolver = async(_,{id},{client,loggedInUser}) => {
  const post = await client.post.count({
    where:{id},
  });
  if(!post) return {ok:false,error:"post not found"}
  const likeWhere = {
    postId_userId:{
      postId:id,
      userId:loggedInUser.id
    }
  };
  const like = await client.postLike.findUnique({
    where:likeWhere,
    select:{
      id:true,
    },
  });
  if(like) {
    await client.postLike.delete({where:likeWhere});
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
            userId:true,
            id:true,
          }
        }
      }
    });

    const loggedInUserId = loggedInUser.id;
    const subscribeUserId = result.post.userId;
    const postId = id;
    // 좋아요 완료 후 notification, subscription
    // 좋아요 한 사람이 본인이면 안보냄.
    if(loggedInUserId !== subscribeUserId) {
      await pushNotificationNotUploadPost(client, "MY_POST_GET_LIKE", loggedInUser.id, subscribeUserId, { postId });
    }
  }

  return {ok:true};
}

const resolver:Resolvers = {
  Mutation:{
    togglePostLike:protectResolver(togglePostLikeFn)
  }
}
export default resolver
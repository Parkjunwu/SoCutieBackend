import { async_uploadPhotoS3 } from "../../shared/AWS";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";
import { processHashtags, S3_FOLDER_NAME } from "../post.utils";
import { GraphQLUpload } from 'graphql-upload';
import { pushNotificationUploadPost } from "../../pushNotificationAndPublish";

const uploadPostFn: Resolver = async(_,{photoArr,caption,},{client,loggedInUser}) => {
  
  // 업로드할 url 배열
  // let addPhotoUrlArr:Array<{url:string}>;
  let addPhotoUrlArr:Array<string>;
  if (photoArr){
    try {
      //aws 업로드. url 받은 거 데이터베이스에도 씀. await Promise.all , map 같이 써야하는거 유의
      addPhotoUrlArr = await Promise.all(
        photoArr.map(async (photo:any) => {
          if(loggedInUser?.id){
            const url = await async_uploadPhotoS3(photo,loggedInUser.id,S3_FOLDER_NAME)
            return  url 
          }
        })
      )
    } catch (e) {
      console.log(e);
      console.log("uploadPost // 파일 업로드 에러");
      return {ok:false, error:"파일 업로드에 실패하였습니다."}
    }
  };
  
  
  let hashTags = null;
  if(caption) {
    hashTags = processHashtags(caption)
  }
  const result = await client.post.create({
    data:{
      user:{
        connect:{
          id:loggedInUser.id
        },
      },
      file:addPhotoUrlArr,
      caption,
      // ...(hashTags && {hashTags:{
      //   connectOrCreate:hashTags
      // }})
      ...(hashTags && {PostOnHashTag:{
        create:hashTags
        // [{
        //   hashtag:{
        //     connectOrCreate:{
        //       where:{
        //         name:hashTags
        //       },
        //       create:{                
        //         name
        //       }
        //     }
        //   }
        // }]
      }}),
    },
    // 굳이 다 받을 필요 없으니 얘를 써도 됨. 나머지는 프론트엔드에서 캐시로 구현. 귀찮으면 그냥 전체 다 받음.
    select:{
      id:true,
      createdAt:true,
    }
  });


  // 완료 후 notification 전송 + subscription pubsub 전송
  await pushNotificationUploadPost(client, loggedInUser.id);


  return { ok:true, uploadedPost:result };
}

const resolver:Resolvers = {
  //Upload 타입 정의
  Upload: GraphQLUpload,
  Mutation: {
    uploadPost: protectResolver
    (uploadPostFn)
  }
}
export default resolver
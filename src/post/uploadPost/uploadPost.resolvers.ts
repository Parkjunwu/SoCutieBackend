import { async_uploadPhotoS3 } from "../../shared/AWS";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";
import { processHashtags, S3_FOLDER_NAME } from "../post.utils";
import { GraphQLUpload } from 'graphql-upload';
// import pubsub, { NEW_NOTIFICATION } from "../../pubsub";
import { pushNotificationUploadPost } from "../../pushNotificationAndPublish";

// const { filename, createReadStream } = await file;
// const uploadName = `${loggedInUser.id}-${Date.now()}-${filename}`
// const write =  createWriteStream(`${process.cwd()}/uploads/${uploadName}`)
// createReadStream().pipe(write)
// const fileUrl = `http://localhost:4000/static/${uploadName}`;

// const ok = await client.post.create({
//   data:{user:loggedInUser,file:fileUrl,caption}
// })
// if(!ok) return {ok:false, error:"can't upload"}
// return {ok:false}

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
      console.log("uploadPost // 파일 삭제 에러");
      return {ok:false, error:"Delete file Error"}
    }
  }
  // const fileUrl = await uploadToS3(file,loggedInUser.id,"upload")
  
  
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
      }})
    }
  })


  // 완료 후 notification 전송 + subscription pubsub 전송
  await pushNotificationUploadPost(client, loggedInUser.id)
  // try {
  //   // 완료 후 notification 전송 + subscription pubsub 전송
  //   const notification = await client.notification.create({
  //     data:{
  //       which:"FOLLOWING_WRITE_POST",
  //       publishUser:{
  //         connect:{
  //           id:loggedInUser.id
  //         }
  //       }
  //     },
  //     // include 안하면 안받아짐. 글고 몇개 안쓸 거니까 걔네만 받아
  //     include:{
  //       publishUser:{
  //         // select 랑 include 같이 못씀.
  //         select:{
  //           id:true,
  //           userName:true,
  //           avatar:true,
  //           followers:{
  //             select:{
  //               id:true
  //             }
  //           },
  //         },
  //       },
  //     }
  //   });
  //   // console.log(JSON.stringify(notification));
  //   // subscription 전송
  //   await pubsub.publish(NEW_NOTIFICATION,{userNotificationUpdate:{...notification}})
  // } catch (e) {
  //   console.log(e);
  //   console.log("notification, subscription 에서 문제 발생")
  // }


  return result;
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
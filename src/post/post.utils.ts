export const processHashtags = (caption:string) => caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w.]+/g)?.map(hashTag=>({
      hashtag:{
        connectOrCreate:{
          where:{
            name:hashTag
          },
          create:{
            name:hashTag
          }
        }
      }
    })
  )

export const S3_FOLDER_NAME = "uploads";

// import client from "../client"

// export const processHashtags = async(caption:string,postId:number) => 
//   // 여기 이상함. 나중에 확인.
//   await Promise.all(caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w.]+/g)?.map(async(hashTag)=>{
//     const hashtagId = await client.hashTag.findUnique({
//       where:{
//         name:hashTag
//       },
//       select:{
//         id:true
//       },
//     })
//     return {
//       where:{postId_hashtagId:{postId,hashtagId:hashtagId.id}},
//       create:{hashtagId:hashtagId.id}
//     }
//   }
// ))
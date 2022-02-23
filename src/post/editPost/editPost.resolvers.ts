import { async_deletePhotoS3, async_uploadPhotoS3 } from "../../shared/AWS";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";
import { processHashtags, S3_FOLDER_NAME } from "../post.utils";

const editPostFn: Resolver = async(_, {id, caption, addPhotoArr, addPhotoIndexArr, deletePhotoArr, wholePhotoArr}, {client, loggedInUser}) => {

  // 지금은 url 만 받고 배열로 받고 있음. 그니까 걍 배열 자체를 받으면 순서도 정해지겠네.
  // 그러면 배열, 새로운 {파일, index}, 지울 url 받으면 되나?
  // 이전 배열을 받아서 비교하고 바꾸는건... 이게 더 나을라나? 검증해야하나? 기존 사진들 배열에 있는 게 맞는지
  // 코드로 쿼리 보낼 수가 있을라나?
  // 배열도 애초에 새로운 파일 들어갈 곳을 비워서 받아. 추가할라면 복잡함. 앞에 추가하면 index 계산해야해



  // const oldPost = await client.post.findFirst({
  //   where:{
  //     id,
  //     userId:loggedInUser.id
  //   },
  //   include:{
  //     hashTags:{
  //       select:{
  //         hashTag:true
  //       }
  //     }
  //   }
  // })
  const oldPost = await client.post.findFirst({
    where:{
      id,
      userId:loggedInUser.id
    },
    // select:{
    //   PostOnHashTag:{
    //     select:{
    //       hashtagId,
    //       postId
    //     }
    //   }
    // }
  }).PostOnHashTag({
    select:{
      hashtagId:true,
      postId:true,
      // hashtag:{
      //   select:{
      //     PostOnHashTag:{
      //       select:{
      //         postId:true,
      //         hashtagId:true
      //       }
      //     }
      //   }
      // }
    }
  })

  // hashTags({
  //   select:{
  //     hashTag:true
  //   }
  // })
  // console.log(oldPost)

  if(!oldPost) return {ok:false,error:"Can't edit another user's Post"}
  // 지금은 이전 caption 전체 지우고 다시 넣는 식. 차이를 받아서 넣고 빼는 것도 좋을 듯.
  const deleteHashtags = oldPost.map(post=>({postId_hashtagId:post}))
  // const deleteHashtags = oldPost.map(post=>({postId_hashtagId:post.hashtag.PostOnHashTag[0]}))
  console.log(JSON.stringify(oldPost));
  console.log(deleteHashtags);

  // const postId = oldPost[0].hashtag.PostOnHashTag[0].postId

//   const processHashtags = async(caption:string,postId:number) => 
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

  // 일단 받은 배열 wholePhotoArr 에 결과를 집어넣음
  // let s3AddPhotoUrlArr:Array<string>;
  if(wholePhotoArr.length > 10) {
    return {ok:false, error:"한 게시물 당 10개 이상의 사진을 올릴 수 없습니다."}
  }

  if(wholePhotoArr && !addPhotoArr && !addPhotoIndexArr) {
    // wholePhotoArr 가 왔는데 addPhotoArr, addPhotoIndexArr 가 같이 안오면 에러. 이상한 접근.
    console.log("editPost // wholePhotoArr doesn't get with addPhotoArr, addPhotoIndexArr")
    return {ok:false, error:"알 수 없는 접근입니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."}
  }

  if(addPhotoArr?.length !== addPhotoIndexArr?.length) {
    // addPhotoArr, addPhotoIndexArr 하나만 왔거나 addPhotoArr, addPhotoIndexArr length 가 안맞으면 이상한 접근.
    console.log("editPost // addPhotoArr, addPhotoIndexArr 하나만 왔거나 addPhotoArr, addPhotoIndexArr length 가 안맞으면 이상한 접근.")
    return {ok:false, error:"알 수 없는 접근입니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."}
  }


    // deletePhotoArr, wholePhotoArr 왔을 때 검증. 이전 사진 목록과 대조.
  if (deletePhotoArr || wholePhotoArr) {
    // 이전 사진 목록
    const prevPhotoArr = await client.post.findUnique({
      where:{
        id
      },
      select:{
        file:true
      }
    });
    
    // 전체 목록이 이전에 있는 목록이랑 다른지. 그것도 확인
    if (wholePhotoArr) {
      try {
        wholePhotoArr.map((url:string) => {
          // 추가할 곳은 넘어감
          if(url === "") return;
          const isInPrevPhoto = prevPhotoArr.file.includes(url)
          // 없으면 에러 메세지 출력하고 에러 메세지 전송.
          if(!isInPrevPhoto){
            throw Error("editPost // 전체 사진 목록에 이전 사진 목록에 없는 사진이 있음. 해킹 가능성 있음.")
          }
        })
      } catch (e) {
        console.log(e);
        return { ok:false, error:"이전 사진들 목록과 다릅니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."}
      }
    }

    if (deletePhotoArr){
      // 여기서 하나라도 다른게 있으면 아예 삭제를 안하거나, 아니면 있는 애들은 지우고 없는 거만 오류 출력하거나.
      // 캐시를 쓰면 실제 데이터와 로컬 데이터가 달라질 수 있어서 문제가 있을 거 같긴 한데, 그래도 아예 안하게 하는게 낫겠지?
      try {
        deletePhotoArr.map((url:string) => {
          const isInPrevPhoto = prevPhotoArr.file.includes(url)
          // 없으면 에러 메세지 출력하고 에러 메세지 전송.
          if(!isInPrevPhoto){
            throw Error("editPost // 지울 사진이 이전 사진 목록에 없음. 해킹 가능성 있음.")
          }
        })
      } catch (e) {
        console.log(e);
        return { ok:false, error:"이전 사진들 목록과 다릅니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."}
      }

      // S3 삭제
      try {
        await Promise.all(
          deletePhotoArr.map((async(deletePhotoObj:string) => {
            await async_deletePhotoS3(deletePhotoObj,S3_FOLDER_NAME)
          }))
        )
      } catch (e) {
        return {ok:false, error:"Delete file Error"}
      }
    } 
  }


  //  근데 만약 사진은 지웠는데 올리는데서 오류났어, 그러면 다시 복구하는 코드도 작성해야 하지 않나??



  if(addPhotoArr){
    try {
      //aws 업로드. url 받은 거 데이터베이스에도 씀. await Promise.all , map 같이 써야하는거 유의
      // input 타입이라 JSON.parse(JSON.stringify( ~~ )) 써줘야 함.
      // const parseObj = JSON.parse(JSON.stringify(addPhotoArr))
      // s3AddPhotoUrlArr = await Promise.all(
        // console.log(addPhotoArr);

        await Promise.all(
        // addPhotoArr.map(async (photo:any) => {
          addPhotoArr.map(async (photoObj,index) => {
          if(loggedInUser?.id){
            const url = await async_uploadPhotoS3(photoObj, loggedInUser.id, S3_FOLDER_NAME)
            // return  url 
            // wholePhotoArr 의 index 에 url 을 넣음
            wholePhotoArr[addPhotoIndexArr[index]] = url;
          }
        })
      )
    } catch (e) {
      console.log(e);
      console.log("editPost // S3 사진 업로드 오류");
      return {ok:false, error:"사진 업로드에 실패하였습니다. 계속해서 같은 문제 발생 시 문의 주시면 감사드리겠습니다."}
    }
  }




  // let deletePhotoIdArr;
  // if(deletePhotoArr) {
  //   deletePhotoIdArr = deletePhotoArr.map((deletePhotoObj:{photoId:number,url:string}) => deletePhotoObj.photoId )
  //   try {
  //     await Promise.all(
  //       deletePhotoArr.map(async(deletePhotoObj:{photoId:number,url:string}) => {
  //         // input 타입이라 JSON.parse(JSON.stringify( ~~ )) 써줘야 함.
  //         const parseObj = JSON.parse(JSON.stringify(deletePhotoObj))
  //         await delPhotoS3(parseObj.url)
  //       })
  //     );
  //   } catch (e) {
  //     return {ok:false, error:"Delete file Error"}
  //   }
  // }
  
  await client.post.update({
    where:{id},
    data:{
      caption,
      ...(wholePhotoArr && {file:wholePhotoArr}),
      PostOnHashTag:{
        // disconnect,
        delete:deleteHashtags,
        // [
        //   {
        //     postId_hashtagId:{
        //       postId
        //       hashtagId
        //     }
        //   }
        // ]
        // 여기가 connectOrCreate 가 아니고 create 겠네. 이건 두개 쌍의 새로운 id 만드는 거나까, 글고 disconnect 말고 그냥 delete 하면 되네
        // connectOrCreate: await processHashtags(caption,postId)
        create:processHashtags(caption)
        // [
        //   {
        //     hashtag:{
        //       connectOrCreate:{
        //         where:{
        //           name
        //         }
        //         create:{
        //           name
        //         }
        //       }
        //     }
        //   }
        // ]

        // [
        //   {
        //     where:{
        //       postId_hashtagId:{
        //         postId,
        //         hashtagId
        //       }
        //     },
        //     create:{
        //       hashtagId
        //     }
        //   }
        // ]
      }
      // hashTags: {
      //   // disconnect:oldPost.hashTags,
      //   disconnect:oldPost,
        // connectOrCreate:processHashtags(caption),
      // }
    }
  })
  // 결과 Post 도 보내줘야 할거 같은데..
  return {ok:true}
}
//   const {userId,caption:previousCaption} = await client.post.findUnique({where:{id}})
//   if(userId !== loggedInUser.id) return {ok:false,error:"Can't edit another user's Post"}
//   if(caption === previousCaption) return {ok:true}

//   const hashTag = caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w.]+/g)?.map(hash => ({hashTag:hash}))
//   const previousHash = await client.post.findUnique({where:{id}}).hashTags({
//     select:{
//       hashTag:true,
//     }
//   })
//   let hashTagChange
//   if(hashTag !== previousHash){
//     hashTagChange=hashTag?.map(hashTag=>({
//       where:hashTag,
//       create:hashTag
//     })
//     )
//   }
//   console.log("New"+hashTagChange)
//   console.log("Old"+previousHash)

  // const updatePost = await client.post.update({
  //   where:{id},
  //   data:{
  //     caption,
  //     ...((hashTagChange || previousHash) && {hashTags: {
  //       disconnect:previousHash,
  //       connectOrCreate:hashTagChange,
  //     }
  //   }),
  //   }
  // })
//   if(updatePost) {
//     return {ok:true}
//   }
//   return {ok:false, error:"Unknown Error"}
// }

const resolver: Resolvers = {
  Mutation:{
    editPost:protectResolver(editPostFn)
  }
}
export default resolver;
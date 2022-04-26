import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver } from "../../types"
import { protectResolver } from "../../user/user.utils";

const logicGetRoomMessages: Resolver = async(_,{roomId,cursorId:cursorInput},{client,loggedInUser}) => {
  // 유저와 연결된 room 이 있는지 확인.
  const userOnRoom = await client.userOnRoom.findUnique({
    where:{
      userId_roomId:{
        userId:loggedInUser.id,
        roomId
      }
    },
  });
  if(!userOnRoom) {
    console.log("getRoomMessages // 다른 유저의 방에 접근함. 해킹 가능성 있음.")
    return { error:"다른 유저의 방에 들어갈 수 없습니다." };
  };

  // 실제 쿼리
  const take = 20;

  const messages = await client.message.findMany({
    where:{
      roomId,
    },
    orderBy:{
      createdAt:"desc",
    },
    include:{
      user:{
        select:{
          id:true,
          // id 만 받고 이걸로 확인해도 될듯?
          userName:true,
          avatar:true,
        }
      }
    },
    take,
    ...(cursorInput && {
      cursor: {
        id:cursorInput
      },
      skip:1
    })
  });

  // 아래는 pagination 은 다 비슷해서 함수로 만들라 했는데. 각각 반환하는 부분의 key 가 달라서 (여기선 messages) 만들기 좀 어렵고 (인수로 take, data, key 세개 줘야됨) return 이 여기에 안나와서 봤을 때 좀 헷갈릴듯? 리턴이 어디있지 하고.

  const messagesCount = messages.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = messagesCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = messages[messagesCount-1].id;
    return {
      cursorId,
      hasNextPage:true,
      messages,
    };
  } else {
    return {
      hasNextPage:false,
      messages,
    };
  }
};

const getRoomMessagesFn: Resolver = async(_,{roomId,cursorId:cursorInput},{client,loggedInUser}) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicGetRoomMessages(_,{roomId,cursorId:cursorInput},{client,loggedInUser},null),
    "getRoomMessages"
  );
};

// const getRoomMessagesFn: Resolver = async(_,{roomId,cursorId:cursorInput},{client,loggedInUser}) => {
//   try {
//     // 유저와 연결된 room 이 있는지 확인.
//     const userOnRoom = await client.userOnRoom.findUnique({
//       where:{
//         userId_roomId:{
//           userId:loggedInUser.id,
//           roomId
//         }
//       },
//     });
//     if(!userOnRoom) {
//       console.log("getRoomMessages // 다른 유저의 방에 접근함. 해킹 가능성 있음.")
//       return { error:"다른 유저의 방에 들어갈 수 없습니다." };
//     };

//     // 실제 쿼리
//     const take = 20;

//     const messages = await client.message.findMany({
//       where:{
//         roomId,
//       },
//       orderBy:{
//         createdAt:"desc",
//       },
//       include:{
//         user:{
//           select:{
//             id:true,
//             // id 만 받고 이걸로 확인해도 될듯?
//             userName:true,
//             avatar:true,
//           }
//         }
//       },
//       take,
//       ...(cursorInput && {
//         cursor: {
//           id:cursorInput
//         },
//         skip:1
//       })
//     });


//     const messagesCount = messages.length;

//     // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
//     const isHaveHaveNextPage = messagesCount === take;

//     if( isHaveHaveNextPage ){
//       const cursorId = messages[messages.length-1].id;
//       return {
//         cursorId,
//         hasNextPage:true,
//         messages,
//       };
//     } else {
//       return {
//         hasNextPage:false,
//         messages,
//       };
//     };

//   // 알 수 없는 에러 발생시
//   } catch (e) {
//     console.error("getRoomMessages 에러 : "+e);
//     return { error: "데이터를 받지 못했습니다. 지속적으로 같은 문제가 발생한다면 문의주시면 감사드리겠습니다." }
//   }
// };


// GetRoomMessagesResolvers 에서 boolean 보내기 위함. 안쓰면 삭제
type GetRoomMessagesResolvers = {
  [key: string]: {
    [key: string]: Resolver | Boolean;
  };
};

const resolver:GetRoomMessagesResolvers = {
  GetRoomMessagesResponse:{
    // 프론트엔드에서 subscription mutation 데이터 받기 위함... 데이터 형식을 프론트엔드에서 못바꿔서..
    isNotFetchMore:() => false,
  },
  Query:{
    getRoomMessages:protectResolver(getRoomMessagesFn)
  }
};

export default resolver;
import paginationErrorCheckNeedLogicAndQueryName 
from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const logicSeeRooms: Resolver = async(_,{cursorId},{client,loggedInUser}) => {
  const take = 30;
  const rooms = await client.room.findMany({
    where:{
      UserOnRoom:{
        some:{
          userId:loggedInUser.id
        }
      }
    },
    orderBy:{
      // createdAt:"desc"
      updatedAt:"desc"
    },
    take,
    ...(cursorId && {cursor: { id: cursorId }, skip:1})
  });

  const roomCount = rooms.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = roomCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = rooms[roomCount-1].id;
    
    return {
      cursorId,
      hasNextPage:true,
      rooms,
    };
  } else {
    return {
      hasNextPage:false,
      rooms,
    };
  }
};

const seeRoomsFn: Resolver = async(_,{cursorId},{client,loggedInUser}) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSeeRooms(_,{cursorId},{client,loggedInUser},null),
    "seeRoom"
  );
};

// const seeRoomsFn: Resolver = async(_,{cursorId},{client,loggedInUser}) => {
//   try {
//     const take = 25;
//     const rooms = await client.room.findMany({
//       where:{
//         UserOnRoom:{
//           some:{
//             userId:loggedInUser.id
//           }
//         }
//       },
//       take,
//       ...(cursorId && {cursor: cursorId, skip:1})
//     });

//     const roomCount = rooms.length;

//     // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
//     const isHaveHaveNextPage = roomCount === take;

//     if( isHaveHaveNextPage ){
//       const cursorId = rooms[roomCount-1].id;
      
//       return {
//         cursorId,
//         hasNextPage:true,
//         rooms,
//       };
//     } else {
//       return {
//         hasNextPage:false,
//         rooms,
//       };
//     }

//   } catch (e) {
//     console.log("seeRooms 에러")
//     return { error:"데이터를 받지 못하였습니다. 지속적으로 같은 문제가 발생 시 문의주시면 감사드리겠습니다." };
//   }
  
// };

const resolver: Resolvers = {
  SeeRoomResponse:{
    // 프론트엔드에서 subscription mutation 데이터 받기 위함... 데이터 형식을 프론트엔드에서 못바꿔서..
    isNotFetchMore:() => false,
  },
  Query:{
    seeRooms:protectResolver(seeRoomsFn)
  }
};

export default resolver;
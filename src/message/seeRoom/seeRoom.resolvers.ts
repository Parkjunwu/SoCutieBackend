import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

// 메세지 pagination 으로 받아야 할듯? 여기서 받으면 Room 의 resolver 에서 Message 20개 받음.
// 그 다음부턴 메세지 getMessages 로 받음.
// Room 의 resolver 에서 Message 에서 loggedInUser 가 UserOnRoom 이랑 연결 되있나 확인해서 받음. 그래서 거기서는 확인 안해도 되는데 혹시 다른 데서 Message 를 그냥 받을 수 있으니 일단 거기서도 체크 하는걸로 구현.
// 그냥 getMessages 로 메세지 받는 게 나을 듯. 얘는 지우고, Room 의 Messages resolver 도.

const seeRoomFn:Resolver = async(_,{id},{client,loggedInUser}) => {
  const result = await client.room.findFirst({
    where:{
      id,
      UserOnRoom:{
        some:{
          userId:loggedInUser.id
        }
      }
      // users:{
      //   some:{
      //     id:loggedInUser.id
      //   }
      // }
    },
    // include:{
    //   messages:
    //   {
    //     include:{
    //       user:true,
    //     }
    //   }
    // }
  })
  console.log(JSON.stringify(result))
  return result;
}
// client.user.findUnique({
//   where:{
//     id:loggedInUser.id
//   },
//   select:{
//     rooms:{
//       where:{
//         id
//       },
//       include:{
//         messages:{
//           include:{
//             user:{
//               select:{
//                 userName:true
//               }
//             }
//           },
//           select:{
//             payload:true,
//             createdAt:true
//           }
//         }
//       }
//     }
//   }
// })

const resolver:Resolvers = {
  Query: {
    seeRoom:protectResolver(seeRoomFn)
  }
};
export default resolver;
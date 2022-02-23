import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const seeRoomsFn: Resolver = (_,__,{client,loggedInUser}) => client.room.findMany({
  where:{
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
  // 이게 될라나? Message 받은 게 Room 을 업데이트 할라나?
  orderBy:{
    updatedAt:"desc"
  }
})

// client.user.findUnique({where:{id:loggedInUser.id},select:{rooms:true}})

// client.user.findFirst({
//   where:{
//     id:loggedInUser.id,
//     rooms:{
//       some:{
//         id
//       }
//     }
//   },
//   select:{
//     rooms:{
//       where:{
//         id
//       }
//     }
//   }
// })

const resolver: Resolvers = {
  Query:{
    seeRooms:protectResolver(seeRoomsFn)
  }
}
export default resolver
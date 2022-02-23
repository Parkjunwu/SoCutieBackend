
import pubsub, { NEW_MESSAGE } from "../../pubsub";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

// type argType = {
//   payload:string;
//   userId:number;
//   roomId:number;
// }
// type sendMessageResolver = (root: any, args: argType, context: Context, info: any) => any

const sendMessageFn: Resolver = async(_,{payload,userId,roomId},{client,loggedInUser}) => {
  let room = null;
  if(!userId && !roomId) return {ok:false, error:"There is nothing."}
  if(userId === loggedInUser.id) return {ok:false, error:"Cannot create room"}
  if(userId){
    const user = await client.user.findUnique({
      where:{
        id:userId
      },
      select:{
        id:true,
      }
    })
    // UserOnRoom 는 무조건 유저가 한명이네. Room 에 UserOnRoom 를 두개 가지고 있는 거임.
    // .UserOnRoom({
    //   where:{
    //     user:{
    //       id:loggedInUser.id
    //     }
    //   }
    // })
    // console.log(user)
    if(!user) return {ok:false, error:"There is no user."};
    // 이래 하면 될라나? 앞에 유저 자체가 없으면 null 일 거 같고 뒤에 Room 이 없으면 [] 일 거 같은데..
    const alreadyRoomHave = await client.room.findFirst({
      where:{
        AND:[
          {
            UserOnRoom:{
              some:{
                userId:loggedInUser.id
              }
            }
          },
          {
            UserOnRoom:{
              some:{
                userId:user.id
              }
            }
          }
        ]
      },
      select:{
        id:true,
      },
    })
    console.log(alreadyRoomHave)
    if(alreadyRoomHave){
      room = alreadyRoomHave;
    } else {
      room = await client.room.create({
        data:{
          UserOnRoom:{
            create:[
              {
                userId:loggedInUser.id
              },
              {
                userId:userId
              }
            ]
          }
          // users:{
          //   connect:[
          //     {
          //       id:userId 
          //     },
          //     {
          //       id:loggedInUser.id
          //     }
          //   ]
          // }
        },
        select:{
          id:true,
        },
      });
    }
  } else if (roomId) {
    // room = await client.user.findUnique({
    //   where:{
    //     id:loggedInUser.id
    //   },
    //   select:{
    //     rooms:{
    //       where:{
    //         users:{
    //           some:{
    //             id:loggedInUser.id
    //           }
    //         }
    //       },
    //       select:{
    //         id:true
    //       }
    //     }
    //   }
    // });
    room = await client.room.findFirst({
      where:{
        id:roomId,
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
      select:{
        id:true,
      },
    })
    if(!room) return {ok:false, error:"Room not found"};
  }
  const messagenotbug = await client.message.create({
    data:{
      room:{
        connect:{
          id:room?.id
        }
      },
      user:{
        connect:{
          id:loggedInUser?.id
        }
      },
      payload
    },
    //////// 이유는 모르겠지만 include 안하면 안받아짐.
    include:{
      user:true,
    }
    //////////
  });

  await pubsub.publish(NEW_MESSAGE,{roomUpdate:{...messagenotbug}})
  return {ok:true,id:messagenotbug.id};
  // client.message.create({
  //   data:{
  //     room:{
  //       connectOrCreate:{
  //         where:{id:isRoom},
  //         create:{
  //           users:{
  //             connect:[
  //               {
  //                 id:userId 
  //               },
  //               {
  //                 id:loggedInUser.id
  //               }
  //             ]
  //           }
  //         }
  //       }
  //     },
  //     user:{
  //       connect:{
  //         id:userId
  //       }
  //     },
  //     payload
  //   }
  // })
};

const resolver: Resolvers = {
  Mutation :{
    sendMessage:protectResolver(sendMessageFn)
  }
};

export default resolver;

// import { protectResolver } from "../../user/user.utils";

// export default {
//   Mutation: {
//     sendMessage: protectResolver(
//       async (_, { payload, roomId, userId }, { loggedInUser,client }) => {
//         let room = null;
//         if (userId) {
//           const user = await client.user.findUnique({
//             where: {
//               id: userId,
//             },
//             select: {
//               id: true,
//             },
//           });
//           if (!user) {
//             return {
//               ok: false,
//               error: "This user does not exist.",
//             };
//           }
//           room = await client.room.create({
//             data: {
//               users: {
//                 connect: [
//                   {
//                     id: userId,
//                   },
//                   {
//                     id: loggedInUser,
//                   },
//                 ],
//               },
//             },
//           });
//         } else if (roomId) {
//           room = await client.room.findUnique({
//             where: {
//               id: roomId,
//             },
//             select: {
//               id: true,
//             },
//           });
//           if (!room) {
//             return {
//               ok: false,
//               error: "Room not found.",
//             };
//           }
//         }
//         await client.message.create({
//           data: {
//             payload,
//             room: {
//               connect: {
//                 id: room.id,
//               },
//             },
//             user: {
//               connect: {
//                 id: loggedInUser.id,
//               },
//             },
//           },
//         });
//         return {
//           ok: true,
//         };
//       }
//     ),
//   },
// };
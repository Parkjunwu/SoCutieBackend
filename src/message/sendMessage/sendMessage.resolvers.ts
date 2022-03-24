
import pubsub, { GET_MESSAGE, NEW_MESSAGE } from "../../pubsub";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";


const sendMessageFn: Resolver = async(_,{payload,userId,roomId},{client,loggedInUser}) => {
  // userId 랑 roomId 가 둘다 없거나 둘다 있는 쿼리가 들어올 수 없는데 들어옴. 뭔가 이상한거.
  const queryIsWeird = (!userId && !roomId) || (userId && roomId);
  if(queryIsWeird) {
    console.log("sendMessage // userId 랑 roomId 가 둘 다 있거나 없는 이상한 쿼리를 날림. 해킹 가능성 있음.")
    return {ok:false, error:"There is nothing."}
  }
  // 자기 자신만의 방을 만듦. 얘도 이상한거
  if(userId === loggedInUser.id) {
    console.log("sendMessage // 자기 자신의 방을 만드는 이상한 쿼리를 날림. 해킹 가능성 있음.")
    return {ok:false, error:"Cannot create room"}
  }
  
  let room = null;

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
    if(!user) return {ok:false, error:"There is no user."};
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
        },
        select:{
          id:true,
        },
      });
    }
  } else if (roomId) {
    // room = await client.room.findFirst({
    const getRoom = await client.room.findFirst({
      where:{
        id:roomId,
        UserOnRoom:{
          some:{
            userId:loggedInUser.id
          }
        }
      },
      select:{
        id:true,
        UserOnRoom:{
          select:{
            userId:true
          }
        }
      },
    });
    room = getRoom;
    if(!room) return {ok:false, error:"Room not found"};

    // 수신하는 유저 id 받음
    const receiverUserId = getRoom.UserOnRoom.filter(useObj => useObj.userId !== loggedInUser.id)[0]

    userId = receiverUserId.userId;
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
    // include user 해야함.
    include:{
      user:true,
    },
  });
  await pubsub.publish(NEW_MESSAGE,{roomUpdate:{...messagenotbug}});
  // {userId} 객체로 안보내고 그냥 userId 를 보내니까 헷갈리지 않도록. 헷갈리면 나중에 변경.
  await pubsub.publish(GET_MESSAGE,{justAlertThereIsNewMessage:userId});
  return {ok:true,id:messagenotbug.id};
};

const resolver: Resolvers = {
  Mutation :{
    sendMessage:protectResolver(sendMessageFn)
  }
};

export default resolver;
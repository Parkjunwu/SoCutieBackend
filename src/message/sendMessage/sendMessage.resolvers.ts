
import { sendSinglePushNotification } from "../../fcmAppNotification";
import { channel } from "../../getChannel";
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
  // push 알림을 위한 deviceToken.
  let receiversDeviceToken;
  let receiversUserName;

  if(userId){
    const user = await client.user.findUnique({
      where:{
        id:userId
      },
      select:{
        id:true,
        deviceToken:true,
        userName:true
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

    receiversDeviceToken = user.deviceToken;
    receiversUserName = user.userName;

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
            userId:true,
            user:{
              select:{
                deviceToken:true,
                userName:true,
              }
            }
          }
        }
      },
    });
    room = getRoom;
    if(!room) return {ok:false, error:"Room not found"};

    // 수신하는 유저 id 받음
    const receiverUser = getRoom.UserOnRoom.filter(useObj => useObj.userId !== loggedInUser.id)[0]

    userId = receiverUser.userId;

    receiversDeviceToken = receiverUser.user.deviceToken;
    receiversUserName = receiverUser.user.userName;
  };
  const message = await client.message.create({
    data:{
      room:{
        connect:{
          id:room.id
        }
      },
      user:{
        connect:{
          id:loggedInUser.id
        }
      },
      payload
    },
    // include user 해야함.
    include:{
      user:{
        select:{
          id:true,
          userName:true,
          avatar:true,
        }
      },
    },
  });
  
  // room updatedAt 를 바꿔줘서 rooms 조회시 최신에 뜨게
  await client.room.update({
    where:{
      id:room.id
    },
    data:{
      updatedAt:new Date()
    }
  });

  

  // 디바이스 push, subscription 날림. 오류나도 진행.
  try {
    await pubsub.publish(NEW_MESSAGE,{roomUpdate:{...message}});
    // {userId} 객체로 안보내고 그냥 userId 를 보내니까 헷갈리지 않도록. 헷갈리면 나중에 변경.
    await pubsub.publish(GET_MESSAGE,{justAlertThereIsNewMessage:userId});

    // 디바이스 push 알림 전송
    const messageChannel = channel.message;
    const sendMessage = `${loggedInUser.userName} : ${payload}`
    const obj = {
      id:String(room.id),
      opponentUserName:receiversUserName,
    };
    sendSinglePushNotification(receiversDeviceToken,sendMessage,messageChannel,obj);

  } catch (e) {
    console.log("sendMessage pubsub 에러 : "+e);
  }

  // roomId 를 인자로 받았을 때 (Room 에서 쿼리 날림) / userId 를 인자로 받았을 때 (Room 없는 상태에서 메세지 보냈을 때)
  // 헷갈리면 아예 로직 전체를 roomId 들어왔을 때 / userId 들어왔을 때 로 나눠서 작성
  if(roomId) {
    return { ok:true, id:message.id };
  } else {
    return { ok:true, roomId:room.id, talkingTo:message.user };
  }
};

const resolver: Resolvers = {
  Mutation :{
    sendMessage:protectResolver(sendMessageFn)
  }
};

export default resolver;
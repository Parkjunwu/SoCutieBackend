import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../user.utils";

const registerPushNotiTokenFn: Resolver = async (
  _,
  { deviceToken },
  { loggedInUser, client }
) => {
  // 기존에 내 토큰과 같으면 그냥 보냄.
  console.log(deviceToken);

  if(loggedInUser.deviceToken === deviceToken) {
    return { ok: true };
  }

  // 토큰 있는지 확인. 내꺼 제외.
  const isAlreadyToken = await client.user.findUnique({
    where:{
      deviceToken,
    },
    select:{
      id:true,
    },
  });

  if(isAlreadyToken?.id && isAlreadyToken.id !== loggedInUser.id) {
    console.error("registerPushNotiToken : 한 기기 토큰에 여러 유저가 등록. 해킹 가능성 있음.");
    return {
      ok: false,
      error: "한 기기에서 여러 유저의 알림을 받을 수 없습니다."
    };
  }

  // 토큰 등록.
  const registerToken = await client.user.update({
    where:{
      id:loggedInUser.id
    },
    data:{
      deviceToken
    },
    select:{
      id:true
    },
  });

  return { ok: true };
};

const resolver: Resolvers = {
  Mutation: {
    registerPushNotiToken: protectResolver(registerPushNotiTokenFn),
  },
};
export default resolver;

import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";
import { userCheckResolver } from "../user.utils";

const logicSeeFollowing: Resolver = async(_,{id,cursorId},{client}) => {
  const ok = await client.user.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!ok) {
    return { error: "존재하지 않는 유저입니다." };
  }
  const take = 20;
  const following = await client.user.findUnique({
      where:{
        id
      }
    })
    .following({
      take,
      ...(cursorId && { skip: 1 }),
      ...(cursorId && { cursor: { id: cursorId } }),
    });

  const followingCount = following.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = followingCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = following[followingCount-1].id;
    return {
      cursorId,
      hasNextPage:true,
      following,
    };
  } else {
    return {
      hasNextPage:false,
      following,
    };
  }
};

const seeFollowingFn: Resolver = async (_,{id,cursorId},{client}) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSeeFollowing(_,{id,cursorId},{client},null),
    "seeFollowing"
  );
};

const resolver: Resolvers = {
  SeeFollowingResponse:{
    // 프론트엔드에서 subscription mutation 데이터 받기 위함... 데이터 형식을 프론트엔드에서 못바꿔서..
    isNotFetchMore:() => false,
  },
  Query: {
    // seeFollowing: userCheckResolver(seeFollowingFn, "No User!"),
    seeFollowing: seeFollowingFn,
  },
};
export default resolver;

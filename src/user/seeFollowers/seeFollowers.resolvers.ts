import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";
import { userCheckResolver } from "../user.utils";

const logicSeeFollowers: Resolver = async(_,{id,cursorId},{client}) => {
  const ok = await client.user.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!ok) {
    return { error: "존재하지 않는 유저입니다." };
  }
  const take = 20;
  const followers = await client.user.findUnique({
      where:{
        id
      }
    })
    .followers({
      take,
      ...(cursorId && { skip: 1 }),
      ...(cursorId && { cursor: { id: cursorId } }),
    });

  const followersCount = followers.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = followersCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = followers[followersCount-1].id;
    return {
      cursorId,
      hasNextPage:true,
      followers,
    };
  } else {
    return {
      hasNextPage:false,
      followers,
    };
  }
}

const seeFollowersFn: Resolver = async (_,{id,cursorId},{client}) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSeeFollowers(_,{id,cursorId},{client},null),
    "seeFollowers"
  );
};

const resolver: Resolvers = {
  SeeFollowersResponse:{
    // 프론트엔드에서 subscription mutation 데이터 받기 위함... 데이터 형식을 프론트엔드에서 못바꿔서..
    isNotFetchMore:() => false,
  },
  Query: {
    // seeFollowers:userCheckResolver(seeFollowersFn, "No User!")
    seeFollowers:seeFollowersFn
  },
};
export default resolver;

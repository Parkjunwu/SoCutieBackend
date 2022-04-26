import paginationErrorCheckNeedLogicAndQueryName from "../../paginationErrorCheckNeedLogicAndQueryName";
import { Resolver, Resolvers } from "../../types";

const logicSearchUsers: Resolver = async (_, { keyword, cursorId }, { client }) => {
  // 한번에 가져올 갯수 take 로 변경
  const take = 10;
  const users = await client.user.findMany({
    where: {
      userName: {
        startsWith: keyword.toLowerCase(),
      },
    },
    select:{
      id:true,
      userName:true,
      avatar:true,
    },
    take,
    ...(cursorId && { skip: 1 }),
    ...(cursorId && { cursor: { id: cursorId } }),
  });


  const usersCount = users.length;

  // 메세지 받은 개수가 한번에 가져올 갯수랑 달라. 그럼 마지막이라는 뜻. 다만 딱 한번에 가져올 갯수랑 맞아 떨어지면 다음에 가져올 게 없지만 그래도 있는 걸로 나옴.
  const isHaveHaveNextPage = usersCount === take;

  if( isHaveHaveNextPage ){
    const cursorId = users[usersCount-1].id;
    return {
      cursorId,
      hasNextPage:true,
      users,
    };
  } else {
    return {
      hasNextPage:false,
      users,
    };
  }
};

const searchUsersFn: Resolver = async(_,{keyword,cursorId},{client}) => {
  return paginationErrorCheckNeedLogicAndQueryName(
    await logicSearchUsers(_,{keyword,cursorId},{client},null),
    "searchPosts"
  );
};

const resolver: Resolvers = {
  Query: {
    searchUsers: searchUsersFn,
  },
};
export default resolver;

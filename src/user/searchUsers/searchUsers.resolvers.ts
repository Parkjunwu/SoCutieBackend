import { Resolver, Resolvers } from "../../types";

const searchUsersFn: Resolver = async (_, { keyword, lastId }, { client }) => {
  // 한번에 가져올 갯수 take 로 변경
  const take = 3;
  const users = await client.user.findMany({
    where: {
      userName: {
        startsWith: keyword.toLowerCase(),
      },
    },
    take,
    ...(lastId && { skip: 1 }),
    ...(lastId && { cursor: { id: lastId } }),
  });
  return { users, lastId: users[users.length-1].id };
};
const resolver: Resolvers = {
  Query: {
    searchUsers: searchUsersFn,
  },
};
export default resolver;

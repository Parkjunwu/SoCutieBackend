import { Resolver, Resolvers } from "../../types";
import { userCheckResolver } from "../user.utils";

const seeFollowingFn: Resolver = async (
  _,
  { id, lastId },
  { client }
) => {
  const following = await client.user
    .findUnique({ where: { id } })
    .following({
      // 한번에 가져올 갯수 take 로 변경
      take: 5,
      ...(lastId && { skip: 1 }),
      ...(lastId && { cursor: { id: lastId } }),
    });
  console.log(following);
  console.log(following[following.length-1].id)
  return { ok: true, following, lastId:following[following.length-1].id };
};

const resolver: Resolvers = {
  Query: {
    seeFollowing: userCheckResolver(seeFollowingFn, "No User!"),
  },
};
export default resolver;

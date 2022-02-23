import { Resolver, Resolvers } from "../../types";
import { userCheckResolver } from "../user.utils";

const seeFollowersFn: Resolver = async (_, { id, lastId }, { client }) => {
  const ok = await client.user.findUnique({
    where: { id },
    select: { id: true },
  });
  console.log(ok);
  if (!ok) {
    return { ok: "false", error: "There are no user" };
  }
  const followers = await client.user
    .findUnique({ where: { id } })
    .followers({
      // 한번에 가져올 갯수 take 로 변경
      take: 5,
      ...(lastId && { skip: 1 }),
      ...(lastId && { cursor: { id: lastId } }),
    });
  return { ok: true, followers, lastId:followers[followers.length-1].id };
};
const resolver: Resolvers = {
  Query: {
    seeFollowers:userCheckResolver(seeFollowersFn, "No User!")
  },
};
export default resolver;

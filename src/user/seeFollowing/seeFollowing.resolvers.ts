import { Resolver, Resolvers } from "../../types";
import { userCheckResolver } from "../user.utils";

const seeFollowingFn: Resolver = async (_, { id, cursorId }, { client }) => {
  const ok = await client.user.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!ok) {
    return { ok: "false", error: "There are no user" };
  }
  const take = 30;
  const following = await client.user
    .findUnique({ where: { id } })
    .following({
      take,
      ...(cursorId && { skip: 1 }),
      ...(cursorId && { cursor: { id: cursorId } }),
    });
  return { ok: true, following, cursorId:following[following.length-1].id };
};

const resolver: Resolvers = {
  Query: {
    seeFollowing: userCheckResolver(seeFollowingFn, "No User!"),
  },
};
export default resolver;

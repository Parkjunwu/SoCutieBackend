import { Resolver, Resolvers } from "../../types";
import { userCheckResolver } from "../user.utils";

const seeFollowersFn: Resolver = async (_, { id, cursorId }, { client }) => {
  const ok = await client.user.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!ok) {
    return { ok: "false", error: "There are no user" };
  }
  const take = 30;
  const followers = await client.user
    .findUnique({ where: { id } })
    .followers({
      take,
      ...(cursorId && { skip: 1 }),
      ...(cursorId && { cursor: { id: cursorId } }),
    });
  return { ok: true, followers, cursorId:followers[followers.length-1].id };
};
const resolver: Resolvers = {
  Query: {
    seeFollowers:userCheckResolver(seeFollowersFn, "No User!")
  },
};
export default resolver;

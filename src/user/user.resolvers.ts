import { Resolvers } from "../types";

const resolver: Resolvers = {
  User: {
    totalFollowing: async ({ id }, _, { client }) =>
      client.user.count({
        where: {
          followers: {
            some: { id },
          },
        },
      }),
    totalFollowers: ({ id }, _, { client }) =>
      client.user.count({
        where: {
          following: {
            some: { id },
          },
        },
      }),
    isMe: ({ id }, _, { loggedInUser }) => id === loggedInUser?.id,
    //애매해
    isFollowing: async ({ id }, _, { client, loggedInUser }) => {
      if (!loggedInUser) return false;
      const exist = await client.user.count({
        where: {
          id: loggedInUser.id,
          following: {
            some: {
              id,
            },
          },
        },
      });
      return Boolean(exist);
    },
    posts: async({id},{cursorId},{client}) => {
      const result = await client.post.findMany({
        where:{
          userId:id
        },
        take:10,
        ...(cursorId && { skip:1 , cursor:cursorId})
      });
      console.log(result);
      return { post:result, cursorId:result[result.length-1].id }
    },

    // room 도 만들어야 할듯??
  },
};
export default resolver;

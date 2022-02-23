import { Resolvers } from "../../types";

// 일단 post pagination 으로 가져오는건 user 에 resolver 로 구현해놨음.
// 아니면 post 만 select 로 가져오는거 따로 만들어서 써도 되고.
const resolvers: Resolvers = {
  Query: {
    seeProfile: (_, { id }, { client }) =>
      client.user.findUnique({
        where: { id },
        // include: {
        //   following: true,
        //   followers: true,
        // },
      })
  },
};

export default resolvers;

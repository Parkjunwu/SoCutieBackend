import { Resolver, Resolvers } from "../../types";

const seeHashTagFn: Resolver = async(_,{name,cursorId},{client}) => {
  // const take = 20;
  // cursorId 는 프론트에서 써야 할듯.
  const result = await client.hashTag.findUnique({
    where:{
      name
    },
  });
  // 얜 totalPosts 를 못받음. post 를 받는거라
  // const result = await client.post.findMany({
  //   where:{
  //     PostOnHashTag:{
  //       some:{
  //         hashtag:{
  //           name,
  //         },
  //       },
  //     },
  //   },
  //   take,
  //   ...(cursorId && {cursor:cursorId, skip:1})
  // });
  console.log(result);
  return result;
};

const resolver: Resolvers = {
  Query:{
    seeHashTag:seeHashTagFn
  }
}
export default resolver
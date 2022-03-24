import { Resolver, Resolvers } from "../../types";

const searchPostsFn: Resolver = async(_,{keyword,cursorId},{client}) => {
  const take = 10;
  return client.post.findMany({
    where:{
      caption:{
        contains:keyword
      }
    },
    take,
    ...(cursorId && {cursor:cursorId, skip:1})
  });
};

const resolver: Resolvers = {
  Query:{
    searchPosts:searchPostsFn
  }
};

export default resolver
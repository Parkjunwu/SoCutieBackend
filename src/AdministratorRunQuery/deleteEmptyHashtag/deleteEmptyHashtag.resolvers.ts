import { Resolver, Resolvers } from "../../types";


// 해시태그에 postOnHashTag 없는 애들을 지워
const deleteEmptyHashtagFn: Resolver = async(_,__,{client}) => {
  await client.hashTag.deleteMany({
    where:{
      PostOnHashTag:{
        //none 뒤에 아무것도 안오면 = {} relation 없는 모든 데이터.
        none:{}
      }
    }
  });
  return {ok: true}
}
const resolver: Resolvers = {
  Mutation: {
    deleteEmptyHashtag:deleteEmptyHashtagFn
  }
};

export default resolver;
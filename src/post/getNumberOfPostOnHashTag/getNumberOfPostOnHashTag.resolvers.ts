import { Resolver, Resolvers } from "../../types";
// import { protectResolver } from "../../user/user.utils";

const getNumberOfPostOnHashTagFn:Resolver = async(_,{name},{client}) => client.postOnHashTag.count({
  where:{
    hashtag:{
      name
    }
  }
});

const resolver:Resolvers = {
  Query:{
    getNumberOfPostOnHashTag:getNumberOfPostOnHashTagFn
  }
};
export default resolver
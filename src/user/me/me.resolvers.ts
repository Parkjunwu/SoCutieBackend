import { Resolvers } from "../../types";

const resolver:Resolvers = {
  Query :{
    me:(_, __, {loggedInUser}) => {
      if (!loggedInUser) {
        return null
      }
      return loggedInUser
    }
  }
};

export default resolver;
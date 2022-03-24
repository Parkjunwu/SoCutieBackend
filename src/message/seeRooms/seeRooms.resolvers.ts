import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const seeRoomsFn: Resolver = async(_,{cursorId},{client,loggedInUser}) => {
  const take = 25;
  return client.room.findMany({
    where:{
      UserOnRoom:{
        some:{
          userId:loggedInUser.id
        }
      }
    },
    take,
    ...(cursorId && {cursor: cursorId, skip:1})
  });
};

const resolver: Resolvers = {
  Query:{
    seeRooms:protectResolver(seeRoomsFn)
  }
};

export default resolver;
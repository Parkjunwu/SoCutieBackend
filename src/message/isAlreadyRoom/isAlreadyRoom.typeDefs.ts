import { gql } from "apollo-server-express";

export default gql`
  enum isAlreadyRoomState{
    WRONG_ACCESS
    NO_USER
    NOT_HAVE
    HAVE
  }
  type isAlreadyRoomResponse {
    state: isAlreadyRoomState!
    room: Room
  }
  type Query {
    isAlreadyRoom(userId: Int!): isAlreadyRoomResponse!
  }
`;
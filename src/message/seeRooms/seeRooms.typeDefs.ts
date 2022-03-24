import { gql } from "apollo-server-express";

export default gql`
  # type Query {
  #   seeRoom(id:Int!):Room
  # }
  type Query {
    seeRooms(cursorId:Int):[Room]
  }
`
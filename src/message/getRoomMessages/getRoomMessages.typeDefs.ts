import { gql } from "apollo-server-express";

export default gql`
  type Query {
    getRoomMessages(roomId:Int,cursorId:Int):[Message]
  }
`;
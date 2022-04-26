import { gql } from "apollo-server-express";

export default gql`
  # seeCommentLikes 랑 반환타입 똑같음. 거기 SeeLikesResponse 있음.
  type Query {
    seePostLikes(
      id:Int!,
      cursorId: Int
    ):SeeLikesResponse!
  }
`
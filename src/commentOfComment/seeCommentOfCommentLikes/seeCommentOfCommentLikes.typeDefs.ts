import { gql } from "apollo-server-express";

export default gql`
  # 반환타입 seeCommentLikes 랑 똑같음. 거기에 SeeLikesResponse 있음.
  type Query {
    seeCommentOfCommentLikes(commentOfCommentId:Int!,cursorId:Int):SeeLikesResponse
  }
`;
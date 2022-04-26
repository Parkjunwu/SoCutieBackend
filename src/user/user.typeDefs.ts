import { gql } from "apollo-server";

export default gql`
  type PostAndCursor {
    post:[Post]
    cursorId:Int
  }
  type User {
    id: Int!
    firstName: String!
    lastName: String
    userName: String!
    email: String!
    gender: Boolean
    age: String
    birth: String
    bio: String
    avatar: String
    followers: [User]
    following: [User]
    totalFollowing: Int!
    totalFollowers: Int!
    isFollowing: Boolean!
    isMe: Boolean!
    # posts 는 따로 받음. getUserPosts 로
    # posts(
    #   cursorId:Int
    # ):PostAndCursor
    rooms:[Room]
    deviceToken:String

    blockUsers:[Int]
    createdAt: String!
    updatedAt: String!
    # totalNotification: Int!
  }
`;

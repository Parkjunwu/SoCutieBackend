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
    # posts 는 pagination 으로 구현해야 할듯. 근데 그냥 posts 를 받아서
    posts(
      cursorId:Int
    ):PostAndCursor
    # posts:[Post]
    rooms:[Room]

    blockUsers:[Int]
    createdAt: String!
    updatedAt: String!
    # totalNotification: Int!
  }
`;

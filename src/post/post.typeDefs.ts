import { gql } from "apollo-server-express";

export default gql`
  type Post {
    id:Int!
    user:User!
    likes:Int!
    caption:String
    file:[String]
    # HashTag 는 관계로 나오니까 조심
    # 근데 HashTag 를 받을 필요가 있나? 걍 화면에서 누르면 그 이름으로 찾으면 되는데
    hashTags:[HashTag]
    # pagination 구현해야함
    comments:[Comment]
    createdAt: String!
    updatedAt: String!
    commentNumber:Int!
    isMine:Boolean!
    isLiked:Boolean!
  }
  type hashTagPostsResult {
    posts:[Post]
    page:Int
    cursorId:Int
  }
  type HashTag {
    id:Int!
    # posts:[Post]
    # Post 는 관계로 나오니까 조심
    posts(
      page:Int
      cursorId:Int
    ):hashTagPostsResult
    name:String!
    createdAt: String!
    updatedAt: String!
    totalPosts:Int
  }
  type PostLike {
    id:Int!
    post:Post!
    user:User!
    createdAt: String!
    updatedAt: String!
  }
`
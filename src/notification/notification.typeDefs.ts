import { gql } from "apollo-server-express";

export default gql`
  type Notification {
    id:Int!
    publishUser:User!
    publishUserId:Int!
    subscribeUserId:Int
    # 만약에 알림에 포스팅 사진, 내용 같이 보여줄거면 이미지, 내용 요소도 추가
    which:WhichNotification!
    read:Boolean!
    createdAt:String!
    # 클릭 시 해당 컴포넌트 보여주기 위함
    postId:Int
    commentId:Int
    commentOfCommentId:Int
    userId:Int
  }
  enum WhichNotification {
    FOLLOWING_WRITE_POST
    MY_POST_GET_LIKE
    MY_POST_GET_COMMENT
    MY_COMMENT_GET_LIKE
    MY_COMMENT_GET_COMMENT
    MY_COMMENT_OF_COMMENT_GET_LIKE
    FOLLOW_ME
  }
`;
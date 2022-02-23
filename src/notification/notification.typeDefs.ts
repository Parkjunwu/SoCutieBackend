import { gql } from "apollo-server-express";

export default gql`
  # type UserNotificationList {
  #   id:Int!
  #   user:User!
  #   notification:[Notification]
  # }
  type Notification {
    id:Int!
    # list:UserNotificationList!
    publishUser:User!
    publishUserId:Int!
    subscribeUserId:Int
    # 만약에 알림에 포스팅 사진, 내용 같이 보여줄거면 이미지, 내용 요소도 추가
    which:WhichNotification!
    read:Boolean!
    createdAt:String!
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
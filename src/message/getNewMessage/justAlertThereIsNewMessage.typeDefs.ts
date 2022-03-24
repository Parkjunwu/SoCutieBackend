import { gql } from "apollo-server-express";

// 그냥 왔다는 알림만 보냄. 만약 핸드폰 알림 쓰면 안쓸수도?

export default gql`
  type Subscription{
    justAlertThereIsNewMessage: Int
  }
`
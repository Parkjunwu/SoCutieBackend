import { gql } from "apollo-server-express";

// 만약 핸드폰 알림이 이걸로 되면 justAlertThereIsNewMessage 지우고 여기서 구현.
// justAlertThereIsNewMessage 는 그냥 새 메세지가 있다는 거임.
// 알림과 함께 내용을 보낼라면 이거 써야함

export default gql`
  type Subscription{
    roomUpdate(id:Int):Message
  }
`
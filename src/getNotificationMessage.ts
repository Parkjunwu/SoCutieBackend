
const getNotificationMessage = (which) => {
  switch (which) {
    case 'FOLLOWING_WRITE_POST':
      return "새로운 게시물을 작성하였습니다."
    case 'FOLLOW_ME':
      return "회원님을 팔로우 하였습니다."
    case 'MY_COMMENT_GET_COMMENT':
      return "회원님의 댓글에 댓글을 남겼습니다."
    case 'MY_COMMENT_GET_LIKE':
      return "회원님의 댓글을 좋아합니다."
    case 'MY_COMMENT_OF_COMMENT_GET_LIKE':
      return "회원님의 댓글을 좋아합니다."
    case 'MY_POST_GET_COMMENT':
      return "회원님의 게시물에 댓글을 남겼습니다."
    case 'MY_POST_GET_LIKE':
      return "회원님의 게시물을 좋아합니다."
    default:
      alert( '알 수 없는 값을 입력하셨습니다.' );
  }
};

export default getNotificationMessage;
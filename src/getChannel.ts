
export const channel = {
  upload:"upload",
  message:"message",
  follow:"follow",
  postLike:"postLike",
  postComment:"postComment",
  commentLike:"commentLike",
  commentComment:"commentComment",
  commentCommentLike:"commentCommentLike",
};

export const getChannel = (which) => {
  switch (which) {
    // case 'FOLLOWING_WRITE_POST':
    //   return channel.upload
    case 'FOLLOW_ME':
      return channel.follow;
    case 'MY_COMMENT_GET_COMMENT':
      return channel.commentComment;
    case 'MY_COMMENT_GET_LIKE':
      return channel.commentLike;
    case 'MY_COMMENT_OF_COMMENT_GET_LIKE':
      return channel.commentCommentLike;
    case 'MY_POST_GET_COMMENT':
      return channel.postComment;
    case 'MY_POST_GET_LIKE':
      return channel.postLike;
    default:
      return "Unknown Channel";
  }
};

import { gql } from "apollo-server-express";

export default gql`
  # Upload 는 JSON 으로 하니까 안뜸.
  # input addPhotoObj {
  #   index: Int
  #   photo: Upload
  # }
  type Mutation {
    editPost(
      id:Int!
      caption:String
      # addPhotoArr:[addPhotoObj],
      # 그래서 그냥 파일과 인덱스를 따로 받음. 안헷갈리게 주의. 순서가 같아야 하는거 중요.
      addPhotoArr:[Upload],
      addPhotoIndexArr:[Int],
      deletePhotoArr:[String],
      # wholePhotoArr 는 addPhotoIndex 자리를 "" 로 해줘야함. 꼭 확인
      wholePhotoArr:[String],
    ):MutationResponse!
  }
`
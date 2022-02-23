import * as AWS from "aws-sdk"

AWS.config.update({
  credentials:{
    accessKeyId:process.env.AWS_KEY,
    secretAccessKey:process.env.AWS_SECRET
  },
  region: "ap-northeast-2",
})


const s3 = new AWS.S3();
const Bucket = "nomad-coffee-good";

// folderName S3 에 저장할 폴더명임.
export const async_uploadPhotoS3 = async(file, userId, folderName) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
  const {Location} = await new AWS.S3().upload({
  // const {Location} = await s3.upload({
    Bucket,
    Key:objectName,
    ACL:"public-read",
    Body:readStream,
  }).promise();
  
  return Location;
}



/// fileUrl string, 파일 이름 꺼내기
export const async_deletePhotoS3 = async (fileUrl:string, folderName:string) => {
  const decodedUrl = decodeURI(fileUrl);  //한글일 경우 이래 해야 된다함
  // const filePath = decodedUrl.split("com/")[1]; // 파일명만 split 후 선택. 폴더명이 지금은 uploads 로 고정인데 혹시 바뀌면 여기 변경해야함.
  const filePath = decodedUrl.split("/uploads/")[1]; // 파일명만 split 후 선택
  const params = {
    // Bucket에 폴더 명 uploads 추가, 혹시 폴더명 고정이면 이 함수를 변경. 혹은 그냥 폴더 안만들고 저장해도 됨. 그치만 저장하는게 낫겠지
    Bucket: `${Bucket}/${folderName}`, // Bucket에 폴더 명 uploads 추가
    Key: filePath, 
  };
  await s3
    .deleteObject(params, (error, data) => {
      if (error) {
        console.log(error);
        console.log("삭제 에러");
        throw new Error();
      } else {
      console.log(data);
      console.log("삭제 완료");
      }
  })
  .promise();
};
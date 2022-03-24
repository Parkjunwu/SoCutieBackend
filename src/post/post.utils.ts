export const processHashtags = (caption:string) => {
  const hashTagArray = [];
  // “” ‘’ 이게 " ' 랑 다르네. 둘 다 넣어줌.
  caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9|\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@₩\$%&\\\=\(\'\"“”‘’|\w]+/g)?.forEach(hash => {
    console.log(hash);
    if(hash === "#") return;
    // # 자름
    const deleteHashOnHashTag = hash.substring(1);
    // 혹시 caption 안에 같은 태그가 있으면 하나만 들어가도록
    if(hashTagArray.includes(deleteHashOnHashTag)) return ;
    hashTagArray.push(deleteHashOnHashTag);
  });
  const createHashTagForm = hashTagArray.map(hash => (
    {
      hashtag:{
        connectOrCreate:{
          where:{
            name:hash
          },
          create:{
            name:hash
          }
        }
      }
    })
  );
  return createHashTagForm;
}

export const S3_FOLDER_NAME = "uploads";
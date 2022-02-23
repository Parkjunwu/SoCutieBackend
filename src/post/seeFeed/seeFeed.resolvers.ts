import { Resolver, Resolvers } from "../../types";
// import { protectResolver } from "../../user/user.utils";

const seeFeedFn:Resolver = async(_,{offset},{client,loggedInUser}) => {
  // 한번에 가져올 포스트 갯수
  const take = 5;
  // 로그인한 유저일 경우
  if(loggedInUser) {
    return await client.post.findMany({
      where:{
        OR:[
          {
            user:{
              followers:{
                some:{
                  id:loggedInUser.id
                }
              }
            }
          },
          {
            userId:loggedInUser.id
          }
        ]
      },
      orderBy:{
        createdAt:"desc"
      },
      take,
      skip:offset,
      // take * (offset-1)
    })
  } else {
    // 로그인 안한 유저일 경우
    return await client.post.findMany({
      orderBy:{
        createdAt:"desc"
      },
      take,
      skip:offset,
      // take * (offset-1)
    })
  }
}
// const seeFeedFn:Resolver = (_,{offset},{client,loggedInUser}) => client.post.findMany({
//   where:{
//     OR:[
//       {
//         user:{
//           followers:{
//             some:{
//               id:loggedInUser.id
//             }
//           }
//         }
//       },
//       {
//         userId:loggedInUser.id
//       }
//     ]
//   },
//   orderBy:{
//     createdAt:"desc"
//   },
//   take:5,
//   skip:offset,
//   // 2*(offset-1)
// })


const resolver:Resolvers = {
  Query:{
    // seeFeed:protectResolver(seeFeedFn)
    seeFeed:seeFeedFn
  }
}
export default resolver
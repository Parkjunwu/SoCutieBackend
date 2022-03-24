const bcrypt = require("bcrypt");
import { protectResolver } from "../user.utils";
import { Resolver, Resolvers } from "../../types";
import { async_uploadPhotoS3 } from "../../shared/AWS";

const resolverFn: Resolver = async (
  _,
  { firstName, lastName, userName, email, password, bio, avatar },
  { loggedInUser, client }
) => {
  if(!firstName && !lastName && !userName && !email && !password && !bio && !avatar) {
    return { ok: true };
  }
  let avatarUrl = null;
  if (avatar) {
    avatarUrl = await async_uploadPhotoS3(avatar, loggedInUser.id, "avatar")
  }
  let uglyPassword = null;
  if (password) {
    uglyPassword = await bcrypt.hash(password, 10);
  }
  const updatedUser = await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      ...(firstName && {firstName}),
      ...(lastName && {lastName}),
      ...(userName && {userName}),
      ...(email && {email}),
      ...(bio && {bio}),
      ...(uglyPassword && { password: uglyPassword }),
      ...(avatarUrl && { avatar: avatarUrl }),
    },
    select:{
      id:true,
    },
  });

  if (updatedUser.id) {
    return { ok: true };
  } else {
    return { ok: false, error: "프로필 변경이 실패하였습니다. 지속적으로 같은 문제 발생 시 문의 주시면 감사드리겠습니다." };
  }
};

const resolver: Resolvers = {
  Mutation: {
    editProfile: protectResolver(resolverFn),
  },
};
export default resolver;

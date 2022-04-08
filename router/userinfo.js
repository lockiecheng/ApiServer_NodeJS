const express = require("express");
const router = express.Router();

const routerHandle = require("../router_handle/userinfo");
const expressJoi = require("@escook/express-joi");
const { update_userinfo_schema } = require("../schema/user");
const { update_password_schema } = require("../schema/user");
const { update_avatar_schema } = require("../schema/user");

router.get("/userinfo", routerHandle.getUserInfo);

router.post(
  "/userinfo",
  expressJoi(update_userinfo_schema),
  routerHandle.updateUserInfo
);

router.post(
  "/updatepwd",
  expressJoi(update_password_schema),
  routerHandle.updateUserPwd
);

router.post(
  "/update/avatar",
  expressJoi(update_avatar_schema),
  routerHandle.updateAvatar
);

module.exports = router;

const express = require("express");
const router = express.Router();

// 导入用户路由处理函数模块
const userHandler = require("../router_handle/user");

// 导入验证表单数据的中间件
const expressJoi = require("@escook/express-joi");

const { reg_login_schema } = require("../schema/user");

// 注册新用户
// 只负责定义路由模块的映射关系
router.post("/reguser", expressJoi(reg_login_schema), userHandler.regUser);
// 登录
router.post("/login", expressJoi(reg_login_schema) , userHandler.login);

module.exports = router;

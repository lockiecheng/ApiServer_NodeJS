const express = require("express");
const app = express();

const cors = require("cors");
// 错误中间件
const joi = require("@hapi/joi");

// token中间件
const config = require("./config");
const expressJWT = require("express-jwt");

app.use(cors());
app.use(express.urlencoded({ extended: false })); // 只能解析x-www类型的表单数据

// 在路由之前封装res.cc函数(作用是简化代码)
app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    return res.send({
      status: status,
      msg: err instanceof Error ? err.message : err,
    });
  };
  next();
});

// 配置解析token的中间件
// 除了api开头的不需要身份认证外，其余的都需要身份认证
app.use(
  expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] })
);

// 导入并使用router
const userRouter = require("./router/user");
const userInfoRouter = require("./router/userinfo");
const articleRouter = require("./router/article");
const articlePublishRouter = require("./router/articlePublish");
// 挂载
app.use("/api", userRouter);
app.use("/my", userInfoRouter);
app.use("/my/article", articleRouter);
app.use("/my/article", articlePublishRouter);
// 定义错误中间件
app.use(function (err, req, res, next) {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err);

  // 捕获身份认证失败错误
  if (err.name == "UnauthorizedError") return res.cc("身份认证失败");
  // 未知错误
  return res.cc(err); // 响应未知错误
});

app.listen(8000, () => {
  console.log("listen at 8000");
});

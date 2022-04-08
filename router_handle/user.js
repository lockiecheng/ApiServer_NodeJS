/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */

// 注册用户的处理函数
const db = require("../db/index"); // 导入db模块
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

exports.regUser = (req, res) => {
  const userinfo = req.body;
  //   合法性判断
  if (!userinfo.username || !userinfo.password)
    return res.send({
      status: 1,
      msg: "用户名或密码不能为空",
    });
  // 检测用户名是否被占用
  const sqlStr = "select * from ev_users where username = ?";
  db.query(sqlStr, [userinfo.username], (err, results) => {
    if (err) return res.cc(err);
    if (results.length >= 1) return res.cc("用户名被占用");
    // 用户名可用，将其插入到db中
    // 先要将密码进行加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10); // 10 代表长度
    const registryStr = "insert into ev_users set ?";
    db.query(
      registryStr,
      { username: userinfo.username, password: userinfo.password },
      (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc("注册用户失败");
        res.cc("注册用户成功", 0);
      }
    );
  });
};

// 登录的处理函数
exports.login = (req, res) => {
  // 接收表单数据，然后在mysql里查找是否存在当前用户名，如果用户名不存在则返回用户名不存在
  // 否则判断密码是否正确，如果不正确则返回密码错误；上述都正确后使用JWT进行保存用户名和密码，返回给客户端一个token
  // 用户下次登录的时候带该token，如果token有效则免密码登录，否则还需要进行输入密码，再登录
  const userinfo = req.body;
  const sqlStr = "select * from ev_users where username = ?";
  //   查询用户是否存在
  db.query(sqlStr, [userinfo.username], (err, results) => {
    if (err) return res.cc(err);
    if (results.length == 0) {
      return res.cc("用户不存在");
    } else if (!bcrypt.compareSync(userinfo.password, results[0].password)) {
      return res.cc("登录密码错误");
    }
    // 登录成功，生成一个JWT token字符串
    // 注意，我们只保存不敏感的信息，而一些敏感信息比如密码和头像这种，要剔除
    const user = { ...results[0], password: "", user_pic: "" };
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: "10h", // token有效期为10个小时
    });
    return res.send({
      status: 0,
      msg: "登录成功",
      token: "Bearer " + tokenStr,
    });
  });
};

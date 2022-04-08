/**
 * 在这里定义和用户相关的路由处理函数，供 /router/userinfo.js 模块进行调用
 */

const db = require("../db/index");
const bcrypt = require("bcryptjs");

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  // 返回用户的基本信息
  const sqlStr =
    "select id, username, nickname, email, user_pic from ev_users where id = ?";
  // 用户的ID在req.user里，之前有token之后挂载上去
  db.query(sqlStr, [req.user.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc("获取用户信息失败！");
    res.send({
      status: 0,
      msg: "获取用户基本信息成功",
      data: results[0], // 返回一个结果对象给客户端
    });
  });
};

exports.updateUserInfo = (req, res) => {
  // 更新用户的基本信息
  const userinfo = req.body; // 请求体
  const sqlStr = "update ev_users set ? where id = ?";
  db.query(sqlStr, [userinfo, userinfo.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("更新失败");
    return res.send({
      status: 0,
      msg: "修改用户信息成功",
    });
  });
};

exports.updateUserPwd = (req, res) => {
  // 更新密码
  // 通过id查找密码，
  const sqlStr = "select * from ev_users where id = ?";
  db.query(sqlStr, req.user.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length === 0) return res.cc("没有该用户的信息!");
    // 找到该用户信息后，取出当前的密码与new作比较，如果不同则同意修改
    if (!bcrypt.compareSync(req.body.oldPwd, results[0].password))
      // 不相等,hash放在第二个参数
      return res.cc("旧密码错误，禁止修改!");
    // 修改
    const sqlPwdStr = "update ev_users set password = ? where id = ?";
    // 将新密码加密
    req.body.newPwd = bcrypt.hashSync(req.body.newPwd, 10);
    db.query(sqlPwdStr, [req.body.newPwd, req.user.id], (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("更新失败");
      return res.cc("更新密码成功!", 0);
    });
  });
};

exports.updateAvatar = (req, res) => {
  // 更换头像
  const avatar = req.body.avatar;
  const sqlStr = "update ev_users set user_pic = ? where id = ?";
  db.query(sqlStr, [avatar, req.user.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.lenght === 0) return res.cc("更换头像失败");
    return res.cc("更换头像成功!", 0);
  });
};

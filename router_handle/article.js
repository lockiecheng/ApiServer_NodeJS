// 文章部分的处理函数

const db = require("../db/index"); // 导入db模块

exports.getArticle = (req, res) => {
  // 获取文章
  const sqlStr =
    "select * from ev_article_cate where is_delete = 0 order by id asc";
  db.query(sqlStr, (err, results) => {
    if (err) return res.cc(err);
    if (results.length === 0) return res.cc("没有文章列表!");
    return res.send({
      status: 0,
      msg: "获取文章分类列表成功!",
      data: results,
    });
  });
};

exports.addArticle = (req, res) => {
  // 新增文章
  // 先要判断是否存在该文章，如果存在就不插入
  const sqlCheckStr =
    "select * from ev_article_cate where name = ? or alias = ?";
  db.query(sqlCheckStr, [req.body.name, req.body.alias], (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 0) return res.cc("文章列表已存在!");
    const sqlInsertStr = "insert into ev_article_cate set ?";
    db.query(
      sqlInsertStr,
      { name: req.body.name, alias: req.body.alias },
      (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc("新增文章列表失败!");
        return res.cc("新增文章分类列表成功", 0);
      }
    );
  });
};

exports.deleArticle = (req, res) => {
  // 根据id删除文章，不能删除科技和最新两个分类列表，所谓删除并不是真的删除，而是把is_delete置为1，这样可以保护数据
  // 获取id req.params.id
  const sqlCheckStr = "select * from ev_article_cate where id = ?";
  db.query(sqlCheckStr, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length == 0) return res.cc("该文章列表不存在");
    if (results[0].name == "科技" || results[0].name == "最新")
      return res.cc("不可以删除'科技'或者'最新'的列表!");
    const sqlDelStr = "update ev_article_cate set ? where id = ?";
    db.query(sqlDelStr, [{ is_delete: 1 }, req.params.id], (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("删除文章列表失败!");
      return res.cc("删除文章分类成功!", 0);
    });
  });
};

exports.getArticleID = (req, res) => {
  // 根据ID获取文章分类数据
  const sqlStr = "select * from ev_article_cate where id = ? and is_delete != 1";
  db.query(sqlStr, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length == 0) return res.cc("该文章列表不存在");
    return res.send({
      status: 0,
      msg: "获取文章分类数据成功!",
      data: results,
    });
  });
};

exports.updateArticle = (req, res) => {
  // 根据ID来更新文章分类数据
  const sqlStr = "select * from ev_article_cate where id = ?";
  db.query(sqlStr, req.body.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length == 0) return res.cc("该文章列表不存在");
    // 查看是否重复
    const sqlCheckStr =
      "select * from ev_article_cate where name = ? or alias = ?";
    db.query(sqlCheckStr, [req.body.name, req.body.alias], (err, results) => {
      if (err) return res.cc(err);
      if (results.length !== 0) return res.cc("文章列表已存在!");
      const updateStr = "update ev_article_cate set ? where id = ?";
      db.query(
        updateStr,
        [{ name: req.body.name, alias: req.body.alias }, req.body.id],
        (err, results) => {
          if (err) return res.cc(err);
          if (results.affectedRows !== 1) return res.cc("更新文章列表失败");
          return res.cc("更新文章列表成功", 0);
        }
      );
    });
  });
};

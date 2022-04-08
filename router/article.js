// 文章分类路由
const express = require("express");
const router = express.Router();

const routerHanlder = require("../router_handle/article");

const expressJoi = require("@escook/express-joi");

const { reg_addatticle_schema } = require("../schema/article");
const { reg_deleatticle_schema } = require("../schema/article");
const { reg_updateatticle_schema } = require("../schema/article");

router.get("/cates", routerHanlder.getArticle);

router.post(
  "/addcates",
  expressJoi(reg_addatticle_schema),
  routerHanlder.addArticle
);

router.post(
  "/deletecate/:id",
  expressJoi(reg_deleatticle_schema),
  routerHanlder.deleArticle
);

router.get(
  "/cates/:id",
  expressJoi(reg_deleatticle_schema),
  routerHanlder.getArticleID
);

router.post(
  "/updatecate",
  expressJoi(reg_updateatticle_schema),
  routerHanlder.updateArticle
);

module.exports = router; // 向外暴露

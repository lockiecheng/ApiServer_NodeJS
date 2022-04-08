const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const upload = multer({ dest: path.join(__dirname, "../uploads") });
const { add_article_schema } = require("../schema/articlePublish");
const expressJoi = require("@escook/express-joi");

const routerHanlder = require("../router_handle/articlePublish");
router.post(
  "/add",
  upload.single("cover_img"),
  expressJoi(add_article_schema),
  routerHanlder.publishArticle
);

module.exports = router;

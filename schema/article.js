// 创建文章验证规则模块

const joi = require("@hapi/joi");
/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// ID和nickname、email的验证规则
const id = joi.number().integer().min(1).required();
const name = joi.string().min(1).required();
const alias = joi.string().min(1).required();

exports.reg_addatticle_schema = {
  body: {
    name,
    alias,
  },
};

exports.reg_deleatticle_schema = {
  params: {
    id,
  },
};

exports.reg_updateatticle_schema = {
    body: {
      id,
      name,
      alias
    },
  };

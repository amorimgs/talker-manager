const express = require('express');
const TokenGenerator = require('uuid-token-generator');

const emailValidate = require('../middlewares/emailValidate');
const passwordValidate = require('../middlewares/passwordValidate');

const router = express.Router();

router.post('/login', emailValidate, passwordValidate, (req, res) => {
  const tokenRandon = new TokenGenerator(256, TokenGenerator.BASE62);
  return res.status(200).json({
    token: tokenRandon.generate().substring(0, 16),
  });
});

module.exports = router;
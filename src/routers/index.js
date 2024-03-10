const express = require('express');

const loginRoute = require('./login.router');
const talkerRoute = require('./talker.router');

const router = express.Router();

router.use(loginRoute);
router.use(talkerRoute);

module.exports = router;

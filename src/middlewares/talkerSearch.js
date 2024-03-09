const path = require('node:path');
const readJsonData = require('../utils/fs/readJson');
const { rateAuxiliar } = require('./talkValidate');

const pathJson = path.join(__dirname, '..', 'talker.json');

const qParam = async (req, res, next) => {
  const { q } = req.query;
  if (!q && q !== '') {
    return next();
  }
  const data = await readJsonData(pathJson);
  const result = data.filter((el) => el.name.includes(q));
  if (result.length === 0) {
    return res.status(200).json([]);
  }
  return res.status(200).json(result);
};

const rateParam = async (req, res, next) => {
  const { rate } = req.query;
  console.log(rate);
  if (!rate && rate !== '') {
    return next();
  }
  const checkRate = rateAuxiliar(+rate);
  if (checkRate) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
  }
  const data = await readJsonData(pathJson);
  const result = data.filter((el) => el.talk.rate === +rate);
  if (!result) {
    return res.status(200).json([]);
  }
  return res.status(200).json(result);
};

const allParam = async (req, res, next) => {
  const { q, rate } = req.query;
  if (!q || !rate) {
    return next();
  }
  const data = await readJsonData(pathJson);
  const result = data.filter((el) => el.name.includes(q)).filter((el) => el.talk.rate === +rate);
  return res.status(200).json(result);
};

const noParam = async (req, res) => res.status(200).json([]);

module.exports = { qParam, rateParam, noParam, allParam };
const express = require('express');
const path = require('node:path');

const connection = require('../db/connection');
const readJsonData = require('../utils/fs/readJson');
const tokenValidate = require('../middlewares/tokenValidate');
const writeJsonData = require('../utils/fs/writeJson');
const nameValidate = require('../middlewares/nameValidate');
const ageValidate = require('../middlewares/ageValidate');
const { talkValidate,
  watchdAtValidate, rateValidate } = require('../middlewares/talkValidate');
const { allParam } = require('../middlewares/talkerSearch');
const { rateQueyValidate, dateQueryValidate } = require('../middlewares/queryValidate');
const rateBodyValidate = require('../middlewares/rateBodyValidate');

const router = express.Router();
const pathJson = path.join(__dirname, '..', 'talker.json');

router.get('/talker', async (req, res) => {
  const data = await readJsonData(pathJson);
  res.status(200).json(data);
});

router.get('/talker/search', 
  tokenValidate, 
  rateQueyValidate,
  dateQueryValidate,
  allParam);

router.get('/talker/db', async (req, res) => {
  const query = 'SELECT * FROM talkers';
  const result = await connection.execute(query);
  console.log(result[0]);
  const resultFormated = result[0].map((el) => ({
    name: el.name,
    age: el.age,
    id: el.id,
    talk: {
      rate: el.talk_rate,
      watchedAt: el.talk_watched_at,
    },
  }));
  return res.status(200).json(resultFormated);
});

router.get('/talker/:id', async (req, res) => {
  const { params } = req;
  const data = await readJsonData(pathJson);
  const result = data.find((el) => el.id === +params.id);
  if (!result) {
    return res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  }
  return res.status(200).json(result);
});

router.post('/talker', 
  tokenValidate,
  nameValidate, ageValidate, talkValidate, watchdAtValidate, rateValidate, async (req, res) => {
    const { body } = req;
    const data = await readJsonData(pathJson);
    const newID = data.reduce((prev, cur) => ((prev.id > cur.id) ? prev : cur)).id + 1;
    const newTalker = { id: newID, ...body };
    data.push(newTalker);
    await writeJsonData(pathJson, data);
    res.status(201).json(newTalker); 
  });

router.put('/talker/:id', 
  tokenValidate,
  nameValidate, ageValidate, talkValidate, watchdAtValidate, rateValidate, async (req, res) => {
    const data = await readJsonData(pathJson);
    const { id } = req.params;
    if (!data.some((el) => el.id === +id)) {
      return res.status(404).json({
        message: 'Pessoa palestrante não encontrada',
      });
    }
    const talkEdit = { id: +id, ...req.body };
    const dataEdit = data.map((el) => {
      if (el.id === +id) {
        return talkEdit;
      } return el;
    });
    await writeJsonData(pathJson, dataEdit);
    return res.status(200).json(talkEdit);
  });

router.delete('/talker/:id', tokenValidate, async (req, res) => {
  const data = await readJsonData(pathJson);
  const { id } = req.params;
  const dataEdit = data.filter((el) => el.id !== +id);
  await writeJsonData(pathJson, dataEdit);
  res.status(204).end();
});

router.patch('/talker/rate/:id', tokenValidate, rateBodyValidate, async (req, res) => {
  const { id } = req.params;
  const { rate } = req.body;
  const data = await readJsonData(pathJson);
  const talker = data.find((el) => el.id === +id);
  talker.talk.rate = +rate;
  await writeJsonData(pathJson, data);
  return res.status(204).end();
});

module.exports = router;
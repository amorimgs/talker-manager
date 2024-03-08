const express = require('express');
const path = require('node:path');
const TokenGenerator = require('uuid-token-generator');

const readJsonData = require('./utils/fs/readJson');
const emailValidate = require('./middlewares/emailValidate');
const passwordValidate = require('./middlewares/passwordValidate');
const tokenValidate = require('./middlewares/tokenValidate');
const writeJsonData = require('./utils/fs/writeJson');
const nameValidate = require('./middlewares/nameValidate');
const ageValidate = require('./middlewares/ageValidate');
const { talkValidate, watchdAtValidate, rateValidate } = require('./middlewares/talkValidate');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

const pathJson = path.join(__dirname, 'talker.json');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  const data = await readJsonData(pathJson);
  res.status(HTTP_OK_STATUS).json(data);
});

app.get('/talker/:id', async (req, res) => {
  const { params } = req;
  const data = await readJsonData(pathJson);
  const result = data.find((el) => el.id === +params.id);
  if (!result) {
    return res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  }
  return res.status(HTTP_OK_STATUS).json(result);
});

app.post('/login', emailValidate, passwordValidate, (req, res) => {
  const tokenRandon = new TokenGenerator(256, TokenGenerator.BASE62);
  return res.status(HTTP_OK_STATUS).json({
    token: tokenRandon.generate().substring(0, 16),
  });
});

app.post('/talker', 
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

app.put('/talker/:id', 
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

app.listen(PORT, () => {
  console.log('Online');
});

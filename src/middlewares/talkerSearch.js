const path = require('node:path');
const readJsonData = require('../utils/fs/readJson');

const pathJson = path.join(__dirname, '..', 'talker.json');

const filterData = (data, q, rate, date) => {
  let result = data;
  if (q) {
    result = result.filter((el) => el.name.includes(q));
  }
  if (rate) {
    result = result.filter((el) => el.talk.rate === +rate);
  }
  if (date) {
    result = result.filter((el) => el.talk.watchedAt === date);
  }
  return result;
};

const allParam = async (req, res) => {
  const { q, rate, date } = req.query;
  const data = await readJsonData(pathJson);
  const result = filterData(data, q, rate, date);
  return res.status(200).json(result);
};

module.exports = { allParam };
const checkWatchAt = (date) => {
  const regex = '\\d{2}/\\d{2}/\\d{4}';
  return date.match(regex);
};

const watchdAtValidate = (req, res, next) => {
  const { watchedAt } = req.body.talk;
  if (!watchedAt) {
    return res.status(400).json({
      message: 'O campo "watchedAt" é obrigatório',
    });
  }
  if (!checkWatchAt(watchedAt)) {
    return res.status(400).json({ 
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const checkRate = (rate) => {
  const boolean = !Number.isInteger(rate) || rate > 5 || rate < 1;
  return boolean;
};

const rateValidate = (req, res, next) => {
  const { rate } = req.body.talk;
  if (!rate && rate !== 0) {
    return res.status(400).json({
      message: 'O campo "rate" é obrigatório',
    });
  }
  if (checkRate(rate)) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
  }
  next();
};

const talkValidate = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório',
    });
  }
  next();
};

module.exports = {
  talkValidate,
  watchdAtValidate,
  rateValidate,
  checkWatchAt,
};
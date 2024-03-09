const checkRate = (rate) => {
  const boolean = !Number.isInteger(rate) || rate > 5 || rate < 1;
  return boolean;
};

const rateQueyValidate = (req, res, next) => {
  const { rate } = req.query;

  if (rate === '') {
    return res.status(400).json({
      message: 'O campo "rate" é obrigatório',
    });
  }
  if (rate === undefined) return next();
  if (checkRate(+rate)) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
  }
  next();
};

const checkWatchAt = (date) => {
  const regex = '\\d{2}/\\d{2}/\\d{4}';
  return date.match(regex);
};

const dateQueryValidate = (req, res, next) => {
  const { date } = req.query;
  if (date) {
    if (date === '') return next();
    if (!checkWatchAt(date)) {
      return res.status(400).json({ 
        message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"' });
    }
  }
  next();
};

module.exports = { rateQueyValidate, dateQueryValidate };
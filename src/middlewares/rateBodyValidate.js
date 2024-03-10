const checkRate = (rate) => {
  const boolean = !Number.isInteger(rate) || rate > 5 || rate < 1;
  return boolean;
};

const rateBodyValidate = (req, res, next) => {
  const { rate } = req.body;
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

module.exports = rateBodyValidate;
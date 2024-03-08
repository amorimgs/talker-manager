const emailValidate = (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: 'O campo "email" é obrigatório',
    });
  }
  const regex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]/i;
  if (!regex.test(email)) {
    return res.status(400).json({
      message: 'O "email" deve ter o formato "email@email.com"',
    });
  }
  next();
};

module.exports = emailValidate;
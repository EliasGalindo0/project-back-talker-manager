const emailNullMessage = { message: 'O campo "email" é obrigatório' };
const emailValidMessage = { message: 'O "email" deve ter o formato "email@email.com"' };
const passwordNullMessage = { message: 'O campo "password" é obrigatório' };
const passwordLenghtMessage = { message: 'O "password" deve ter pelo menos 6 caracteres' };
const emailRegex = /\S+@\S+\.\S+/;

const loginMiddleware = (req, res, next) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json(emailNullMessage);

  if (!emailRegex.test(email)) return res.status(400).json(emailValidMessage);

  if (!password) return res.status(400).json(passwordNullMessage);

  if (password.length < 6) return res.status(400).json(passwordLenghtMessage);

  return next();
};

module.exports = loginMiddleware;

const nameValidate = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' }); 
  }    
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  return next();
};

const ageValidate = (req, res, next) => {
  const { age } = req.body;

  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' }); 
  }    
  if (age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  return next();
};

const talkerValidate = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
  return next();
};

const rateValidate = (req, res, next) => {
  const { talk: { rate } } = req.body;

  if ([undefined, null, ''].includes(rate)) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' }); 
  }
  if (rate < 1 || rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' }); 
  }
  return next();
};

const watchedAtValidate = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;

  const validRegex = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
  if (!watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' }); 
  }  
  if (!validRegex.test(watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  return next();
};

module.exports = {
  nameValidate,
  ageValidate,
  rateValidate,
  talkerValidate,
  watchedAtValidate,
};

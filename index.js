const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const readFileFunction = require('./helpers/readFile');
const writeFileFunction = require('./helpers/writeFile');
const loginMiddleware = require('./middlewares/loginMiddleWare');
const {
  nameValidate,
  ageValidate,
  talkerValidate,
  rateValidate,
  watchedAtValidate } = require('./middlewares/validationMiddleware');
const handleAuthorization = require('./middlewares/authorizationMiddleware');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// GET all talkers
app.get('/talker', async (_req, res) => {
  const talkersList = await readFileFunction();
  res.status(HTTP_OK_STATUS).json(talkersList);
});

// GET /talker/:id
app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readFileFunction();
  const talkerID = talkers.find((person) => person.id === Number(id));
  if (talkerID) return res.status(HTTP_OK_STATUS).json(talkerID);
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

// POST /login
app.post('/login', loginMiddleware, (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  res.status(HTTP_OK_STATUS).json({ token });
});

// POST /talker
app.post('/talker',
handleAuthorization,
nameValidate,
ageValidate,
talkerValidate,
rateValidate,
watchedAtValidate, async (req, res) => {
  const talkers = await readFileFunction();
  const newTalker = { ...req.body, id: talkers.length + 1 };
  talkers.push(newTalker);
  writeFileFunction(talkers);
  res.status(201).json(newTalker);
});

// PUT /talker/:id
app.put('/talker/:id',
handleAuthorization,
nameValidate,
ageValidate,
talkerValidate,
rateValidate,
watchedAtValidate, async (req, res) => {
  const { id } = req.params;
  const talkers = await readFileFunction();
  
  // encontra o id da query
  const talkerIndex = talkers.findIndex((talker) => talker.id === Number(id));
  const talkerEdited = { ...req.body, id: Number(id) };
  
  // atualiza as informações e sobrescreve
  talkers[talkerIndex] = { ...talkers[talkerIndex], ...req.body };
  writeFileFunction(talkers);
  res.status(200).json(talkerEdited);
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log(`Escutando a porta ${PORT}`);
});

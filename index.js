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

  if (talkersList) {
    return res.status(HTTP_OK_STATUS).json(talkersList);
  }
    return res.status(HTTP_OK_STATUS).json([]);
});

// GET /talker/search?q=searchTerm
app.get('/talker/search', handleAuthorization, async (req, res) => {
  const { q } = req.query;
  const talkersList = await readFileFunction();

  if (!q) {
    return res.status(HTTP_OK_STATUS).json(talkersList);
  }
  const result = talkersList.filter((talker) => talker.name.includes(q));
  return res.status(HTTP_OK_STATUS).json(result);
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
  res.status(HTTP_OK_STATUS).json(talkerEdited);
});

// DELETE /talker/:id
app.delete('/talker/:id', handleAuthorization, async (req, res) => {
  const { id } = req.params;
  const talkers = await readFileFunction();

  const talkerIndex = talkers.findIndex((talker) => talker.id === Number(id));
  talkers.splice(talkerIndex, 1);

  writeFileFunction(talkers);
  res.sendStatus(204);
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log(`Escutando a porta ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const { randomUUID } = require('crypto');
const readFileFunction = require('./helpers/readFile');
const authorizationMiddleware = require('./middlewares/authorizationMiddleware');
const nameMiddleware = require('./middlewares/nameMiddleware');
const writeFileFunction = require('./helpers/writeFile');
const loginMiddleware = require('./middlewares/loginMiddleWare');

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
  const token = randomUUID().split('-').join('').substring(0, 16);
  res.status(HTTP_OK_STATUS).json({ token });
});

// POST /talker
app.post('/talker', authorizationMiddleware, nameMiddleware, async (req, res) => {
  const { name, age, talk, watchedAt, rate } = req.body;

  const talkers = await readFileFunction();
  talkers.push({ id: talkers.length + 1, name, age, talk, watchedAt, rate });
  writeFileFunction(talkers);
  res.status(200).json(talkers);
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log(`Escutando a porta ${PORT}`);
});

const { readFile } = require('fs').promises;

const readFileFunction = async () => {
  const talkers = await readFile('./talker.json', 'utf-8'); 
  return JSON.parse(talkers);
};

module.exports = readFileFunction;

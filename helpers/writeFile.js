const { writeFile } = require('fs').promises;

const writeFileFunction = async (data) => {
  await writeFile('./talker.json', JSON.stringify(data));
};

module.exports = writeFileFunction;

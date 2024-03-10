const express = require('express');
const connection = require('./db/connection');
const rauters = require('./routers');

const app = express();
app.use(express.json());
app.use(rauters);

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

const main = async () => {
  await connection.execute('SELECT 1+1');
  console.log('MySQL connection OK | port 3306');
  app.listen(PORT, async () => {
    console.log('Online port 3001');
  });
};

main().catch((err) => console.log(err));
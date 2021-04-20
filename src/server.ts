import express from 'express';

const app = express();

app.get('/', (request, response) => response.json({
  message: 'ola nlw',
}));

app.post('/', (request, response) => response.json({ message: 'user saved' }));

app.listen(3333, () => console.log('serve is running on port 3333'));

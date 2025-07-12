const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3005;

app.use(express.json());

app.post('/event', (req, res) => {
  const event = JSON.stringify(req.body);
  fs.appendFileSync('events.log', event + '\n');
  res.send({ status: 'logged' });
});

app.get('/events', (req, res) => {
  const data = fs.existsSync('events.log') ? fs.readFileSync('events.log', 'utf-8') : '';
  res.type('text').send(data);
});

app.listen(PORT, () => {
  console.log(`Dashboard listening on port ${PORT}`);
});
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);


app.use(express.static(process.cwd() + '/src/'));



app.get('/', (req, res) => {
  res.status(200).type('text/html')
  res.sendFile(process.cwd()+'/src/register.html');
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});


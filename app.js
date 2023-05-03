const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
let pathToEnv = '';

if (process.env.NODE_ENV.trim() === 'development') {
  pathToEnv = path.join(__dirname, `.env`);
}
const pathStaticFile = path.join(__dirname, 'static');
dotenv.config({ path: pathToEnv });
const port = Number(process.env.PORT);
const app = http.createServer(function (request, response) {
  if (request.url == '/') {
    fs.readFile(path.join(pathStaticFile, 'index.html'), (err, res) => {
      response.write(res.toString());
      response.end();
    });
  }
});
const io = new Server(app);
io.on('connect', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
    const message = {
      msg: msg,
      socketID: socket.id,
    };
    io.emit('chat message', message);
    console.log('message: ' + msg);
  });
});

app.listen(port, () => {
  console.log('Server Start!');
});

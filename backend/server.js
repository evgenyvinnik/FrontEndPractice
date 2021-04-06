const fs = require('fs');
const app = require('express')();
const http = require('http').createServer(app);

const localhostRegex = /http:\/\/localhost/
const io = require('socket.io')(http, {
  cors: { origin: localhostRegex }
});

const PORT = 4000;
const DATA_FILE = __dirname + '/order-data.json';

// Initialize order data.
const orders = JSON.parse(fs.readFileSync(DATA_FILE));
const byTime = {};
orders.forEach(order => {
  const timestamp = String(order.sent_at_second);
  if (byTime[timestamp]) {
    byTime[timestamp].push(order);
  } else {
    byTime[timestamp] = [order];
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/health', (req, res) => {
  res.send('ok');
});

/**
 * This server is a very naive implementation of a order service.
 *
 * It waits for a new connection, upon which it iterates through a
 * JSON file of sample order data and sends it down to the connected
 * client. The server will restart the order events for a new connection,
 * and stops after it receives a disconnect. Feel free to extend this if needed,
 * it's meant to be quite bare-bones :)
 */
io.on('connection', (socket) => {
  console.log('New connection');
  let elapsed = 0;
  const ticker = setInterval(() => {
    if (elapsed >= 330) {
      console.log('All order events sent');
      clearInterval(ticker);
      return;
    }
    const toSend = byTime[String(elapsed)];
    if (toSend && toSend.length > 0) {
      io.emit('order_event', toSend);
    }
    elapsed += 1;
  }, 1000);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(ticker);
  });
});

http.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./utils/database');
const { errorHandler, notFound } = require('./middleware/error');

const authRoutes = require('./routes/authRoutes');
const neoRoutes = require('./routes/neoRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: true, credentials: true },
});
app.set('io', io);

connectDB();

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.set('trust proxy', 1);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cosmic Watch API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/user', authRoutes);
app.use('/api', neoRoutes);
app.use('/api/watchlist', watchlistRoutes);

const chatRooms = new Map();

io.on('connection', (socket) => {
  socket.on('join-room', (asteroidId) => {
    socket.join(asteroidId);
    if (!chatRooms.has(asteroidId)) chatRooms.set(asteroidId, []);
    socket.emit('room-messages', chatRooms.get(asteroidId));
    socket.to(asteroidId).emit('user-joined', { message: 'A new user joined the discussion', timestamp: new Date() });
  });

  socket.on('send-message', ({ asteroidId, message, username, avatar }) => {
    const chatMessage = {
      id: Date.now().toString(),
      asteroidId,
      username: username || 'Anonymous',
      avatar: avatar || null,
      message,
      timestamp: new Date(),
    };
    if (!chatRooms.has(asteroidId)) chatRooms.set(asteroidId, []);
    const messages = chatRooms.get(asteroidId);
    messages.push(chatMessage);
    if (messages.length > 100) messages.shift();
    io.to(asteroidId).emit('new-message', chatMessage);
  });

  socket.on('leave-room', (asteroidId) => {
    socket.leave(asteroidId);
    socket.to(asteroidId).emit('user-left', { message: 'A user left the discussion', timestamp: new Date() });
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = { app, server, io };

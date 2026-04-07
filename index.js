const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const hbs = require('hbs');
const http = require('http');
const { Server } = require('socket.io');

const env = require('./config/environment');
const { sequelize } = require('./src/models'); // ✅ Sequelize

const cron = require("node-cron");
const { Op } = require("sequelize");

const port = env.port;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

module.exports = { app, server, io };


// ==============================
// Middleware
// ==============================
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '8mb' }));
app.use(cors({ origin: '*' }));


// ==============================
// Root route
// ==============================
app.get('/', (req, res) => {
  res.send('<center><h1>CreatorOps (PostgreSQL)</h1></center>');
});


// ==============================
// Routes (same as before)
// ==============================


// Register routes
const contactus = require('./routes/contactus');
const roles = require('./routes/Admin/roles');
const plansRoutes = require('./routes/plans');
const acl = require('./routes/Admin/acl');
const blog = require("./routes/blogsRouter");
const superAdmin = require('./routes/superadmin');
const teamManagement = require('./routes/teamManagement');
// const chat = require('./routes/chat');
const settings = require('./routes/systemSettingsRoutes');
const emailVerification = require('./routes/emailVerification');

app.use('/api/contact', contactus);
app.use('/api/admin/roles', roles);
app.use('/api/plans', plansRoutes);
app.use('/api/admin/acl', acl);
app.use("/api/blogs", blog);
app.use('/api/superAdmin', superAdmin);
app.use('/api/team-management', teamManagement);
// app.use('/api/chat',chat);
app.use('/api/settings', settings);
app.use('/api/email-verification', emailVerification);

// ==============================
// 404 handler
// ==============================
app.use("*", (req, res) => {
  res.status(404).json({ status: 404, message: 'Endpoint not found' });
});


// ==============================
// SOCKET.IO
// ==============================
io.on("connection", (socket) => {
  socket.on("joinRoom", (room) => {
    socket.join(room);
  });
});

// ==============================
// Start Server
// ==============================
server.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected');

    console.log(`🚀 Running on port ${port}`);

  } catch (err) {
    console.error('❌ DB connection failed:', err);
  }
});
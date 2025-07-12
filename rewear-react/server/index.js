const express = require('express');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'rewear-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true if using HTTPS
}));

// 🔐 Signup route
app.post('/api/signup', async (req, res) => {
  const { email, password, name } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, password: hash, name }
    });
    req.session.userId = user.id;
    res.json({ message: 'Signup successful', userId: user.id });
  } catch (err) {
    res.status(400).json({ error: 'Email already in use' });
  }
});

// 🔐 Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.userId = user.id;
  res.json({ message: 'Login successful', userId: user.id });
});

// 🧑‍💼 Get current user
app.get('/api/me', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });

  const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
  res.json(user);
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

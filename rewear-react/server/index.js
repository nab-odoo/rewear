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

// GET /api/items → returns all available items
app.get("/api/items", async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      where: { status: "available" },
      include: { owner: true }, // so we can show uploader info
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: "Failed to load items" });
  }
});

app.post("/api/items", async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const {
  title,
  description,
  category,
  size,
  condition,
  tags = "",
  imageUrl = "",              // ← add this line
  status = "available"        // ← optional, default handled by Prisma
} = req.body;

  try {
    const item = await prisma.item.create({
  data: {
    title,
    description,
    category,
    size,
    condition,
    tags,
    status,
    imageUrl,
    ownerId: userId,
      },
    });

    res.json({ message: "Item listed successfully", item });
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).json({ error: "Failed to create item" });
  }
});

app.get("/api/items/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const item = await prisma.item.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!item) return res.status(404).json({ error: "Item not found" });

    res.json(item);
  } catch (err) {
    console.error("Error fetching item:", err);
    res.status(500).json({ error: "Failed to fetch item" });
  }
});

// PATCH: update item status (swap or redeem)
app.patch("/api/items/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.session.userId;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  if (!["available", "swapped", "redeemed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: "Item not found" });

    const updatedItem = await prisma.item.update({
      where: { id },
      data: { status },
      include: { owner: true }, // 👈 keep this to return full item
    });

    // Award points if redeemed
    if (status === "redeemed") {
      await prisma.user.update({
        where: { id: item.ownerId },
        data: { points: { increment: 10 } },
      });
    }

    // ✅ Final single response
    res.json({ message: "Item updated", item: updatedItem });

  } catch (err) {
    console.error("Status update failed:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.get("/api/dashboard", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const [items, user] = await Promise.all([
      prisma.item.findMany({
        where: { ownerId: userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { points: true },
      }),
    ]);

    res.json({ items, points: user?.points || 0 });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});


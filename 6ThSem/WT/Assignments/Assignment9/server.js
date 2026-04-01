import express from 'express';
import cors from 'cors';
import basicAuth from 'express-basic-auth';

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
let products = [
  { id: '1', name: 'Laptop', price: 1200, quantity: 5, category: 'Electronics' },
  { id: '2', name: 'Monitor', price: 300, quantity: 10, category: 'Electronics' },
  { id: '3', name: 'Keyboard', price: 80, quantity: 25, category: 'Accessories' },
];

// Basic Authentication
app.use(basicAuth({
  users: {
    'admin': 'password',
    'user': 'password'
  },
  challenge: true,
  realm: 'Inventory System'
}));

// Helper to check role (simplified - admin has all access)
const isAdmin = (req) => req.auth.user === 'admin';

// Routes

// GET all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ status: 'error', message: 'Product not found' });
  }
  res.json(product);
});

// POST create product (ADMIN only)
app.post('/api/products', (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ status: 'error', message: 'Access denied' });
  }

  const { name, price, quantity, category } = req.body;

  if (!name || price === undefined || quantity === undefined || !category) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }

  const newProduct = {
    id: Date.now().toString(),
    name,
    price: parseFloat(price),
    quantity: parseInt(quantity),
    category
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT update product (ADMIN only)
app.put('/api/products/:id', (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ status: 'error', message: 'Access denied' });
  }

  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ status: 'error', message: 'Product not found' });
  }

  const { name, price, quantity, category } = req.body;
  if (name) product.name = name;
  if (price !== undefined) product.price = parseFloat(price);
  if (quantity !== undefined) product.quantity = parseInt(quantity);
  if (category) product.category = category;

  res.json(product);
});

// DELETE product (ADMIN only)
app.delete('/api/products/:id', (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ status: 'error', message: 'Access denied' });
  }

  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ status: 'error', message: 'Product not found' });
  }

  const deleted = products.splice(index, 1);
  res.json(deleted[0]);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: 'error', message: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`📦 API available at http://localhost:${PORT}/api`);
  console.log(`\nDefault credentials:`);
  console.log(`  admin / password (Full CRUD access)`);
  console.log(`  user / password (Read-only access - will be enforced)`);
});

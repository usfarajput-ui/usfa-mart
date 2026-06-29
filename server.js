const express = require('express');
const path = require('path');
const products = require('./data/products');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── ROUTES ─────────────────────────────────────────────────────────────────

// Home page
app.get('/', (req, res) => {
  const featured = products.slice(0, 4);
  const categories = [...new Set(products.map(p => p.category))];
  res.render('index', { products, featured, categories, searchQuery: '' });
});

// Shop / All Products
app.get('/shop', (req, res) => {
  const { search = '', category = '' } = req.query;
  let filtered = products;
  if (search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  const categories = [...new Set(products.map(p => p.category))];
  res.render('shop', { products: filtered, categories, searchQuery: search, activeCategory: category });
});

// Single product
app.get('/product/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.redirect('/shop');
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
  res.render('product', { product, related });
});

// Contact page
app.get('/contact', (req, res) => {
  res.render('contact', { success: false });
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log(`📩 New message from ${name} (${email}): ${message}`);
  res.render('contact', { success: true });
});

// Cart page (cart managed on client side via localStorage)
app.get('/cart', (req, res) => {
  res.render('cart');
});

// API: get all products (for cart/search via JS)
app.get('/api/products', (req, res) => {
  res.json(products);
});

// 404
app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`\n🛍️  Usfa Mart is running!`);
  console.log(`👉  Open: http://localhost:${PORT}\n`);
});

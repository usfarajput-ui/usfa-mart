import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const PORT = process.env.PORT || 3000;
const STORE_NAME = process.env.STORE_NAME || 'USFA MART';
const WHATSAPP_NUMBER = (process.env.WHATSAPP_NUMBER || '923711734502').replace(/\D/g, '');
const STORE_ADDRESS = process.env.STORE_ADDRESS || '16 A Al Jannat homes Kahna Lahore';

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

async function readProducts() {
  const filePath = path.join(__dirname, 'data', 'products.json');
  const file = await fs.readFile(filePath, 'utf8');
  return JSON.parse(file);
}

function formatPKR(amount) {
  return Number(amount || 0).toLocaleString('en-PK');
}

function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?${new URLSearchParams({ text: message }).toString()}`;
}

app.get('/api/config', (req, res) => {
  res.json({
    storeName: STORE_NAME,
    whatsappNumber: WHATSAPP_NUMBER,
    whatsappDisplay: '+92 371 1734502',
    address: STORE_ADDRESS
  });
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await readProducts();
    const { category, q, tag } = req.query;
    let filtered = [...products];

    if (category && category !== 'All') {
      filtered = filtered.filter(product => product.category.toLowerCase() === String(category).toLowerCase());
    }

    if (tag) {
      filtered = filtered.filter(product => product.tags?.map(t => t.toLowerCase()).includes(String(tag).toLowerCase()));
    }

    if (q) {
      const query = String(q).toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.tags?.some(tagName => tagName.toLowerCase().includes(query))
      );
    }

    res.json(filtered);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Products load nahi ho sakay.' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const products = await readProducts();
    const product = products.find(item => item.id === req.params.id);
    if (!product) return res.status(404).json({ message: 'Product nahi mila.' });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Product load nahi ho saka.' });
  }
});

app.post('/api/quick-whatsapp-order', async (req, res) => {
  try {
    const { productId } = req.body;
    const products = await readProducts();
    const product = products.find(item => item.id === productId);
    if (!product) return res.status(404).json({ message: 'Product nahi mila.' });

    const message = `Assalam o Alaikum, mujhe ${STORE_NAME} se ye product order karna hai:\n\nProduct: ${product.title}\nPrice: Rs. ${formatPKR(product.price)}\n\nPlease availability confirm kar dein.`;
    res.json({ whatsappUrl: buildWhatsAppUrl(message) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'WhatsApp order create nahi ho saka.' });
  }
});

app.post('/api/create-whatsapp-order', (req, res) => {
  const { customer = {}, cart = [] } = req.body;

  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ message: 'Cart empty hai.' });
  }

  const total = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0);
  const lines = cart
    .map((item, index) => `${index + 1}. ${item.title} x ${item.qty || 1} = Rs. ${formatPKR(Number(item.price || 0) * Number(item.qty || 1))}`)
    .join('\n');

  const message = `Assalam o Alaikum, mujhe ${STORE_NAME} se order place karna hai.\n\nCustomer Name: ${customer.name || ''}\nPhone: ${customer.phone || ''}\nDelivery Address: ${customer.address || ''}\n\nOrder Items:\n${lines}\n\nTotal: Rs. ${formatPKR(total)}\nPayment: Cash on Delivery\n\nPlease availability aur delivery charges confirm kar dein.`;

  res.json({
    total,
    whatsappUrl: buildWhatsAppUrl(message)
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`${STORE_NAME} running at http://localhost:${PORT}`);
});

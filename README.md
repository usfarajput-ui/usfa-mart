# 🛍️ Usfa Mart — Node.js Website

A full-featured home decor & daily essentials store built with Node.js + Express + EJS.

## 📁 Project Structure

```
usfa-mart/
├── server.js              ← Main server (Express)
├── package.json
├── data/
│   └── products.js        ← Product catalog
├── views/
│   ├── index.ejs          ← Home page
│   ├── shop.ejs           ← All products + search + filter
│   ├── product.ejs        ← Single product detail
│   ├── cart.ejs           ← Shopping cart
│   ├── contact.ejs        ← Contact form
│   ├── 404.ejs            ← 404 page
│   └── partials/
│       ├── header.ejs
│       ├── footer.ejs
│       └── product-card.ejs
└── public/
    ├── css/style.css
    └── js/main.js
```

## 🚀 Setup & Run

### Step 1: Install Node.js
Download from https://nodejs.org (LTS version)

### Step 2: Install dependencies
```bash
cd usfa-mart
npm install
```

### Step 3: Configure WhatsApp Number
Open `public/js/main.js` and change line 2:
```js
const WHATSAPP_NUMBER = '923001234567'; // Your number (92 + 10 digits, no +)
```

Also update the number in `views/partials/footer.ejs`.

### Step 4: Start the server
```bash
npm start
```

Then open: **http://localhost:3000**

For development with auto-restart:
```bash
npm install -g nodemon
npm run dev
```

## ✅ Features

- 🏠 **Home page** with hero banner & featured products
- 🛍️ **Shop page** with search & category filter
- 📦 **Product detail** page with related products
- 🛒 **Shopping cart** (localStorage-based, no login needed)
- 💬 **WhatsApp integration** — order via WhatsApp with auto-filled message
- 💰 **Cash on Delivery** checkout with WhatsApp confirmation
- 📬 **Contact form**
- 📱 **Fully responsive** for mobile

## 🎨 Customization

### Add your own products
Edit `data/products.js` — add/remove/edit items.

### Change colors
Edit CSS variables in `public/css/style.css` (`:root` block at the top).

### Add more pages
Create a new `.ejs` file in `views/` and add a route in `server.js`.

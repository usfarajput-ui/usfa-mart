# USFA MART Node.js Store

Ready-to-run Node.js / Express e-commerce storefront for **USFA MART**.

## Included

- USFA MART logo added in `public/assets/usfa-logo.png`
- Red, yellow, green, blue and black UI theme inspired by the logo
- 40 product listings in `data/products.json`
- Prices set Rs. 10–20 lower than the market sample price field
- Category filters, search, cart drawer and product details
- WhatsApp quick order per product
- Cart checkout through WhatsApp
- Store WhatsApp: `03711734502`
- Store address: `16 A Al Jannat homes Kahna Lahore`

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Configure store details

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit these values:

```env
STORE_NAME=USFA MART
WHATSAPP_NUMBER=923711734502
STORE_ADDRESS=16 A Al Jannat homes Kahna Lahore
PORT=3000
```

Important: WhatsApp number must be in international format without `+`. Example: `923711734502`.

## Edit products

Open:

```text
data/products.json
```

Each product has:

```json
{
  "title": "Product name",
  "category": "Kitchen & Dining",
  "price": 1180,
  "competitorPrice": 1200,
  "compareAt": 1450,
  "description": "Product description"
}
```

For real selling, replace placeholder descriptions and icons with your own supplier photos and final stock prices.

## Deploy

### Vercel

1. Create a GitHub repo and upload this folder.
2. Open Vercel and import the GitHub repo.
3. Add environment variables from `.env.example`.
4. Deploy.

### Render

1. Create a new Web Service.
2. Connect your GitHub repo.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables and deploy.

## Notes

Product images from other websites are not copied. Use your own supplier photos to avoid copyright and branding issues.

// ── Cart Manager ──────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '923001234567'; // <-- Apna WhatsApp number yahan daalein

const Cart = {
  get() {
    try { return JSON.parse(localStorage.getItem('usfamart_cart')) || []; }
    catch { return []; }
  },
  save(items) {
    localStorage.setItem('usfamart_cart', JSON.stringify(items));
    Cart.updateCount();
  },
  add(product) {
    const items = Cart.get();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ ...product, qty: 1 });
    }
    Cart.save(items);
    showToast(`✅ ${product.name} added to cart!`);
  },
  remove(id) {
    const items = Cart.get().filter(i => i.id !== id);
    Cart.save(items);
  },
  updateQty(id, delta) {
    const items = Cart.get();
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    Cart.save(items);
  },
  total() {
    return Cart.get().reduce((sum, i) => sum + i.price * i.qty, 0);
  },
  count() {
    return Cart.get().reduce((sum, i) => sum + i.qty, 0);
  },
  updateCount() {
    const el = document.querySelector('.cart-count');
    if (el) {
      const count = Cart.count();
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    }
  },
  clear() {
    localStorage.removeItem('usfamart_cart');
    Cart.updateCount();
  }
};

// ── Toast ──────────────────────────────────────────────────────────────────────
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── WhatsApp Order Builder ─────────────────────────────────────────────────────
function buildWhatsAppOrderMsg(items) {
  let msg = '🛍️ *Order from Usfa Mart*\n\n';
  items.forEach(item => {
    msg += `• ${item.name} x${item.qty} = Rs. ${(item.price * item.qty).toLocaleString()}\n`;
  });
  msg += `\n💰 *Total: Rs. ${Cart.total().toLocaleString()}*\n`;
  msg += `\n🚚 Payment: Cash on Delivery`;
  msg += `\n\nPlease confirm my order. Thank you!`;
  return encodeURIComponent(msg);
}

function openWhatsAppOrder() {
  const items = Cart.get();
  if (!items.length) { showToast('⚠️ Your cart is empty!'); return; }
  const msg = buildWhatsAppOrderMsg(items);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}

function openWhatsAppProduct(name, price) {
  const msg = encodeURIComponent(`Hi! I'm interested in:\n\n🛍️ *${name}*\nPrice: Rs. ${price.toLocaleString()}\n\nIs it available? Please confirm.`);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}

// ── Cart Page Renderer ─────────────────────────────────────────────────────────
function renderCartPage() {
  const container = document.getElementById('cart-items');
  const emptyMsg = document.getElementById('cart-empty');
  const summaryEl = document.getElementById('cart-summary');
  if (!container) return;

  const items = Cart.get();

  if (!items.length) {
    container.innerHTML = '';
    if (emptyMsg) emptyMsg.style.display = 'block';
    if (summaryEl) summaryEl.style.display = 'none';
    return;
  }

  if (emptyMsg) emptyMsg.style.display = 'none';
  if (summaryEl) summaryEl.style.display = 'block';

  container.innerHTML = items.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="item-price">Rs. ${item.price.toLocaleString()}</div>
        <div style="font-size:0.8rem;color:var(--gray)">${item.category}</div>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="qty-display">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <div style="font-weight:800;color:var(--primary);min-width:90px;text-align:right">
        Rs. ${(item.price * item.qty).toLocaleString()}
      </div>
      <button class="remove-btn" onclick="removeItem(${item.id})" title="Remove">🗑️</button>
    </div>
  `).join('');

  // Update summary
  const subtotal = Cart.total();
  const shipping = 0;
  document.getElementById('summary-subtotal').textContent = `Rs. ${subtotal.toLocaleString()}`;
  document.getElementById('summary-shipping').textContent = shipping === 0 ? 'FREE' : `Rs. ${shipping}`;
  document.getElementById('summary-total').textContent = `Rs. ${(subtotal + shipping).toLocaleString()}`;
}

function changeQty(id, delta) {
  Cart.updateQty(id, delta);
  renderCartPage();
}

function removeItem(id) {
  Cart.remove(id);
  renderCartPage();
  showToast('🗑️ Item removed from cart');
}

function codCheckout() {
  const items = Cart.get();
  if (!items.length) { showToast('⚠️ Cart is empty!'); return; }
  const name = prompt('Your Name:');
  if (!name) return;
  const phone = prompt('Your Phone Number:');
  if (!phone) return;
  const address = prompt('Delivery Address:');
  if (!address) return;
  showToast('✅ Order placed! We will call you soon.');
  Cart.clear();
  renderCartPage();
  // You can also send to WhatsApp
  const msg = `📦 *COD Order - Usfa Mart*\n\n👤 ${name}\n📞 ${phone}\n📍 ${address}\n\n` +
    items.map(i => `• ${i.name} x${i.qty} = Rs. ${(i.price*i.qty).toLocaleString()}`).join('\n') +
    `\n\n💰 Total: Rs. ${items.reduce((s,i) => s + i.price*i.qty, 0).toLocaleString()}\n🚚 Cash on Delivery`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateCount();
  renderCartPage();

  // Search form — allow empty submit to reset
  const searchForm = document.querySelector('.nav-search');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchForm.querySelector('input').value.trim();
      window.location.href = `/shop?search=${encodeURIComponent(query)}`;
    });
  }
});

// Tiny Shop cart logic.
const CATALOG = {
  hp: { id: 'hp', name: 'Headphones', price: 50 },
  cb: { id: 'cb', name: 'USB-C Cable', price: 12.5 },
  ls: { id: 'ls', name: 'Laptop Stand', price: 35 },
};
const COUPONS = { SAVE10: 0.1, SAVE20: 0.2 };

const cart = { items: [], coupon: null, discount: 0 };

function money(n) {
  return '$' + n.toFixed(2);
}

function subtotal() {
  return cart.items.reduce((sum, it) => sum + it.price * it.qty, 0);
}

function addItem(id) {
  const existing = cart.items.find((it) => it.id === id);
  if (existing) existing.qty += 1;
  else cart.items.push({ ...CATALOG[id], qty: 1 });
  render();
}

function setQuantity(id, qty) {
  const item = cart.items.find((it) => it.id === id);
  if (!item) return;
  if (qty <= 0) cart.items = cart.items.filter((it) => it.id !== id);
  else item.qty = qty;
  render();
}

function applyCoupon(code) {
  const pct = COUPONS[code];
  if (pct === undefined) {
    document.getElementById('message').textContent = 'That coupon code is not valid.';
    return;
  }
  cart.coupon = code;
  cart.discount = subtotal() * pct;
  document.getElementById('message').textContent = `Coupon ${code} applied.`;
  render();
}

function total() {
  return Math.max(0, subtotal() - cart.discount);
}

function render() {
  const lines = document.getElementById('lines');
  lines.innerHTML = '';
  if (!cart.items.length) lines.innerHTML = '<li class="empty">Your cart is empty.</li>';
  for (const it of cart.items) {
    const li = document.createElement('li');
    li.innerHTML = `<span>${it.name}</span><input type="number" min="0" value="${it.qty}" aria-label="Quantity of ${it.name}" data-id="${it.id}">`;
    li.querySelector('input').addEventListener('change', (e) => setQuantity(it.id, Number(e.target.value)));
    lines.appendChild(li);
  }
  document.getElementById('subtotal').textContent = money(subtotal());
  document.getElementById('discount').textContent = '−' + money(cart.discount);
  document.getElementById('total').textContent = money(total());
}

document.querySelectorAll('.add').forEach((b) => b.addEventListener('click', () => addItem(b.dataset.id)));
document.getElementById('apply').addEventListener('click', () => applyCoupon(document.getElementById('coupon').value.trim().toUpperCase()));
render();

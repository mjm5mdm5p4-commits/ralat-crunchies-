// Ralat Crunchies Cart System
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  const countElements = document.querySelectorAll('#cartCount');
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  countElements.forEach(el => {
    if (el) el.textContent = totalItems;
  });
}

function addToCart(id, name, price) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  // Success toast
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; bottom:20px; left:50%; transform:translateX(-50%);
    background:#25D366; color:white; padding:15px 25px; border-radius:8px;
    z-index:10000; box-shadow:0 4px 12px rgba(0,0,0,0.2); font-weight:500;
  `;
  toast.textContent = `${name} added to cart ✓`;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.remove(), 2200);
}

// Initialize cart count
document.addEventListener('DOMContentLoaded', updateCartCount);

// ============================================
// RALAT CRUNCHIES - Complete Store JavaScript
// ============================================

// Products Data
const products = [
  {
    id: 1,
    name: "Small Pack",
    weight: "50g",
    price: 500,
    icon: "fa-coconut",
    featured: false,
    bestSeller: false
  },
  {
    id: 2,
    name: "Medium Pack",
    weight: "150g",
    price: 1500,
    icon: "fa-crown",
    featured: true,
    bestSeller: true
  },
  {
    id: 3,
    name: "Large Pack",
    weight: "300g",
    price: 2500,
    icon: "fa-users",
    featured: false,
    bestSeller: false
  }
];

// ========== CART FUNCTIONS ==========
function getCart() {
  const cart = localStorage.getItem('ralat_cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('ralat_cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({
      id: product.id,
      name: product.name,
      weight: product.weight,
      price: product.price,
      quantity: quantity
    });
  }
  
  saveCart(cart);
  showNotification('✓ Added to cart!', 'success');
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  if (window.location.pathname.includes('cart.html')) {
    renderCartPage();
  }
  showNotification('Removed from cart', 'info');
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) {
    removeFromCart(productId);
    return;
  }
  
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = newQuantity;
    saveCart(cart);
    renderCartPage();
  }
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElements = document.querySelectorAll('#cartCount');
  cartCountElements.forEach(el => {
    if (el) el.innerText = count;
  });
}

// ========== NOTIFICATION ==========
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i><span>${message}</span>`;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// ========== RENDER SHOP PAGE ==========
function renderShopPage() {
  const productsGrid = document.getElementById('productsGrid');
  if (!productsGrid) return;
  
  productsGrid.innerHTML = products.map(product => `
    <div class="product-card ${product.featured ? 'featured' : ''}">
      ${product.bestSeller ? '<div class="product-badge">🔥 Best Seller</div>' : ''}
      <div class="product-icon"><i class="fas ${product.icon}"></i></div>
      <h3 class="product-title">${product.name}</h3>
      <div class="product-weight">${product.weight}</div>
      <div class="product-price">₦${product.price.toLocaleString()}</div>
      <button class="add-to-cart" onclick="addToCart(${product.id})">
        <i class="fas fa-shopping-cart"></i> Add to Cart
      </button>
    </div>
  `).join('');
}

// ========== RENDER CART PAGE ==========
function renderCartPage() {
  const cartContainer = document.getElementById('cartContainer');
  if (!cartContainer) return;
  
  const cart = getCart();
  
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div style="text-align: center; padding: 60px;">
        <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #DDBF9F;"></i>
        <h3>Your cart is empty</h3>
        <p>Add some delicious coconut chips to your cart!</p>
        <a href="shop.html" class="btn-primary" style="margin-top: 20px; display: inline-block;">Continue Shopping</a>
      </div>
    `;
    return;
  }
  
  cartContainer.innerHTML = `
    <div class="cart-items">
      ${cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${item.name} - ${item.weight}</h4>
            <div class="cart-item-price">₦${item.price.toLocaleString()} each</div>
          </div>
          <div class="cart-item-quantity">
            <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
          </div>
          <div><strong>₦${(item.price * item.quantity).toLocaleString()}</strong></div>
          <button class="btn-danger" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i> Remove</button>
        </div>
      `).join('')}
    </div>
    <div class="cart-summary">
      <h3>Cart Summary</h3>
      <div>Subtotal: <strong>₦${getCartTotal().toLocaleString()}</strong></div>
      <div>Delivery: <strong>Free</strong></div>
      <div class="cart-total">Total: ₦${getCartTotal().toLocaleString()}</div>
      <a href="checkout.html" class="btn-primary">Proceed to Checkout →</a>
    </div>
  `;
}

// ========== RENDER CHECKOUT PAGE ==========
function renderCheckoutPage() {
  const checkoutItems = document.getElementById('checkoutItems');
  const checkoutTotal = document.getElementById('checkoutTotal');
  const cart = getCart();
  
  if (!checkoutItems) return;
  
  if (cart.length === 0) {
    window.location.href = 'shop.html';
    return;
  }
  
  checkoutItems.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <span>${item.name} (${item.weight}) x ${item.quantity}</span>
      <span>₦${(item.price * item.quantity).toLocaleString()}</span>
    </div>
  `).join('');
  
  if (checkoutTotal) {
    checkoutTotal.innerText = `₦${getCartTotal().toLocaleString()}`;
  }
}

// ========== ORDER FUNCTIONS ==========
function saveOrder(order) {
  const orders = JSON.parse(localStorage.getItem('ralat_orders') || '[]');
  orders.push({
    ...order,
    id: 'ORD' + Date.now(),
    date: new Date().toISOString(),
    status: 'pending'
  });
  localStorage.setItem('ralat_orders', JSON.stringify(orders));
}

function renderOrdersPage() {
  const ordersContainer = document.getElementById('ordersContainer');
  if (!ordersContainer) return;
  
  const orders = JSON.parse(localStorage.getItem('ralat_orders') || '[]');
  
  if (orders.length === 0) {
    ordersContainer.innerHTML = `
      <div style="text-align: center; padding: 60px;">
        <i class="fas fa-box-open" style="font-size: 3rem; color: #DDBF9F;"></i>
        <h3>No orders yet</h3>
        <p>Your order history will appear here after you place an order.</p>
        <a href="shop.html" class="btn-primary" style="margin-top: 20px; display: inline-block;">Start Shopping</a>
      </div>
    `;
    return;
  }
  
  ordersContainer.innerHTML = orders.reverse().map(order => `
    <div class="order-card">
      <div class="order-header">
        <span class="order-id">${order.id}</span>
        <span class="order-status status-${order.status}">${order.status === 'pending' ? '⏳ Pending' : '✅ Confirmed'}</span>
      </div>
      <div><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</div>
      <div><strong>Items:</strong> ${order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</div>
      <div><strong>Total:</strong> ₦${order.total.toLocaleString()}</div>
      <div><strong>Delivery:</strong> ${order.address}</div>
      <div style="margin-top: 10px;">
        <a href="https://wa.me/2347061172586?text=I%20have%20a%20question%20about%20order%20${order.id}" class="btn-outline" style="padding: 5px 15px; font-size: 0.8rem;" target="_blank">
          <i class="fab fa-whatsapp"></i> Track Order
        </a>
      </div>
    </div>
  `).join('');
}

// ========== CHECKOUT FORM ==========
function setupCheckoutForm() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    const notes = document.getElementById('orderNotes')?.value || '';
    const cart = getCart();
    
    if (cart.length === 0) {
      showNotification('Your cart is empty!', 'info');
      return;
    }
    
    const total = getCartTotal();
    const itemsList = cart.map(item => `${item.name} (${item.weight}) x${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}`).join('\n');
    
    // Save order
    saveOrder({
      customerName: name,
      customerPhone: phone,
      address: address,
      notes: notes,
      items: cart,
      total: total
    });
    
    // WhatsApp message
    const message = `*NEW ORDER FROM RALAT CRUNCHIES* 🥥\n\n*Customer Details:*\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\n\n*Order Items:*\n${itemsList}\n\n*Total: ₦${total.toLocaleString()}*\n\n${notes ? `*Notes:* ${notes}` : ''}\n\nPlease confirm my order. Thanks!`;
    
    // Clear cart
    localStorage.removeItem('ralat_cart');
    
    // Open WhatsApp
    window.open(`https://wa.me/2347061172586?text=${encodeURIComponent(message)}`, '_blank');
    
    // Redirect
    setTimeout(() => {
      window.location.href = 'orders.html';
    }, 1000);
    
    showNotification('Order sent to WhatsApp!', 'success');
  });
}

// ========== INITIALIZE PAGE ==========
function initPage() {
  updateCartCount();
  
  const path = window.location.pathname;
  
  if (path.includes('shop.html')) {
    renderShopPage();
  } else if (path.includes('cart.html')) {
    renderCartPage();
  } else if (path.includes('checkout.html')) {
    renderCheckoutPage();
    setupCheckoutForm();
  } else if (path.includes('orders.html')) {
    renderOrdersPage();
  }
}

document.addEventListener('DOMContentLoaded', initPage);

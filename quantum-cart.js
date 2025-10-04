// QuantumHeat Shopping Cart System
class QuantumCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('quantumCart')) || [];
        this.isVisible = false;
        this.audioContext = null;
        this.sounds = {};
        this.init();
    }

    async init() {
        this.createCartUI();
        this.bindEvents();
        this.updateCartBadge();
        await this.initAudio();
        this.loadCartFromStorage();
    }

    // Initialize audio for cart interactions
    async initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create different sound effects
            this.sounds = {
                addToCart: this.createTone(800, 0.1, 'sine'),
                removeFromCart: this.createTone(400, 0.15, 'triangle'),
                cartOpen: this.createTone(600, 0.05, 'square'),
                cartClose: this.createTone(300, 0.05, 'square'),
                checkout: this.createTone(1000, 0.2, 'sine')
            };
        } catch (error) {
            console.log('Audio initialization failed:', error);
        }
    }

    createTone(frequency, duration, waveType = 'sine') {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = waveType;
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    // Create the cart UI overlay
    createCartUI() {
        const cartHTML = `
            <div id="quantumCartOverlay" class="cart-overlay">
                <div class="cart-container">
                    <div class="cart-header">
                        <h2>🌀 Quantum Cart</h2>
                        <button class="cart-close" id="cartCloseBtn">✕</button>
                    </div>
                    <div class="cart-items" id="cartItems">
                        <!-- Cart items will be populated here -->
                    </div>
                    <div class="cart-footer">
                        <div class="cart-total">
                            <span class="total-label">Total:</span>
                            <span class="total-amount" id="cartTotal">$0.00</span>
                        </div>
                        <div class="cart-actions">
                            <button class="btn-secondary" id="continueShopping">Continue Shopping</button>
                            <button class="btn-primary" id="checkoutBtn">Proceed to Checkout</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="quantumCartButton" class="cart-button">
                🛒 <span id="cartBadge" class="cart-badge">0</span>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', cartHTML);
        this.addCartStyles();
    }

    addCartStyles() {
        const styles = `
            <style>
                /* Cart Button */
                .cart-button {
                    position: fixed;
                    top: 100px;
                    right: 30px;
                    background: linear-gradient(135deg, #00d4ff, #0099cc);
                    color: #0a0a0a;
                    border: none;
                    border-radius: 50px;
                    padding: 15px 20px;
                    font-size: 1.2rem;
                    font-weight: 700;
                    cursor: pointer;
                    z-index: 1001;
                    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .cart-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 40px rgba(0, 212, 255, 0.5);
                }

                .cart-badge {
                    background: #ff4444;
                    color: white;
                    border-radius: 50%;
                    width: 25px;
                    height: 25px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                /* Cart Overlay */
                .cart-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    z-index: 10000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }

                .cart-overlay.visible {
                    opacity: 1;
                    visibility: visible;
                }

                .cart-container {
                    background: linear-gradient(135deg, rgba(10, 10, 10, 0.95), rgba(0, 20, 40, 0.95));
                    border: 2px solid #00d4ff;
                    border-radius: 20px;
                    width: 90%;
                    max-width: 600px;
                    max-height: 80vh;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0, 212, 255, 0.3);
                    animation: cartSlideIn 0.4s ease;
                }

                @keyframes cartSlideIn {
                    from {
                        transform: scale(0.8) translateY(-50px);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1) translateY(0);
                        opacity: 1;
                    }
                }

                .cart-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid rgba(0, 212, 255, 0.3);
                    background: rgba(0, 212, 255, 0.1);
                }

                .cart-header h2 {
                    color: #00d4ff;
                    font-family: 'Orbitron', monospace;
                    margin: 0;
                    text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
                }

                .cart-close {
                    background: none;
                    border: none;
                    color: #00d4ff;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 5px 10px;
                    border-radius: 5px;
                    transition: all 0.3s ease;
                }

                .cart-close:hover {
                    background: rgba(0, 212, 255, 0.2);
                    transform: rotate(90deg);
                }

                .cart-items {
                    padding: 20px;
                    max-height: 400px;
                    overflow-y: auto;
                    color: white;
                }

                .cart-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px;
                    margin-bottom: 15px;
                    background: rgba(0, 212, 255, 0.1);
                    border-radius: 10px;
                    border: 1px solid rgba(0, 212, 255, 0.3);
                    transition: all 0.3s ease;
                }

                .cart-item:hover {
                    transform: translateX(5px);
                    border-color: #00d4ff;
                }

                .cart-item-image {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #1a1a1a, #0d1421);
                    border: 1px solid #00d4ff;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                }

                .cart-item-details {
                    flex: 1;
                }

                .cart-item-name {
                    font-weight: 600;
                    color: #00d4ff;
                    margin-bottom: 5px;
                }

                .cart-item-price {
                    font-size: 0.9rem;
                    opacity: 0.8;
                }

                .cart-item-controls {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .quantity-btn {
                    background: rgba(0, 212, 255, 0.3);
                    border: 1px solid #00d4ff;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .quantity-btn:hover {
                    background: rgba(0, 212, 255, 0.5);
                }

                .quantity-display {
                    min-width: 40px;
                    text-align: center;
                    font-weight: 600;
                }

                .remove-btn {
                    background: rgba(255, 68, 68, 0.3);
                    border: 1px solid #ff4444;
                    color: #ff4444;
                    padding: 8px 12px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.8rem;
                }

                .remove-btn:hover {
                    background: rgba(255, 68, 68, 0.5);
                }

                .cart-footer {
                    padding: 20px;
                    border-top: 1px solid rgba(0, 212, 255, 0.3);
                    background: rgba(0, 212, 255, 0.05);
                }

                .cart-total {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: white;
                }

                .total-amount {
                    color: #00d4ff;
                    font-family: 'Orbitron', monospace;
                    text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
                }

                .cart-actions {
                    display: flex;
                    gap: 15px;
                }

                .btn-primary, .btn-secondary {
                    flex: 1;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #00d4ff, #0099cc);
                    color: #0a0a0a;
                }

                .btn-secondary {
                    background: transparent;
                    color: #00d4ff;
                    border: 2px solid #00d4ff;
                }

                .btn-primary:hover, .btn-secondary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(0, 212, 255, 0.3);
                }

                .empty-cart {
                    text-align: center;
                    padding: 40px 20px;
                    color: rgba(255, 255, 255, 0.6);
                }

                .empty-cart-icon {
                    font-size: 4rem;
                    margin-bottom: 20px;
                    opacity: 0.5;
                }

                /* Add to cart button styles */
                .add-to-cart-btn {
                    background: linear-gradient(135deg, #00d4ff, #0099cc);
                    color: #0a0a0a;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    position: relative;
                    overflow: hidden;
                }

                .add-to-cart-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(0, 212, 255, 0.4);
                }

                .add-to-cart-btn.added {
                    background: linear-gradient(135deg, #00ff88, #00cc6a);
                }

                .add-to-cart-btn.added::after {
                    content: '✓ Added!';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: inherit;
                }

                /* Responsive design */
                @media (max-width: 768px) {
                    .cart-container {
                        width: 95%;
                        max-height: 90vh;
                    }
                    
                    .cart-actions {
                        flex-direction: column;
                    }
                    
                    .cart-button {
                        right: 20px;
                        padding: 12px 16px;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    bindEvents() {
        // Cart button click
        document.getElementById('quantumCartButton').addEventListener('click', () => {
            this.toggleCart();
        });

        // Close cart
        document.getElementById('cartCloseBtn').addEventListener('click', () => {
            this.hideCart();
        });

        // Continue shopping
        document.getElementById('continueShopping').addEventListener('click', () => {
            this.hideCart();
        });

        // Checkout
        document.getElementById('checkoutBtn').addEventListener('click', () => {
            this.proceedToCheckout();
        });

        // Close on overlay click
        document.getElementById('quantumCartOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'quantumCartOverlay') {
                this.hideCart();
            }
        });
    }

    // Add item to cart
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart();
        this.updateCartBadge();
        this.updateCartDisplay();
        this.showAddedFeedback();
        
        if (this.sounds.addToCart) {
            this.sounds.addToCart();
        }

        // Show temporary notification
        this.showNotification(`Added ${product.name} to cart!`);
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartBadge();
        this.updateCartDisplay();
        
        if (this.sounds.removeFromCart) {
            this.sounds.removeFromCart();
        }
    }

    // Update item quantity
    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartBadge();
                this.updateCartDisplay();
            }
        }
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('quantumCart', JSON.stringify(this.items));
    }

    // Load cart from localStorage
    loadCartFromStorage() {
        const savedCart = localStorage.getItem('quantumCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCartBadge();
            this.updateCartDisplay();
        }
    }

    // Update cart badge
    updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        
        if (totalItems > 0) {
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    // Update cart display
    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <p>Your quantum cart is empty</p>
                    <p style="font-size: 0.9rem; opacity: 0.7;">Add some revolutionary products to get started!</p>
                </div>
            `;
            cartTotal.textContent = '$0.00';
            return;
        }

        const itemsHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">${item.emoji || '🌀'}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="quantumCart.updateQuantity('${item.id}', -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="quantumCart.updateQuantity('${item.id}', 1)">+</button>
                    <button class="remove-btn" onclick="quantumCart.removeItem('${item.id}')">Remove</button>
                </div>
            </div>
        `).join('');

        cartItems.innerHTML = itemsHTML;

        // Calculate total
        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = '$' + total.toLocaleString();
    }

    // Toggle cart visibility
    toggleCart() {
        if (this.isVisible) {
            this.hideCart();
        } else {
            this.showCart();
        }
    }

    showCart() {
        this.isVisible = true;
        const overlay = document.getElementById('quantumCartOverlay');
        overlay.classList.add('visible');
        this.updateCartDisplay();
        
        if (this.sounds.cartOpen) {
            this.sounds.cartOpen();
        }
    }

    hideCart() {
        this.isVisible = false;
        const overlay = document.getElementById('quantumCartOverlay');
        overlay.classList.remove('visible');
        
        if (this.sounds.cartClose) {
            this.sounds.cartClose();
        }
    }

    // Proceed to checkout
    proceedToCheckout() {
        if (this.items.length === 0) {
            this.showNotification('Your cart is empty!');
            return;
        }

        if (this.sounds.checkout) {
            this.sounds.checkout();
        }

        // Store cart for checkout page
        sessionStorage.setItem('checkoutItems', JSON.stringify(this.items));
        
        // Navigate to checkout page
        window.location.href = 'quantum-checkout.html';
    }

    // Show feedback when item is added
    showAddedFeedback() {
        const cartButton = document.getElementById('quantumCartButton');
        cartButton.style.transform = 'scale(1.2)';
        cartButton.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';
        
        setTimeout(() => {
            cartButton.style.transform = 'scale(1)';
            cartButton.style.background = 'linear-gradient(135deg, #00d4ff, #0099cc)';
        }, 300);
    }

    // Show notification
    showNotification(message) {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.cart-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 150px;
            right: 30px;
            background: linear-gradient(135deg, #00d4ff, #0099cc);
            color: #0a0a0a;
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: 600;
            z-index: 10001;
            animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
            box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
        `;

        // Add animation keyframes
        if (!document.querySelector('#cartNotificationStyles')) {
            const style = document.createElement('style');
            style.id = 'cartNotificationStyles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Get cart summary for other pages
    getCartSummary() {
        return {
            items: this.items,
            totalItems: this.items.reduce((sum, item) => sum + item.quantity, 0),
            totalAmount: this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
    }

    // Clear cart
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartBadge();
        this.updateCartDisplay();
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quantumCart = new QuantumCart();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuantumCart;
}

        // Mobile Navigation
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const navLinksItems = document.querySelectorAll('.nav-links li');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // Sticky Header
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            header.classList.toggle('scrolled', window.scrollY > 0);
        });

        // Menu Tabs
        const tabBtns = document.querySelectorAll('.tab-btn');
        const menuItems = document.querySelectorAll('.menu-item');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                tabBtns.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                const category = btn.getAttribute('data-category');
                
                menuItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Quantity Controls
        const quantityMinusBtns = document.querySelectorAll('.quantity-btn.minus');
        const quantityPlusBtns = document.querySelectorAll('.quantity-btn.plus');
        const quantityInputs = document.querySelectorAll('.quantity-input');

        quantityMinusBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                let value = parseInt(quantityInputs[index].value);
                if (value > 1) {
                    quantityInputs[index].value = value - 1;
                }
            });
        });

        quantityPlusBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                let value = parseInt(quantityInputs[index].value);
                quantityInputs[index].value = value + 1;
            });
        });

        // Cart Functionality
        const cart = [];
        const cartIcon = document.getElementById('cart-icon');
        const cartSidebar = document.getElementById('cart-sidebar');
        const closeCart = document.querySelector('.close-cart');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTax = document.getElementById('cart-tax');
        const cartTotal = document.getElementById('cart-total');
        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        const popup = document.getElementById('popup');
        const closePopup = document.querySelector('.close-popup');
        const viewCartBtn = document.querySelector('.view-cart-btn');

        // Add to Cart
        addToCartBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const menuItem = btn.closest('.menu-item');
                const itemName = menuItem.querySelector('h3').textContent;
                const itemPrice = parseFloat(menuItem.querySelector('span').textContent.replace('$', ''));
                const quantity = parseInt(menuItem.querySelector('.quantity-input').value);
                const itemImg = menuItem.querySelector('.menu-item-img img').src;
                
                // Check if item already exists in cart
                const existingItemIndex = cart.findIndex(item => item.name === itemName);
                
                if (existingItemIndex !== -1) {
                    // Update quantity if item exists
                    cart[existingItemIndex].quantity += quantity;
                } else {
                    // Add new item to cart
                    cart.push({
                        name: itemName,
                        price: itemPrice,
                        quantity: quantity,
                        img: itemImg
                    });
                }
                
                updateCart();
                showPopup();
            });
        });

        // Update Cart
        function updateCart() {
            // Clear cart items
            cartItemsContainer.innerHTML = '';
            
            let subtotal = 0;
            
            // Add items to cart
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${item.img}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">
                            <span>${item.name}</span>
                            <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <span class="cart-item-remove" data-index="${index}">Remove</span>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-index="${index}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                            <button class="quantity-btn plus" data-index="${index}">+</button>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
                
                subtotal += item.price * item.quantity;
            });
            
            // Update cart count
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Update totals
            const tax = subtotal * 0.05;
            const total = subtotal + tax;
            
            cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
            cartTax.textContent = `$${tax.toFixed(2)}`;
            cartTotal.textContent = `$${total.toFixed(2)}`;
            
            // Add event listeners to remove buttons
            const removeBtns = document.querySelectorAll('.cart-item-remove');
            removeBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.getAttribute('data-index'));
                    cart.splice(index, 1);
                    updateCart();
                });
            });
            
            // Add event listeners to quantity buttons in cart
            const cartMinusBtns = document.querySelectorAll('.cart-item-quantity .minus');
            const cartPlusBtns = document.querySelectorAll('.cart-item-quantity .plus');
            const cartQuantityInputs = document.querySelectorAll('.cart-item-quantity .quantity-input');
            
            cartMinusBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.getAttribute('data-index'));
                    if (cart[index].quantity > 1) {
                        cart[index].quantity--;
                        updateCart();
                    }
                });
            });
            
            cartPlusBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.getAttribute('data-index'));
                    cart[index].quantity++;
                    updateCart();
                });
            });
            
            cartQuantityInputs.forEach(input => {
                input.addEventListener('change', () => {
                    const index = parseInt(input.closest('.cart-item-quantity').querySelector('.minus').getAttribute('data-index'));
                    const newQuantity = parseInt(input.value);
                    if (newQuantity >= 1) {
                        cart[index].quantity = newQuantity;
                        updateCart();
                    } else {
                        input.value = cart[index].quantity;
                    }
                });
            });
        }

        // Toggle Cart Sidebar
        cartIcon.addEventListener('click', () => {
            cartSidebar.classList.add('active');
        });

        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });

        // Show Popup
        function showPopup() {
            popup.classList.add('active');
            setTimeout(() => {
                popup.classList.remove('active');
            }, 3000);
        }

        closePopup.addEventListener('click', () => {
            popup.classList.remove('active');
        });

        viewCartBtn.addEventListener('click', () => {
            popup.classList.remove('active');
            cartSidebar.classList.add('active');
        });

        // Smooth Scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    
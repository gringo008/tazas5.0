

document.addEventListener('DOMContentLoaded', function() {
    const itemsContainer = document.querySelector('.items');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartIcon = document.getElementById('cart-icon');
    const cartElement = document.getElementById('shopping-cart');
    const closeCartButton = document.getElementById('close-cart');
    const checkoutButton = document.getElementById('checkout-button');

    function loadProducts() {
        const products = JSON.parse(localStorage.getItem('index.html')) || [];

        itemsContainer.innerHTML = '';

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'item';
            productElement.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <div class="content">
                    <div class="title">${product.name}</div>
                    <div class="price">$${product.price}</div>
                    <button class="add-to-cart" data-name="${product.name}" data-image="${product.imageUrl}" data-price="${product.price}">Agregar al Carrito</button>
                </div>
            `;
            itemsContainer.appendChild(productElement);
        });
    }

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;">
                <span>${item.name}</span>
                <span>$${item.price}</span>
                <button class="remove-from-cart" data-name="${item.name}">Eliminar</button>
            `;
            cartItemsContainer.appendChild(itemElement);
            subtotal += item.price;
        });

        cartCount.textContent = cart.length;
        cartSubtotal.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
        cartTotal.textContent = `Total: $${subtotal.toFixed(2)}`;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function toggleCart() {
        cartElement.style.display = cartElement.style.display === 'block' ? 'none' : 'block';
    }

    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart')) {
            const button = event.target;
            const product = {
                name: button.getAttribute('data-name'),
                image: button.getAttribute('data-image'),
                price: parseFloat(button.getAttribute('data-price'))
            };
            cart.push(product);
            updateCart();
        }

        if (event.target.classList.contains('remove-from-cart')) {
            const name = event.target.getAttribute('data-name');
            const index = cart.findIndex(item => item.name === name);
            if (index > -1) {
                cart.splice(index, 1);
                updateCart();
            }
        }
    });

    cartIcon.addEventListener('click', toggleCart);
    closeCartButton.addEventListener('click', toggleCart);

    checkoutButton.addEventListener('click', function() {
        const cartItems = cart.map(item => `${item.name} - $${item.price}`).join(', ');
        const total = cartTotal.textContent.replace('Total: $', '');
        const message = `Hola, me gustaría comprar los siguientes productos: ${cartItems}. El total es $${total}. Método de pago: [ESPECIFICAR MÉTODO]`;
        window.open(`https://api.whatsapp.com/send?phone=YOUR_PHONE_NUMBER&text=${encodeURIComponent(message)}`);
    });

    loadProducts();
    updateCart();
});

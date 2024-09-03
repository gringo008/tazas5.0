document.addEventListener('DOMContentLoaded', function() {
    const saveProductButton = document.getElementById('saveProduct');
    const productList = document.getElementById('productList');
    let editingProductId = null;

    function loadProducts() {
        const products = JSON.parse(localStorage.getItem('index.html')) || [];
        productList.innerHTML = '';
        
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-item';
            productElement.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <div>
                    <strong>${product.name}</strong><br>
                    <small>ID: ${product.id}</small><br>
                    <small>Precio: $${product.price}</small>
                </div>
                <div>
                    <button class="edit-button" data-id="${product.id}">Editar</button>
                    <button class="delete-product" data-id="${product.id}">Eliminar</button>
                </div>
            `;
            productList.appendChild(productElement);
        });

        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                startEditing(productId);
            });
        });

        document.querySelectorAll('.delete-product').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                removeProduct(productId);
            });
        });
    }

    function startEditing(productId) {
        const products = JSON.parse(localStorage.getItem('index.html')) || [];
        const product = products.find(p => p.id === productId);

        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productId').value = product.id;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productImageUrl').value = product.imageUrl;

            editingProductId = productId;
        }
    }

    function saveProduct() {
        const name = document.getElementById('productName').value.trim();
        const id = document.getElementById('productId').value.trim();
        const price = parseFloat(document.getElementById('productPrice').value.trim());
        const imageUrl = document.getElementById('productImageUrl').value.trim();
        const imageFile = document.getElementById('productImageFile').files[0];

        if (!name || !id || isNaN(price)) {
            alert('Por favor, completa todos los campos requeridos.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const products = JSON.parse(localStorage.getItem('index.html')) || [];
            const updatedProducts = products.map(product => {
                if (product.id === editingProductId) {
                    return {
                        name,
                        id,
                        price,
                        imageUrl: imageFile ? event.target.result : imageUrl
                    };
                }
                return product;
            });

            if (!editingProductId) {
                updatedProducts.push({
                    name,
                    id,
                    price,
                    imageUrl: imageFile ? event.target.result : imageUrl
                });
            }

            localStorage.setItem('index.html', JSON.stringify(updatedProducts));
            loadProducts();
            resetForm();
        };

        if (imageFile) {
            reader.readAsDataURL(imageFile);
        } else {
            reader.onload(); // Cargar la imagen URL si no hay archivo
        }
    }

    function removeProduct(productId) {
        let products = JSON.parse(localStorage.getItem('index.html')) || [];
        products = products.filter(product => product.id !== productId);
        localStorage.setItem('index.html', JSON.stringify(products));
        loadProducts();
    }

    function resetForm() {
        document.getElementById('productName').value = '';
        document.getElementById('productId').value = '';
        document.getElementById('productPrice').value = '';
        document.getElementById('productImageUrl').value = '';
        document.getElementById('productImageFile').value = '';
        editingProductId = null;
    }

    saveProductButton.addEventListener('click', saveProduct);
    loadProducts();
});

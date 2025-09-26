document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('bazinCart')) || [];

    function updateCart() {
        document.getElementById('cart-count').textContent = cart.length;
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartModal = document.getElementById('cart-modal');

        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="text-gray-500 text-center py-4">Votre panier est vide</p>';
            cartTotal.textContent = 'XOF 0';
            if(cartModal.querySelector('#proceed-to-payment')){
                cartModal.querySelector('#proceed-to-payment').classList.add('cursor-not-allowed', 'opacity-50');
            }
            localStorage.setItem('bazinCart', JSON.stringify(cart));
            return;
        }

        if(cartModal.querySelector('#proceed-to-payment')){
            cartModal.querySelector('#proceed-to-payment').classList.remove('cursor-not-allowed', 'opacity-50');
        }

        let total = 0;
        cartItems.innerHTML = cart.map((item, index) => {
            total += parseFloat(item.price);
            return `
                <li class="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                        <p class="font-medium">${item.name}</p>
                        <p class="text-sm text-gray-500">XOF ${parseFloat(item.price).toLocaleString('fr-FR')}</p>
                    </div>
                    <button class="remove-item text-red-500 hover:text-red-700" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </li>
            `;
        }).join('');

        cartTotal.textContent = `XOF ${total.toLocaleString('fr-FR')}`;
        localStorage.setItem('bazinCart', JSON.stringify(cart));

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.getAttribute('data-index');
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const productCard = btn.closest('.product-card');
            const productId = productCard.getAttribute('data-product-id');
            const productName = productCard.getAttribute('data-product-name');
            const productPrice = parseFloat(productCard.getAttribute('data-product-price'));

            const product = {
                id: productId,
                name: productName,
                price: productPrice
            };

            cart.push(product);
            updateCart();

            // Show added notification
            const notification = document.createElement('div');
            notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg';
            notification.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-check-circle mr-2"></i>
                    <span>${product.name.toUpperCase()} ajouté au panier!</span>
                </div>
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        });
    });

    document.getElementById('cart-btn').addEventListener('click', () => {
        document.getElementById('cart-modal').classList.remove('hidden');
    });

    document.getElementById('close-cart').addEventListener('click', () => {
        document.getElementById('cart-modal').classList.add('hidden');
    });

    const continueShoppingBtn = document.getElementById('continue-shopping');
    if(continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => {
            document.getElementById('cart-modal').classList.add('hidden');
        });
    }

    const checkoutBtn = document.getElementById('proceed-to-payment');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                alert('Commande initiée! Total: ' + document.getElementById('cart-total').textContent);
                cart = [];
                updateCart();
                document.getElementById('cart-modal').classList.add('hidden');
            } else {
                alert('Votre panier est vide!');
            }
        });
    }

    document.querySelectorAll('.slideshow').forEach(slideshow => {
        const imgs = slideshow.querySelectorAll('img');
        if (imgs.length > 1) {
            slideshow.addEventListener('mouseover', () => {
                imgs[0].classList.remove('active');
                imgs[1].classList.add('active');
            });
            slideshow.addEventListener('mouseout', () => {
                imgs[1].classList.remove('active');
                imgs[0].classList.add('active');
            });
        }
    });

    updateCart();
});
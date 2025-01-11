// Gestion des carrousels
const carousels = document.querySelectorAll('.carousel');

carousels.forEach(carousel => {
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('active');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('active');
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('active');
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // ajuster la vitesse de défilement
        carousel.scrollLeft = scrollLeft - walk;
    });
});

// gestion de la sidebar
const toggleSidebar = document.getElementById('sidebar-toggle');
const closeSidebar = document.getElementById('close-sidebar');
const sidebar = document.querySelector('.sidebar');

if (toggleSidebar && closeSidebar && sidebar) {
    // ouvrir la sidebar
    toggleSidebar.addEventListener('click', () => {
        sidebar.classList.add('visible');
    });

    // fermer la sidebar
    closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('visible');
    });

    // fermer la sidebar en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !toggleSidebar.contains(e.target)) {
            sidebar.classList.remove('visible');
        }
    });
} else {
    console.error("Les éléments nécessaires pour la sidebar n'ont pas été trouvés dans le DOM.");
}

// Vérification des éléments
if (!sidebar || !sidebarToggle || !overlay) {
    console.error('Erreur : Sidebar, toggle ou overlay introuvable.');
}

// Ajout des écouteurs avec logs
sidebarToggle.addEventListener('click', () => {
    console.log('Toggle sidebar');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('visible');
});

overlay.addEventListener('click', () => {
    console.log('Close sidebar');
    sidebar.classList.remove('active');
    overlay.classList.remove('visible');
});

// Gestion du panier avec persistance via localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartCount = document.createElement('span');
cartCount.classList.add('cart-count');
document.querySelector('.icons a[href="#"]').appendChild(cartCount);

updateCartCount();
displayCart();

const buttonsAddToCart = document.querySelectorAll('.product-card button');

buttonsAddToCart.forEach(button => {
    button.addEventListener('click', (e) => {
        const productCard = e.target.parentElement;
        const productName = productCard.querySelector('h3').innerText;
        const productPrice = productCard.querySelector('p').innerText;
        
        const existingProduct = cart.find(item => item.name === productName);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            const product = {
                name: productName,
                price: productPrice,
                quantity: 1
            };
            cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCart();
        alert(`${productName} a été ajouté au panier !`);
    });
});

function updateCartCount() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.innerText = totalItems;
}

function displayCart() {
    const cartContainer = document.querySelector('.cart-container');
    if (!cartContainer) return;

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Votre panier est vide.</p>';
        return;
    }

    cart.forEach(item => {
        const productRow = document.createElement('div');
        productRow.classList.add('cart-item');
        productRow.innerHTML = `
            <span>${item.name}</span>
            <span>${item.price}</span>
            <span>Quantité : 
                <button class="decrease">-</button>
                ${item.quantity}
                <button class="increase">+</button>
            </span>
            <button class="remove">Supprimer</button>
        `;
        
        productRow.querySelector('.decrease').addEventListener('click', () => updateQuantity(item.name, -1));
        productRow.querySelector('.increase').addEventListener('click', () => updateQuantity(item.name, 1));
        productRow.querySelector('.remove').addEventListener('click', () => removeFromCart(item.name));
        
        cartContainer.appendChild(productRow);
    });
}

function updateQuantity(productName, change) {
    const product = cart.find(item => item.name === productName);
    if (!product) return;

    product.quantity += change;
    if (product.quantity <= 0) {
        removeFromCart(productName);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCart();
    }
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// Validation de commande
const orderButton = document.querySelector('.validate-order');
if (orderButton) {
    orderButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Votre panier est vide.');
            return;
        }

        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        const newOrder = {
            id: Date.now(),
            items: [...cart],
            date: new Date().toLocaleString()
        };

        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCart();

        alert('Votre commande a été validée avec succès !');
    });
}

// Affichage de l'historique des commandes
function displayOrders() {
    const ordersContainer = document.querySelector('.orders-container');
    if (!ordersContainer) return;

    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    ordersContainer.innerHTML = '';

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p>Aucune commande passée.</p>';
        return;
    }

    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.classList.add('order-item');
        orderElement.innerHTML = `
            <p>Commande ID: ${order.id}</p>
            <p>Date: ${order.date}</p>
            <ul>
                ${order.items.map(item => `<li>${item.name} - ${item.quantity} x ${item.price}</li>`).join('')}
            </ul>
        `;
        ordersContainer.appendChild(orderElement);
    });
}

displayOrders();

// Gestion de la liste de souhaits
const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
const buttonsAddToWishlist = document.querySelectorAll('.product-card .add-to-wishlist');

buttonsAddToWishlist.forEach(button => {
    button.addEventListener('click', (e) => {
        const productCard = e.target.parentElement;
        const productName = productCard.querySelector('h3').innerText;

        if (!wishlist.includes(productName)) {
            wishlist.push(productName);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            alert(`${productName} a été ajouté à la liste de souhaits !`);
        } else {
            alert(`${productName} est déjà dans la liste de souhaits.`);
        }
    });
});

function displayWishlist() {
    const wishlistContainer = document.querySelector('.wishlist-container');
    if (!wishlistContainer) return;

    wishlistContainer.innerHTML = '';

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p>Votre liste de souhaits est vide.</p>';
        return;
    }

    wishlist.forEach(productName => {
        const productRow = document.createElement('div');
        productRow.classList.add('wishlist-item');
        productRow.innerHTML = `
            <span>${productName}</span>
            <button class="remove-from-wishlist">Supprimer</button>
        `;

        productRow.querySelector('.remove-from-wishlist').addEventListener('click', () => {
            removeFromWishlist(productName);
        });
        wishlistContainer.appendChild(productRow);
    });
}

function removeFromWishlist(productName) {
    const index = wishlist.indexOf(productName);
    if (index > -1) {
        wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        displayWishlist();
    }
}

// Gestion du formulaire de contact
const contactForm = document.querySelector('footer form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    console.log('Message envoyé :', { name, email, message });
    alert('Votre message a bien été envoyé !');
    contactForm.reset();
});

// Gestion des utilisateurs (inscription/connexion)
let currentUser = localStorage.getItem('currentUser');

const accountIcon = document.querySelector('.icons a[href="#account"]');
const accountModal = document.querySelector('.account-modal');
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');

if (currentUser) {
    showLoggedInState();
}

accountIcon.addEventListener('click', () => {
    accountModal.classList.toggle('visible');
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[name="email"]').value;
    const password = loginForm.querySelector('input[name="password"]').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', email);
        currentUser = email;
        showLoggedInState();
        accountModal.classList.remove('visible');
        alert('Connexion réussie !');
    } else {
        alert('Identifiants incorrects');
    }
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = registerForm.querySelector('input[name="email"]').value;
    const password = registerForm.querySelector('input[name="password"]').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.email === email)) {
        alert('Cet email est déjà utilisé.');
        return;
    }

    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    registerForm.reset();
});

function showLoggedInState() {
    accountIcon.innerText = 'Déconnexion';
    accountIcon.addEventListener('click', logout);
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    accountIcon.innerText = 'Compte';
    alert('Déconnexion réussie !');
}

// Affichage initial des listes
displayCart();
displayWishlist();
displayOrders();
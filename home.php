<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vitrine de Vins</title>
    <link rel="stylesheet" href="style.css">
    <script src="wine.js" defer></script>
</head>
<body>
    <!-- Header -->
    <header>
        <div class="header-content">
            <a href="#" id="sidebar-toggle" class="icon">☰</a>
            <input type="text" placeholder="Rechercher un produit..." class="search-bar">
            <div class="icons">
                <a href="#" class="icon">Compte</a>
                <a href="#" class="icon">Panier</a>
                <a href="#" class="icon">Liste de souhaits</a>
            </div>
        </div>
        <h1 class="logo">Vitrine de Vins</h1>
    </header>

    <!-- Sidebar -->
    <aside class="sidebar">
        <button id="close-sidebar">&times;</button>
        <h3>Catégories</h3>
        <ul>
            <?php foreach ($categories as $category): ?>
                <li><a href="#"><?= htmlspecialchars($category) ?></a></li>
            <?php endforeach; ?>
        </ul>
    </aside>

    <!-- Main Content -->
    <main>
        <h2>Produits à la une</h2>
        <div class="carousel">
            <!-- Exemple de produit -->
            <div class="product-card">
                <img src="img/vin1.jpg" alt="Vin rouge">
                <h3>Château Rouge</h3>
                <p>Prix : 25 €</p>
                <button>Ajouter au panier</button>
            </div>
            <!-- Autres produits ici -->
        </div>
    </main>

    <!-- Footer -->
    <footer>
        <div class="footer-content">
            <p>À propos de nous</p>
            <form action="#" method="POST">
                <input type="text" name="name" placeholder="Votre nom">
                <input type="email" name="email" placeholder="Votre email">
                <textarea name="message" placeholder="Votre message"></textarea>
                <button type="submit">Envoyer</button>
            </form>
        </div>
    </footer>
    <script src="wine.js" defer></script>
</body>
</html>
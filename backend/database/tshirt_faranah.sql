CREATE DATABASE IF NOT EXISTS tshirt_faranah;
USE tshirt_faranah;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(250) UNIQUE NOT NULL,
    telephone VARCHAR(20) UNIQUE NOT NULL,
    role ENUM('client', 'admin') DEFAULT 'client',
    password VARCHAR(250) NOT NULL,
    token VARCHAR(250),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- BOUTIQUE 

CREATE TABLE IF NOT EXISTS categories (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nom_categorie VARCHAR(250) NOT NULL,
    photo VARCHAR(255) DEFAULT 'tshirts.jpg',
    description TEXT
);

CREATE TABLE IF NOT EXISTS produits (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom_produit VARCHAR(250) NOT NULL,
    prix DECIMAL(15, 2) NOT NULL,
    quantity INT NOT NULL,
    description TEXT,
    image_produit VARCHAR(250) NOT NULL,
    category_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_produits_categorie FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS commandes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    montant_total DECIMAL(15, 2) NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_commandes_users FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS paniers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom_produit VARCHAR(250) NOT NULL,
    quantity INT NOT NULL,
    taille ENUM('L', 'M', 'XL', 'XXL'),
    montant_total DECIMAL(15, 2) NOT NULL,
    user_id BIGINT DEFAULT NULL,
    produit_id BIGINT NOT NULL,
    token VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_paniers_produits FOREIGN KEY (produit_id) REFERENCES produits(id),
    CONSTRAINT fk_paniers_users FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS details_commandes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    quantity INT NOT NULL,
    taille ENUM('L', 'M', 'XL', 'XXL'),
    prix_total DECIMAL(15, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    produit_id BIGINT NOT NULL,
    commandes_id BIGINT NOT NULL,
    CONSTRAINT fk_detailscommandes_produits FOREIGN KEY (produit_id) REFERENCES produits(id),
    CONSTRAINT fk_detailscommandes_commandes FOREIGN KEY (commandes_id) REFERENCES commandes(id)
);

CREATE TABLE IF NOT EXISTS adresses_livraison (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nom_complet VARCHAR(250) NOT NULL,
    telephone VARCHAR(15) NOT NULL,
    ville VARCHAR(100) NOT NULL,
    adresse_1 VARCHAR(250) NOT NULL,
    adresse_2 VARCHAR(250) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_adresses_users FOREIGN KEY (user_id) REFERENCES users(id)
);


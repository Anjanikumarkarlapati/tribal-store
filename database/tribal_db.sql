-- Tribal MySQL Database Schema
-- Run this file in MySQL Workbench to set up the database

DROP DATABASE IF EXISTS tribal_db;
CREATE DATABASE tribal_db;
USE tribal_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer','artisan','consultant','admin') DEFAULT 'customer',
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artisans table
CREATE TABLE artisans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    tribe VARCHAR(255),
    state VARCHAR(255),
    specialty VARCHAR(255),
    bio TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    total_products INT DEFAULT 0,
    total_sales INT DEFAULT 0,
    avg_rating DECIMAL(3,2) DEFAULT 0.0,
    profile_img VARCHAR(500),
    bank_name VARCHAR(255),
    bank_account VARCHAR(50),
    ifsc_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artisan_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    old_price DECIMAL(10,2),
    category ENUM('pottery','jewelry','art','textile','woodwork') NOT NULL,
    tribe VARCHAR(255),
    state VARCHAR(255),
    img_url VARCHAR(500),
    stock INT DEFAULT 1,
    badge VARCHAR(50),
    avg_stars DECIMAL(2,1) DEFAULT 5.0,
    is_active BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artisan_id) REFERENCES artisans(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending','shipped','delivered','cancelled','refunded') DEFAULT 'pending',
    shipping_address TEXT,
    discount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    artisan_id INT NOT NULL,
    qty INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (artisan_id) REFERENCES artisans(id)
);

-- Reviews table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    customer_id INT NOT NULL,
    order_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Cart table
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    qty INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_cart_item (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Wishlist table
CREATE TABLE wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_wishlist_item (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ============================================================
-- SEED DATA
-- Passwords are all: password123   (bcrypt hash below)
-- ============================================================

INSERT INTO users (name, email, password, role, phone) VALUES
('Admin User',    'admin@tribal.com',  '$2a$10$sloC4xKd4H2zpUbOWOq8Y.fslM1yIqVJAFQ98SMl7B.eLtDckOx16', 'admin',      '9000000001'),
('Sunita Barku',  'sunita@example.com',     '$2a$10$sloC4xKd4H2zpUbOWOq8Y.fslM1yIqVJAFQ98SMl7B.eLtDckOx16', 'artisan',    '9876543210'),
('Ramesh Ganda',  'ramesh@example.com',     '$2a$10$sloC4xKd4H2zpUbOWOq8Y.fslM1yIqVJAFQ98SMl7B.eLtDckOx16', 'artisan',    '8765432109'),
('Kamla Devi',    'kamla@example.com',      '$2a$10$sloC4xKd4H2zpUbOWOq8Y.fslM1yIqVJAFQ98SMl7B.eLtDckOx16', 'artisan',    '7654321098'),
('Arjun Mehta',   'arjun@example.com',      '$2a$10$sloC4xKd4H2zpUbOWOq8Y.fslM1yIqVJAFQ98SMl7B.eLtDckOx16', 'customer',   '9123456789'),
('Lakshmi Devi',  'lakshmi@example.com',    '$2a$10$sloC4xKd4H2zpUbOWOq8Y.fslM1yIqVJAFQ98SMl7B.eLtDckOx16', 'artisan',    '6543210987'),
('Naveen Gond',   'naveen@example.com',     '$2a$10$sloC4xKd4H2zpUbOWOq8Y.fslM1yIqVJAFQ98SMl7B.eLtDckOx16', 'artisan',    '5432109876'),
('Bhil Ram',      'bhil@example.com',       '$2a$10$sloC4xKd4H2zpUbOWOq8Y.fslM1yIqVJAFQ98SMl7B.eLtDckOx16', 'artisan',    '4321098765');

INSERT INTO artisans (user_id, tribe, state, specialty, bio, is_approved, total_products, total_sales, avg_rating, profile_img) VALUES
(2, 'Warli Tribe',     'Maharashtra',    'Warli Paintings',      'Third-generation Warli painter from Palghar district.',          TRUE, 5, 25, 4.8, 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&q=80'),
(3, 'Bastar Tribe',    'Chhattisgarh',   'Dhokra Metal Casting', 'Master of the ancient lost-wax casting technique.',              TRUE, 8, 42, 4.9, 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400&q=80'),
(4, 'Mithila Community','Bihar',         'Madhubani Paintings',  'Known for vibrant Madhubani art depicting nature and mythology.', TRUE, 24, 187, 4.7, 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&q=80'),
(6, 'Toda Tribe',      'Tamil Nadu',     'Embroidered Textiles', 'Expert in traditional Toda red-and-black embroidery.',           TRUE, 12, 65, 4.9, 'https://images.unsplash.com/photo-1623358051666-6b2158659103?w=400&q=80'),
(7, 'Gond Tribe',      'Madhya Pradesh', 'Gond Art',             'Renowned Gond artist capturing folklore elements of nature.',    TRUE, 15, 80, 4.8, 'https://images.unsplash.com/photo-1600375990578-8ba943ae5ae5?w=400&q=80'),
(8, 'Bhil Tribe',      'Rajasthan',      'Beaded Jewelry',       'Creating intricate tribal beaded jewelry for two decades.',      TRUE, 9, 30, 4.7, 'https://images.unsplash.com/photo-1582234373497-6a56e2eb9d9b?w=400&q=80');

INSERT INTO products (artisan_id, name, description, price, old_price, category, tribe, state, img_url, badge, avg_stars, stock, is_approved) VALUES
(1, 'Warli Painted Pot',      'Hand-painted Warli motifs on river clay. A 2,500 year old tradition from Maharashtra.',         1200.00, 1500.00, 'pottery',  'Warli Tribe',      'Maharashtra',  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=80', 'Bestseller', 5.0, 10, TRUE),
(1, 'Warli Village Wall Art', 'Large canvas depicting village life in classic Warli white-on-terracotta style.',                2800.00, NULL,    'art',      'Warli Tribe',      'Maharashtra',  'https://images.unsplash.com/photo-1578926288207-a90a5e9c9f3a?w=500&q=80', NULL,         4.8,  5, TRUE),
(2, 'Dhokra Bell Pendant',    'Ancient lost-wax brass casting. No two pieces are identical — a one-of-a-kind heirloom.',          850.00, NULL,    'jewelry',  'Bastar Tribe',     'Chhattisgarh', 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500&q=80', NULL,         5.0,  5, TRUE),
(2, 'Tribal Brass Figurine',  'A dancing Gond figure cast in brass using 5,000 year old Dhokra technique.',                    3200.00, 3800.00, 'art',      'Bastar Tribe',     'Chhattisgarh', 'https://images.unsplash.com/photo-1559181567-c3190b60b13d?w=500&q=80', 'Rare',       4.9,  3, TRUE),
(3, 'Madhubani Fish Painting','Traditional Mithila fish motifs in natural pigments on handmade paper.',                        1500.00, NULL,    'art',      'Mithila Community','Bihar',        'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=500&q=80', NULL,         4.7,  8, TRUE),
(3, 'Silk Madhubani Stole',   'Hand-painted Madhubani design on pure silk — wearable art from Bihar.',                         4500.00, 5000.00, 'textile',  'Mithila Community','Bihar',        'https://images.unsplash.com/photo-1603189042162-8d01aa08b604?w=500&q=80', 'New',        4.8,  4, TRUE),
(2, 'Carved Wooden Panel',    'Intricately carved teak wood depicting Bastar tribal folklore.',                                5200.00, 6000.00, 'woodwork', 'Bastar Tribe',     'Chhattisgarh', 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&q=80', 'Artisan Choice', 4.9, 2, TRUE),
(4, 'Toda Embroidered Shawl', 'Authentic red and black thread embroidery on white cotton fabric.',                             3500.00, 4000.00, 'textile',  'Toda Tribe',       'Tamil Nadu',   'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=500&q=80', 'Featured',   5.0, 15, TRUE),
(4, 'Toda Pukhoor Bag',       'A traditional sling bag showcasing intricate geometrical embroidery.',                          1200.00, NULL,    'textile',  'Toda Tribe',       'Tamil Nadu',   'https://images.unsplash.com/photo-1620000628383-7f2ded41c59c?w=500&q=80', NULL,         4.8, 10, TRUE),
(5, 'Gond Tree of Life',      'A vibrant Gond painting showcasing the interconnectedness of forest life.',                     4500.00, 5200.00, 'art',      'Gond Tribe',       'Madhya Pradesh','https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=500&q=80', 'Bestseller', 4.9, 5,  TRUE),
(5, 'Tiger Motif Gond Art',   'A detailed painting of the mystical Gond tiger.',                                               3000.00, NULL,    'art',      'Gond Tribe',       'Madhya Pradesh','https://images.unsplash.com/photo-1606868306217-dbf5046868d2?w=500&q=80', NULL,         4.7, 3,  TRUE),
(6, 'Bhil Beaded Necklace',   'Hand-strung colorful glass beads forming a traditional ceremonial necklace.',                   950.00,  1200.00, 'jewelry',  'Bhil Tribe',       'Rajasthan',    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80', 'New',        4.8, 20, TRUE),
(6, 'Silver Ghungroo Anklet', 'Heavy oxidized silver anklet with tiny bells, traditionally worn by Bhil women.',               2800.00, NULL,    'jewelry',  'Bhil Tribe',       'Rajasthan',    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80', 'Classic',    4.9, 8,  TRUE),
(1, 'Terracotta Serving Bowl', 'Rustic red clay serving bowl baked in an earth-pit kiln.',                                     600.00,  NULL,    'pottery',  'Warli Tribe',      'Maharashtra',  'https://images.unsplash.com/photo-1610700084795-95027fc6479b?w=500&q=80', NULL,         4.6, 25, TRUE),
(2, 'Brass Owl Figurine',     'Small intricately cast Dhokra owl, symbolizing wisdom and protection.',                         1500.00, 1800.00, 'woodwork', 'Bastar Tribe',     'Chhattisgarh', 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&q=80', 'Top Rated',  4.9, 12, TRUE),
(1, 'Wooden Tribal Mask',     'Carved wooden mask used in traditional village harvest dances.',                                2200.00, NULL,    'woodwork', 'Warli Tribe',      'Maharashtra',  'https://images.unsplash.com/photo-1541312567258-3604b732e4d0?w=500&q=80', NULL,         4.7, 5,  TRUE),
(3, 'Handloom Cotton Saree',  'Woven pure cotton saree featuring vibrant traditional borders.',                                3800.00, 4200.00, 'textile',  'Mithila Community','Bihar',        'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=500&q=80', 'Popular',    4.8, 7,  TRUE);


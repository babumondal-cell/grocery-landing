-- Run this in your Supabase Dashboard → SQL Editor

-- 1. Create tables
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'bg-green-100',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL,
  badge TEXT,
  category_id INTEGER,
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
  review_count INTEGER NOT NULL DEFAULT 0,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  is_organic BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Seed categories
INSERT INTO categories (name, image, color) VALUES
  ('Fresh Fruits',  '/images/cat-fruits.png',  'bg-orange-100'),
  ('Vegetables',    '/images/cat-veg.png',      'bg-green-100'),
  ('Dairy & Eggs',  '/images/cat-dairy.png',    'bg-blue-100'),
  ('Bakery',        '/images/cat-bakery.png',   'bg-amber-100'),
  ('Premium Meat',  '/images/cat-meat.png',     'bg-red-100')
ON CONFLICT DO NOTHING;

-- 3. Seed products
INSERT INTO products (name, image, price, unit, badge, category_id, rating, review_count, in_stock, is_organic, is_featured) VALUES
  ('Hass Avocados',       '/images/prod-avocado.png', 4.99, 'per pack of 4',     'Organic',    1, 4.9, 42, TRUE, TRUE,  TRUE),
  ('Artisanal Sourdough', '/images/prod-bread.png',   6.49, 'per loaf',          'Fresh Baked',4, 4.8, 38, TRUE, FALSE, TRUE),
  ('Farm Fresh Eggs',     '/images/prod-eggs.png',    5.99, 'per dozen',         'Local',      3, 4.9, 57, TRUE, FALSE, TRUE),
  ('Whole Milk',          '/images/prod-milk.png',    3.49, 'per glass bottle',  'Grass-fed',  3, 4.7, 29, TRUE, FALSE, TRUE),
  ('Baby Spinach',        '/images/cat-veg.png',      3.99, 'per 200g bag',      'Organic',    2, 4.8, 33, TRUE, TRUE,  FALSE),
  ('Cheddar Cheese',      '/images/cat-dairy.png',    5.49, 'per 250g block',    'Artisan',    3, 4.6, 21, TRUE, FALSE, FALSE),
  ('Ribeye Steak',        '/images/cat-meat.png',    18.99, 'per 300g',          'Premium',    5, 4.9, 15, TRUE, FALSE, FALSE),
  ('Blueberries',         '/images/cat-fruits.png',   4.49, 'per punnet',        'Seasonal',   1, 4.7, 44, TRUE, TRUE,  FALSE)
ON CONFLICT DO NOTHING;

-- 4. Enable Row Level Security (allow public reads, restrict writes)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Service role all on cart" ON cart_items USING (true) WITH CHECK (true);

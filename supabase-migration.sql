-- ============================================================
--  Petrolia Liquor Store — Products Table Migration
--  Run this in your Supabase SQL Editor
-- ============================================================

-- Drop old table if it exists (handles schema mismatch from old seed)
DROP TABLE IF EXISTS products CASCADE;

-- Create the products table matching Product interface exactly
CREATE TABLE products (
  id            TEXT        PRIMARY KEY,
  name          TEXT        NOT NULL DEFAULT '',
  price         NUMERIC(10,2) NOT NULL DEFAULT 0,
  category      TEXT        NOT NULL DEFAULT '',
  subcategory   TEXT        NOT NULL DEFAULT '',
  country       TEXT        NOT NULL DEFAULT '',
  size          TEXT        NOT NULL DEFAULT '',
  type          TEXT        NOT NULL DEFAULT '',
  image_url     TEXT        NOT NULL DEFAULT '',
  description   TEXT        NOT NULL DEFAULT '',
  in_stock      BOOLEAN     NOT NULL DEFAULT TRUE,
  featured      BOOLEAN     NOT NULL DEFAULT FALSE,
  is_new        BOOLEAN     NOT NULL DEFAULT FALSE,
  is_petrolia_pick BOOLEAN  NOT NULL DEFAULT FALSE,
  is_miscellaneous BOOLEAN  NOT NULL DEFAULT FALSE,
  created_at    TEXT        NOT NULL DEFAULT ''
);

-- Indexes for common queries
CREATE INDEX idx_products_category    ON products(category);
CREATE INDEX idx_products_featured    ON products(featured);
CREATE INDEX idx_products_in_stock    ON products(in_stock);
CREATE INDEX idx_products_is_new      ON products(is_new);
CREATE INDEX idx_products_is_misc     ON products(is_miscellaneous);

-- Disable Row Level Security so the anon key can read/write freely.
-- Our own admin JWT middleware handles access control at the API layer.
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

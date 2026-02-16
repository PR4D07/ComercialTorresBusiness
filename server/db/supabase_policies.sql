-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 1. Users
-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Admins can read all users
CREATE POLICY "Admins can read all users" ON users
  FOR ALL USING (
    exists (select 1 from users where id = auth.uid() and role = 'admin')
  );

-- 2. Products & Categories (Public Read, Admin Write)
CREATE POLICY "Public read products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Admin all products" ON products
  FOR ALL USING (
    exists (select 1 from users where id = auth.uid() and role = 'admin')
  );

CREATE POLICY "Public read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admin all categories" ON categories
  FOR ALL USING (
    exists (select 1 from users where id = auth.uid() and role = 'admin')
  );

-- 3. Inventory (Public Read, Admin Write)
CREATE POLICY "Public read inventory" ON inventory
  FOR SELECT USING (true);

CREATE POLICY "Admin all inventory" ON inventory
  FOR ALL USING (
    exists (select 1 from users where id = auth.uid() and role = 'admin')
  );

-- 4. Carts (Anon access)
-- Allow anon users to create carts
CREATE POLICY "Anon can create carts" ON carts
  FOR INSERT WITH CHECK (true);

-- Allow users to read/update their own carts (simplified for anon: allowing public access for now if needed, 
-- or strictly enforcing ID match if the client sends the ID. 
-- For anon persistence, usually we trust the client's claimed ID or use a secure cookie.
-- Here we allow public access for simplicity based on the prompt's implication of 'anon' usage, 
-- but in production restrict this.)
CREATE POLICY "Public cart access" ON carts
  FOR ALL USING (true);

CREATE POLICY "Public cart items access" ON cart_items
  FOR ALL USING (true);

-- 5. Orders
-- Users read own orders
CREATE POLICY "Users read own orders" ON orders
  FOR SELECT USING (
    auth.uid() in (select user_id from customers where id = customer_id)
  );

-- Admins read all
CREATE POLICY "Admins read all orders" ON orders
  FOR ALL USING (
    exists (select 1 from users where id = auth.uid() and role = 'admin')
  );

-- 6. Events (Public Insert for tracking)
CREATE POLICY "Public insert events" ON events
  FOR INSERT WITH CHECK (true);

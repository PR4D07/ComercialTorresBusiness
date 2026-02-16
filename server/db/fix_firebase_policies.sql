-- 1. Eliminar políticas que dependen de auth.uid() (que devuelve UUID)
-- Porque vamos a cambiar los IDs a TEXT y auth.uid() fallará al comparar
DROP POLICY IF EXISTS "Customer can view own profile" ON customers;
DROP POLICY IF EXISTS "Customer can update own profile" ON customers;
DROP POLICY IF EXISTS "Customer can view own orders" ON orders;
DROP POLICY IF EXISTS "Customer can insert own orders" ON orders;
DROP POLICY IF EXISTS "Customer can view own order items" ON order_items;
DROP POLICY IF EXISTS "Customer can view own cart" ON carts;
DROP POLICY IF EXISTS "Customer can insert own cart" ON carts;
DROP POLICY IF EXISTS "Customer can view own cart items" ON cart_items;

-- 2. Eliminar restricciones FK conflictivas
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_user_id_fkey;
ALTER TABLE carts DROP CONSTRAINT IF EXISTS carts_customer_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_user_id_fkey;
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_customer_id_fkey;

-- 3. Cambiar tipos a TEXT
ALTER TABLE users ALTER COLUMN id TYPE text;
ALTER TABLE customers ALTER COLUMN user_id TYPE text;
ALTER TABLE customers ALTER COLUMN id TYPE text; 
ALTER TABLE carts ALTER COLUMN customer_id TYPE text;
ALTER TABLE orders ALTER COLUMN customer_id TYPE text;
ALTER TABLE events ALTER COLUMN user_id TYPE text;
ALTER TABLE events ALTER COLUMN customer_id TYPE text;

-- 4. Restaurar restricciones FK
ALTER TABLE customers ADD CONSTRAINT customers_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE carts ADD CONSTRAINT carts_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
ALTER TABLE orders ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
ALTER TABLE events ADD CONSTRAINT events_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE events ADD CONSTRAINT events_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);

-- 5. Recrear políticas usando casting explícito para compatibilidad con Firebase UIDs
-- Nota: auth.uid() devuelve UUID. Al compararlo con columnas TEXT, necesitamos castearlo o usar auth.jwt()->>'sub'

CREATE POLICY "Customer can view own profile" ON customers FOR SELECT TO authenticated USING (auth.uid()::text = user_id);
CREATE POLICY "Customer can update own profile" ON customers FOR UPDATE TO authenticated USING (auth.uid()::text = user_id);

CREATE POLICY "Customer can view own orders" ON orders FOR SELECT TO authenticated USING (customer_id = auth.uid()::text);
CREATE POLICY "Customer can insert own orders" ON orders FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid()::text);

CREATE POLICY "Customer can view own order items" ON order_items FOR SELECT TO authenticated USING (order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid()::text));

CREATE POLICY "Customer can view own cart" ON carts FOR SELECT TO authenticated USING (customer_id = auth.uid()::text);
CREATE POLICY "Customer can insert own cart" ON carts FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid()::text);

CREATE POLICY "Customer can view own cart items" ON cart_items FOR SELECT TO authenticated USING (cart_id IN (SELECT id FROM carts WHERE customer_id = auth.uid()::text));

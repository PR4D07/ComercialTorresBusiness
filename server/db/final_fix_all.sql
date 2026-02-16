BEGIN;

-- 1. Eliminar TODAS las políticas que dependen de user_id/customer_id para permitir el cambio de tipo
DROP POLICY IF EXISTS "Customer can view own profile" ON customers;
DROP POLICY IF EXISTS "Customer can update own profile" ON customers;
DROP POLICY IF EXISTS "Customer can view own orders" ON orders;
DROP POLICY IF EXISTS "Customer can insert own orders" ON orders;
DROP POLICY IF EXISTS "Customer can view own order items" ON order_items;
DROP POLICY IF EXISTS "Customer can view own cart" ON carts;
DROP POLICY IF EXISTS "Customer can insert own cart" ON carts;
DROP POLICY IF EXISTS "Customer can view own cart items" ON cart_items;
DROP POLICY IF EXISTS "Allow public insert customers" ON customers;
DROP POLICY IF EXISTS "Allow public select customers" ON customers;
DROP POLICY IF EXISTS "Allow public insert users" ON users;
DROP POLICY IF EXISTS "Allow public select users" ON users;

-- 2. Eliminar restricciones de llave foránea temporalmente
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_user_id_fkey;
ALTER TABLE carts DROP CONSTRAINT IF EXISTS carts_customer_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_user_id_fkey;
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_customer_id_fkey;

-- 3. CAMBIAR TIPOS A TEXT (Ahora sí debería funcionar sin bloqueos)
ALTER TABLE users ALTER COLUMN id TYPE text;
ALTER TABLE customers ALTER COLUMN user_id TYPE text;
ALTER TABLE customers ALTER COLUMN id TYPE text;
ALTER TABLE carts ALTER COLUMN customer_id TYPE text;
ALTER TABLE orders ALTER COLUMN customer_id TYPE text;
ALTER TABLE events ALTER COLUMN user_id TYPE text;
ALTER TABLE events ALTER COLUMN customer_id TYPE text;

-- 4. Restaurar restricciones de llave foránea
ALTER TABLE customers ADD CONSTRAINT customers_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE carts ADD CONSTRAINT carts_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
ALTER TABLE orders ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
ALTER TABLE events ADD CONSTRAINT events_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE events ADD CONSTRAINT events_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);

-- 5. Recrear Políticas Esenciales (usando casting explícito ::text para auth.uid())
-- Public insert policies para sincronización inicial
CREATE POLICY "Allow public insert users" ON users FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public select users" ON users FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert customers" ON customers FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public select customers" ON customers FOR SELECT TO public USING (true);

-- Políticas de seguridad para usuarios autenticados
CREATE POLICY "Customer can view own profile" ON customers FOR SELECT TO authenticated USING (auth.uid()::text = user_id);
CREATE POLICY "Customer can update own profile" ON customers FOR UPDATE TO authenticated USING (auth.uid()::text = user_id);
CREATE POLICY "Customer can view own orders" ON orders FOR SELECT TO authenticated USING (customer_id = auth.uid()::text);

COMMIT;

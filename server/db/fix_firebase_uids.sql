-- 1. Deshabilitar temporalmente las restricciones (FK) para poder cambiar tipos
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_user_id_fkey;
ALTER TABLE carts DROP CONSTRAINT IF EXISTS carts_customer_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;

-- 2. Cambiar los tipos de datos de UUID a TEXT (para soportar Firebase UIDs)
-- Usamos USING para convertir los valores existentes (si los hay)
ALTER TABLE users ALTER COLUMN id TYPE text;
ALTER TABLE customers ALTER COLUMN user_id TYPE text;
ALTER TABLE customers ALTER COLUMN id TYPE text; -- También cambiamos ID de customer a texto para simplificar
ALTER TABLE carts ALTER COLUMN customer_id TYPE text;
ALTER TABLE orders ALTER COLUMN customer_id TYPE text;
ALTER TABLE events ALTER COLUMN user_id TYPE text;
ALTER TABLE events ALTER COLUMN customer_id TYPE text;

-- 3. Volver a crear las restricciones (Foreign Keys) ahora que los tipos coinciden
ALTER TABLE customers 
    ADD CONSTRAINT customers_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE carts 
    ADD CONSTRAINT carts_customer_id_fkey 
    FOREIGN KEY (customer_id) REFERENCES customers(id); -- Nota: customer_id en carts ahora referencia customers.id (que es texto)

ALTER TABLE orders 
    ADD CONSTRAINT orders_customer_id_fkey 
    FOREIGN KEY (customer_id) REFERENCES customers(id);

-- 4. Actualizar políticas RLS para que funcionen con TEXT
-- (Las políticas anteriores usaban auth.uid() que devuelve UUID en Supabase Auth, 
-- pero aquí usaremos un claim personalizado o simplemente confiaremos en la API por ahora)
-- NOTA: Al usar Firebase, la autenticación la maneja tu Backend, así que el RLS 
-- puede ser más permisivo si usas la Service Role Key desde el servidor, 
-- o necesitarás pasar el UID en el JWT si usas cliente directo.

-- Por ahora, aseguramos que la columna 'role' en users siga funcionando
-- (No requiere cambios de SQL, solo lógica de aplicación)

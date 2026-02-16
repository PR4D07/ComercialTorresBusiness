-- Script de Diagnóstico y Reparación Definitiva
-- Ejecuta esto para asegurar que la columna ID sea TEXT y permitir inserciones

BEGIN;

-- 1. Eliminar restricciones que puedan bloquear el cambio de tipo
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_user_id_fkey;
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_user_id_fkey;
-- (Agrega aquí otras tablas si existen que referencien a users.id)

-- 2. Asegurar que users.id sea TEXT
ALTER TABLE users ALTER COLUMN id TYPE text;

-- 3. Asegurar que customers.user_id sea TEXT
ALTER TABLE customers ALTER COLUMN user_id TYPE text;

-- 4. Restaurar las restricciones
ALTER TABLE customers 
    ADD CONSTRAINT customers_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE events 
    ADD CONSTRAINT events_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id);

-- 5. Verificar y Asegurar Políticas de Inserción Pública
DROP POLICY IF EXISTS "Allow public insert users" ON users;
CREATE POLICY "Allow public insert users" ON users FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select users" ON users;
CREATE POLICY "Allow public select users" ON users FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public insert customers" ON customers;
CREATE POLICY "Allow public insert customers" ON customers FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select customers" ON customers;
CREATE POLICY "Allow public select customers" ON customers FOR SELECT TO public USING (true);

COMMIT;

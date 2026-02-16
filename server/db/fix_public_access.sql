-- Allow public (anon) read access to products and categories
-- This is required for the public website to display products without user login
-- and for the backend to fetch products using the Anon Key.

-- 1. Drop existing restrictive policies if they conflict (optional, but cleaner)
-- drop policy "Allow read products" on products;
-- drop policy "Allow read categories" on categories;

-- 2. Create policies for ANON and AUTHENTICATED
create policy "Public read products" 
on products 
for select 
to anon, authenticated 
using (true);

create policy "Public read categories" 
on categories 
for select 
to anon, authenticated 
using (true);

-- 3. Allow Anon to insert Events (for tracking)
create policy "Public insert events" 
on events 
for insert 
to anon, authenticated 
with check (true);

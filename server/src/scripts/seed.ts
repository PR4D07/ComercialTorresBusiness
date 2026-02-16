import { supabase } from '../infrastructure/config/supabase';

const products = [
    {
        id: 1,
        brand: 'North Star',
        name: 'Zapatillas Urbanas Hombre',
        priceOld: 129.90,
        priceNew: 77.94,
        badge: { type: 'discount', text: '-40%' },
        category: 'HOMBRE',
        imageUrl: '/products/ns-urban.jpg'
    },
    {
        id: 2,
        brand: 'Bata Comfit',
        name: 'Sandalias Casual Mujer',
        priceNew: 89.90,
        badge: { type: 'new', text: 'NUEVO' },
        category: 'MUJER',
        imageUrl: '/products/bata-comfit.jpg'
    },
    {
        id: 3,
        brand: 'Bubblegummers',
        name: 'Zapatillas Escolares Niños',
        priceOld: 99.90,
        priceNew: 79.92,
        badge: { type: 'discount', text: '-20%' },
        category: 'INFANTIL',
        imageUrl: '/products/bg-school.jpg'
    },
    {
        id: 4,
        brand: 'Power',
        name: 'Zapatillas Deportivas Running',
        priceNew: 149.90,
        category: 'HOMBRE',
        imageUrl: '/products/power-run.jpg'
    },
    {
        id: 5,
        brand: 'Bata',
        name: 'Tacones Elegantes',
        priceNew: 199.90,
        category: 'MUJER',
        imageUrl: '/products/bata-heels.jpg'
    },
    {
        id: 6,
        brand: 'Bubblegummers',
        name: 'Botas de Lluvia',
        priceNew: 59.90,
        category: 'INFANTIL',
        imageUrl: '/products/bg-boots.jpg'
    },
    {
        id: 7,
        brand: 'Weinbrenner',
        name: 'Zapatos punta de acero',
        priceNew: 249.90,
        category: 'HOMBRE',
        imageUrl: '/products/wb-steel.jpg'
    },
    {
        id: 8,
        brand: 'Weinbrenner',
        name: 'Botas de seguridad',
        priceNew: 289.90,
        badge: { type: 'new', text: 'NUEVO' },
        category: 'HOMBRE',
        imageUrl: '/products/wb-boots.jpg'
    }
];

async function seed() {
    console.log('🌱 Starting seed...');

    for (const p of products) {
        // 1. Handle Category
        let categoryId;
        const { data: existingCat, error: catError } = await supabase
            .from('categories')
            .select('id')
            .eq('name', p.category)
            .single();

        if (existingCat) {
            categoryId = existingCat.id;
        } else {
            const { data: newCat, error: createCatError } = await supabase
                .from('categories')
                .insert({ name: p.category, description: `Categoría ${p.category}` })
                .select()
                .single();
            
            if (createCatError) {
                console.error(`Error creating category ${p.category}:`, createCatError.message);
                continue;
            }
            categoryId = newCat.id;
        }

        // 2. Insert Product
        // Check if exists by name to avoid duplicates during dev
        const { data: existingProd } = await supabase
            .from('products')
            .select('id')
            .eq('name', p.name)
            .single();

        let productId;

        if (existingProd) {
            console.log(`Product ${p.name} already exists, skipping insert.`);
            productId = existingProd.id;
        } else {
            const { data: newProd, error: prodError } = await supabase
                .from('products')
                .insert({
                    name: p.name,
                    brand: p.brand,
                    price_old: p.priceOld,
                    price_new: p.priceNew,
                    badge_type: p.badge?.type,
                    badge_text: p.badge?.text,
                    image_url: p.imageUrl,
                    category_id: categoryId
                })
                .select()
                .single();

            if (prodError) {
                console.error(`Error creating product ${p.name}:`, prodError.message);
                continue;
            }
            productId = newProd.id;
            console.log(`Created product: ${p.name}`);
        }

        // 3. Inventory
        const { data: inventory } = await supabase
            .from('inventory')
            .select('id')
            .eq('product_id', productId)
            .single();

        if (!inventory) {
            await supabase.from('inventory').insert({
                product_id: productId,
                stock: 50 // Default stock
            });
            console.log(`Added inventory for ${p.name}`);
        }
    }

    console.log('✅ Seed completed!');
}

seed().catch(console.error);

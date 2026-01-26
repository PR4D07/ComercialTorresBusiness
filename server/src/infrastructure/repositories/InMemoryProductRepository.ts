import { Product, ProductRepository, ProductCriteria } from "../../core/domain/Product";

export class InMemoryProductRepository implements ProductRepository {
    private products: Product[] = [
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

    async findAll(criteria?: ProductCriteria): Promise<Product[]> {
        let filtered = this.products;

        if (criteria) {
            if (criteria.category) {
                filtered = filtered.filter(p => p.category === criteria.category);
            }
            if (criteria.search) {
                const searchLower = criteria.search.toLowerCase();
                filtered = filtered.filter(p => 
                    p.name.toLowerCase().includes(searchLower) || 
                    p.brand.toLowerCase().includes(searchLower)
                );
            }
        }

        return filtered;
    }

    async findById(id: number): Promise<Product | null> {
        return this.products.find(p => p.id === id) || null;
    }

    async save(product: Product): Promise<Product> {
        this.products.push(product);
        return product;
    }
}

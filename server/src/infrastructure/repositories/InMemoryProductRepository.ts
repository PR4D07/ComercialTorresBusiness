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
            imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.pCPpMJaJQLbw5S1UzDMogwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'
        },
        {
            id: 2,
            brand: 'Bata Comfit',
            name: 'Sandalias Casual Mujer',
            priceNew: 89.90,
            badge: { type: 'new', text: 'NUEVO' },
            category: 'MUJER',
            imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.XrH9881MEhRzD_jRhakg9AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'
        },
        {
            id: 3,
            brand: 'Bubblegummers',
            name: 'Zapatillas Escolares Niños',
            priceOld: 99.90,
            priceNew: 79.92,
            badge: { type: 'discount', text: '-20%' },
            category: 'INFANTIL',
            imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.akawXAeSU_Hyr5Ikui7qgAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'
        },
        {
            id: 4,
            brand: 'Power',
            name: 'Zapatillas Deportivas Running',
            priceNew: 149.90,
            category: 'HOMBRE',
            imageUrl: 'https://th.bing.com/th/id/R.8d1c54d1941bed624306b0a5bb322e58?rik=SWyBz2MkzywPiQ&pid=ImgRaw&r=0'
        },
        {
            id: 5,
            brand: 'Bata',
            name: 'Tacones Elegantes',
            priceNew: 199.90,
            category: 'MUJER',
            imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.u7Cj3yU4IGC6hp4us8p3WQHaLH?rs=1&pid=ImgDetMain&o=7&rm=3'
        },
        {
            id: 6,
            brand: 'Bubblegummers',
            name: 'Botas de Lluvia',
            priceNew: 59.90,
            category: 'INFANTIL',
            imageUrl: 'https://c.pxhere.com/photos/6f/73/boots_rubber_galoshes_waders_footwear_wet_rainy_puddle-1150336.jpg!d'
        },
        {
            id: 7,
            brand: 'Weinbrenner',
            name: 'Zapatos punta de acero',
            priceNew: 249.90,
            category: 'HOMBRE',
            imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.4jH-xqPu1ORMpXVFsk0SFQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'
        },
        {
            id: 8,
            brand: 'Weinbrenner',
            name: 'Botas de seguridad',
            priceNew: 289.90,
            badge: { type: 'new', text: 'NUEVO' },
            category: 'HOMBRE',
            imageUrl: 'https://tse2.mm.bing.net/th/id/OIP.udFfOtjsSMjo8S9zKK5wXgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'
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

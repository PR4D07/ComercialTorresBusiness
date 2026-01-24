export interface Product {
    id: number;
    name: string;
    brand: string;
    priceOld?: number;
    priceNew: number;
    badge?: {
        type: 'discount' | 'new';
        text: string;
    };
    imageUrl?: string;
    category?: string; // Added category
}

export interface ProductCriteria {
    category?: string;
    search?: string;
}

export interface ProductRepository {
    findAll(criteria?: ProductCriteria): Promise<Product[]>;
    findById(id: number): Promise<Product | null>;
    save(product: Product): Promise<Product>;
}

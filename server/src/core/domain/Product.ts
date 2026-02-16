export interface Product {
  id: number;
  name: string;
  brand: string;
  priceOld?: number;
  priceNew: number;
  category?: string;
  badge?: {
    type: 'discount' | 'new';
    text: string;
  };
  imageUrl?: string;
}

export interface ProductCriteria {
  search?: string;
  category?: string;
}

export interface ProductRepository {
  findAll(criteria?: ProductCriteria): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  save(product: Product): Promise<Product>;
}


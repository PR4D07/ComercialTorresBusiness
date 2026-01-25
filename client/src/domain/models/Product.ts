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
}

export interface ProductCriteria {
  search?: string;
  category?: string;
}

export interface ProductRepository {
  getProducts(criteria?: ProductCriteria): Promise<Product[]>;
}

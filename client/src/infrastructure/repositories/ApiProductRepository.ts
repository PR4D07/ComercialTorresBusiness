import type { Product, ProductCriteria, ProductRepository } from '../../domain/models/Product';

export class ApiProductRepository implements ProductRepository {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  }

  async getProducts(criteria?: ProductCriteria): Promise<Product[]> {
    const queryParams = new URLSearchParams();
    
    if (criteria?.search) {
      queryParams.append('search', criteria.search);
    }
    
    if (criteria?.category) {
      queryParams.append('category', criteria.category);
    }

    const response = await fetch(`${this.baseUrl}/products?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  }
}

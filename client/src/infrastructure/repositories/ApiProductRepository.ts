import type { Product, ProductCriteria, ProductRepository } from '../../domain/models/Product';

export class ApiProductRepository implements ProductRepository {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    let url = baseUrl || import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    
    // Remove trailing slash if present
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }

    // Append /api if not present and not localhost (localhost default already has it)
    // We assume that if the user provides a production URL like onrender.com, it should end with /api
    // This is a heuristic to fix common configuration errors
    if (!url.endsWith('/api') && !url.includes('localhost')) {
      url += '/api';
    }

    this.baseUrl = url;
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

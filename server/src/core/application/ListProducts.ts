import type { Product, ProductCriteria, ProductRepository } from '../domain/Product';

export class ListProducts {
  private repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.repository = repository;
  }

  async execute(criteria?: ProductCriteria): Promise<Product[]> {
    return this.repository.findAll(criteria);
  }
}


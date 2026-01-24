import { Product, ProductRepository, ProductCriteria } from "../domain/Product";

export class ListProducts {
    constructor(private readonly repository: ProductRepository) {}

    async execute(criteria?: ProductCriteria): Promise<Product[]> {
        return this.repository.findAll(criteria);
    }
}

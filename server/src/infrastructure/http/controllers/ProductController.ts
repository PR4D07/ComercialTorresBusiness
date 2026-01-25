import { Request, Response } from 'express';
import { ListProducts } from '../../../core/application/ListProducts';
import { InMemoryProductRepository } from '../../repositories/InMemoryProductRepository';
import { ProductCriteria } from '../../../core/domain/Product';

const productRepository = new InMemoryProductRepository();
const listProducts = new ListProducts(productRepository);

export class ProductController {
    async getProducts(req: Request, res: Response) {
        try {
            const criteria: ProductCriteria = {};
            
            if (req.query.category) {
                criteria.category = req.query.category as string;
            }
            
            if (req.query.search) {
                criteria.search = req.query.search as string;
            }

            const products = await listProducts.execute(criteria);
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching products' });
        }
    }
}

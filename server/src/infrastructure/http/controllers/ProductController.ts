import { Request, Response } from 'express';
import { ListProducts } from '../../../core/application/ListProducts';
import { SupabaseProductRepository } from '../../repositories/SupabaseProductRepository';
import { ProductCriteria } from '../../../core/domain/Product';

const productRepository = new SupabaseProductRepository();
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

    async getProductById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!Number.isFinite(id)) {
                return res.status(400).json({ message: 'Invalid product id' });
            }

            const product = await productRepository.findById(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.json(product);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching product' });
        }
    }
}

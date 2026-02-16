import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const router = Router();
const productController = new ProductController();

router.get('/products', (req, res) => productController.getProducts(req, res));
router.get('/products/:id', (req, res) => productController.getProductById(req, res));

export default router;

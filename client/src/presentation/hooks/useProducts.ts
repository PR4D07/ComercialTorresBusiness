import { useState, useEffect } from 'react';
import type { Product } from '../../domain/models/Product';
import { ApiProductRepository } from '../../infrastructure/repositories/ApiProductRepository';
import { useFilter } from '../context/FilterContext';

const repository = new ApiProductRepository();

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get filter state from context
  const { search, category } = useFilter();

  useEffect(() => {
    setLoading(true);
    repository.getProducts({ search, category })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('Error al cargar productos');
        setLoading(false);
      });
  }, [search, category]);

  return { products, loading, error, search, category };
}

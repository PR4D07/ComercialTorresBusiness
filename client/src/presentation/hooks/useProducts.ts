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
    let isCancelled = false;
    setLoading(true);
    setError(null);

    repository.getProducts({ search, category })
      .then(data => {
        if (isCancelled) return;
        setProducts(data);
      })
      .catch(err => {
        if (isCancelled) return;
        console.error('Error fetching products:', err);
        setError('Error al cargar productos');
      })
      .finally(() => {
        if (isCancelled) return;
        setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [search, category]);

  return { products, loading, error, search, category };
}

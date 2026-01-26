import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext';
import { ProductCard } from './ProductCard';
import './ProductList.css';

export default function ProductList() {
  const { products, loading, error, search, category } = useProducts();
  const { addToCart } = useCart();

  if (loading) return <p className="loading-msg">Cargando productos...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <section className="container products-section">
      <h2 className="section-title">
        {search ? `Resultados para "${search}"` : 
         category ? category : 'RECOMENDADOS PARA TI'}
      </h2>
      
      {products.length === 0 ? (
        <p className="empty-msg">No se encontraron productos.</p>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={() => addToCart({
                id: product.id,
                name: product.name,
                price: product.priceNew,
                imageUrl: product.imageUrl
              })}
            />
          ))}
        </div>
      )}
    </section>
  );
}

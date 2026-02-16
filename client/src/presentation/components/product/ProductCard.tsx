import type { Product } from '../../../domain/models/Product';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const navigate = useNavigate();

  const handleOpenDetail = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <article className="product-card" onClick={handleOpenDetail}>
      {product.badge && (
        <div className={`badge ${product.badge.type}`}>
          {product.badge.text}
        </div>
      )}
      <div className="product-image">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="img-fluid"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <div className="img-placeholder"></div>
        )}
      </div>
      <div className="product-info">
        <span className="brand">{product.brand}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="prices">
          {product.priceOld && (
            <span className="price-old">S/ {product.priceOld.toFixed(2)}</span>
          )}
          <span className="price-new">S/ {product.priceNew.toFixed(2)}</span>
        </div>
        <button
          className="btn-add"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenDetail();
          }}
        >
          VER DETALLES
        </button>
      </div>
    </article>
  );
}

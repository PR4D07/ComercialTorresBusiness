import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product } from '../../domain/models/Product';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        if (apiUrl.endsWith('/')) {
          apiUrl = apiUrl.slice(0, -1);
        }
        if (!apiUrl.endsWith('/api') && !apiUrl.includes('localhost')) {
          apiUrl += '/api';
        }
        const res = await fetch(`${apiUrl}/products/${id}`);
        if (!res.ok) {
          throw new Error('No se pudo cargar el producto');
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la información del producto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!size || !color) {
      setValidationError('Debes seleccionar la talla y el color antes de agregar al carrito.');
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona talla y color',
        text: 'Debes seleccionar la talla y el color antes de agregar el producto al carrito.',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    setValidationError(null);

    addToCart({
      id: product.id,
      name: product.name,
      price: product.priceNew,
      imageUrl: product.imageUrl,
      size,
      color
    });
  };

  if (loading) {
    return <div className="product-detail container">Cargando producto...</div>;
  }

  if (error || !product) {
    return (
      <div className="product-detail container">
        <p className="error-msg">{error || 'Producto no encontrado.'}</p>
        <button className="btn-secondary" onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  const sizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43'];
  const colors = ['Negro', 'Marrón', 'Blanco', 'Rojo', 'Azul'];
  const isVariantMissing = !size || !color;

  return (
    <div className="product-detail container">
      <button className="back-link" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left" /> Volver a productos
      </button>

      <div className="product-detail-content">
        <div className="image-column">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <div className="img-placeholder" />
          )}
        </div>
        <div className="info-column">
          <span className="brand">COMERCIAL TORRES</span>
          <h1 className="name">{product.name}</h1>
          {product.category && (
            <p className="category">Categoría: {product.category}</p>
          )}

          <div className="prices">
            {product.priceOld && (
              <span className="price-old">S/ {product.priceOld.toFixed(2)}</span>
            )}
            <span className="price-new">S/ {product.priceNew.toFixed(2)}</span>
          </div>

          <div className="options">
            <div className="option-group">
              <label>Talla</label>
              <div className="chips">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`chip ${size === s ? 'selected' : ''}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="option-group">
              <label>Color</label>
              <div className="chips">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`chip ${color === c ? 'selected' : ''}`}
                    onClick={() => setColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            className={`btn-primary full-width ${isVariantMissing ? 'btn-missing-variant' : ''}`}
            onClick={handleAddToCart}
          >
            AGREGAR AL CARRITO
          </button>

          {validationError && (
            <div className="variant-alert">
              {validationError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

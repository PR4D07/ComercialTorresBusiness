import { useCart } from '../../context/CartContext';
import './FloatingCartButton.css';

export default function FloatingCartButton() {
  const { toggleCart, count } = useCart();

  return (
    <button className="floating-cart-btn" onClick={toggleCart} aria-label="Abrir carrito">
      <i className="fas fa-shopping-cart"></i>
      {count > 0 && <span className="cart-badge">{count}</span>}
    </button>
  );
}

import { useCart } from '../../context/CartContext';
import './FloatingCartButton.css';

export default function FloatingCartButton() {
  const { toggleCart, count, isCartOpen } = useCart();

  return (
    <button 
      className={`floating-cart-btn ${isCartOpen ? 'shifted' : ''}`} 
      onClick={toggleCart} 
      aria-label={isCartOpen ? "Cerrar carrito" : "Abrir carrito"}
    >
      <i className={`fas ${isCartOpen ? 'fa-times' : 'fa-shopping-cart'}`}></i>
      {!isCartOpen && count > 0 && <span className="cart-badge">{count}</span>}
    </button>
  );
}

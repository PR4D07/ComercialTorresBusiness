import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartSidebar.css';

export default function CartSidebar() {
  const { cart, removeFromCart, toggleCart, isCartOpen, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  return (
    <>
      {isCartOpen && <div className="cart-overlay" onClick={toggleCart}></div>}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Tu Carrito</h3>
          <button className="close-btn" onClick={toggleCart}>&times;</button>
        </div>
        
        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-msg">Tu carrito está vacío.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <div className="placeholder"></div>
                  )}
                </div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>S/ {item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <button 
                  className="remove-btn" 
                  onClick={() => removeFromCart(item.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="total">
            <span>Total:</span>
            <span>S/ {total.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            FINALIZAR COMPRA
          </button>
        </div>
      </div>
    </>
  );
}

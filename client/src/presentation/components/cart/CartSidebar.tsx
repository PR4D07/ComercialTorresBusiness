import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useCart } from '../../context/CartContext';
import './CartSidebar.css';

export default function CartSidebar() {
  const { cart, removeFromCart, toggleCart, isCartOpen, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      Swal.fire({
        title: 'Tu carrito está vacío',
        text: 'Agrega al menos un producto antes de finalizar la compra.',
        icon: 'info',
        confirmButtonColor: '#E3000F',
        confirmButtonText: 'Ver productos'
      }).then(() => {
        toggleCart();
        navigate('/');
      });
      return;
    }

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
                  {(item.size || item.color) && (
                    <p className="item-variant">
                      {item.size && <>Talla: {item.size} </>}
                      {item.color && <>| Color: {item.color}</>}
                    </p>
                  )}
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

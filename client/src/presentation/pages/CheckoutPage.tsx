import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cart, total, addToCart } = useCart();
  const { products } = useProducts();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('¡Pago procesado con éxito!');
  };

  // Filter products to show recommendations (exclude items already in cart)
  const recommendations = products
    .filter(p => !cart.some(item => item.id === p.id))
    .slice(0, 4);

  return (
    <div className="checkout-page container">
      <h1>Finalizar Compra</h1>
      
      <div className="checkout-content">
        <div className="checkout-form-section">
          <h2>Datos de Envío y Pago</h2>
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Apellidos</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Dirección</label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Ciudad</label>
              <input 
                type="text" 
                name="city" 
                value={formData.city} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <h3>Método de Pago</h3>
            <div className="form-group">
              <label>Número de Tarjeta</label>
              <input 
                type="text" 
                name="cardNumber" 
                placeholder="0000 0000 0000 0000"
                value={formData.cardNumber} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Vencimiento</label>
                <input 
                  type="text" 
                  name="expiryDate" 
                  placeholder="MM/YY"
                  value={formData.expiryDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input 
                  type="text" 
                  name="cvv" 
                  placeholder="123"
                  value={formData.cvv} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="pay-btn">
              Pagar S/ {total.toFixed(2)}
            </button>
          </form>
        </div>
        
        <div className="order-summary">
          <h2>Resumen del Pedido</h2>
          <div className="summary-items">
            {cart.map(item => (
              <div key={item.id} className="summary-item">
                <div className="summary-img">
                   {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <div className="placeholder"></div>}
                </div>
                <div className="summary-details">
                  <p className="name">{item.name}</p>
                  <p className="price">S/ {item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <div className="summary-total">
                  S/ {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="summary-total-row">
            <span>Total a Pagar:</span>
            <span>S/ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="upsell-section">
          <h2>Quizá lo olvidaste</h2>
          <div className="product-grid">
            {recommendations.map(product => (
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
        </div>
      )}
    </div>
  );
}
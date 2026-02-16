import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import Swal from 'sweetalert2';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/product/ProductCard';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, total, addToCart, clearCart } = useCart();
  const { products } = useProducts();
  const { user, loading } = useAuth();
  
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

  // Verify authentication and auto-fill data
  useEffect(() => {
    if (!loading) {
      if (!user) {
        Swal.fire({
          title: 'Inicia sesión',
          text: 'Debes iniciar sesión para finalizar tu compra.',
          icon: 'warning',
          confirmButtonColor: '#E3000F',
          confirmButtonText: 'Ir a Login'
        }).then(() => {
          navigate('/login', { state: { from: '/checkout' } });
        });
      } else {
        const names = user.displayName ? user.displayName.split(' ') : ['', ''];
        setFormData(prev => ({
          ...prev,
          firstName: names[0] || '',
          lastName: names.slice(1).join(' ') || '',
          email: user.email || ''
        }));
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user && cart.length === 0) {
      Swal.fire({
        title: 'Tu carrito está vacío',
        text: 'Agrega al menos un producto antes de finalizar tu compra.',
        icon: 'info',
        confirmButtonColor: '#E3000F',
        confirmButtonText: 'Ver productos'
      }).then(() => {
        navigate('/');
      });
    }
  }, [cart.length, loading, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateReceipt = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(227, 0, 15); // Primary Red
    doc.text('Comercial Torres', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Boleta de Venta Electrónica', 105, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 105, 40, { align: 'center' });
    doc.text(`ID Transacción: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 105, 45, { align: 'center' });

    // Customer Details
    doc.line(20, 50, 190, 50);
    doc.setFontSize(12);
    doc.text('Datos del Cliente:', 20, 60);
    doc.setFontSize(10);
    doc.text(`Nombre: ${formData.firstName} ${formData.lastName}`, 20, 70);
    doc.text(`Email: ${formData.email}`, 20, 75);
    doc.text(`Dirección: ${formData.address}, ${formData.city}`, 20, 80);

    // Order Items
    doc.line(20, 85, 190, 85);
    let yPos = 95;
    
    // Table Header
    doc.setFont('helvetica', 'bold');
    doc.text('Producto', 20, yPos);
    doc.text('Cant.', 140, yPos);
    doc.text('Precio', 160, yPos);
    doc.text('Total', 180, yPos);
    doc.setFont('helvetica', 'normal');
    
    yPos += 10;
    
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      // Truncate long names
      const name = item.name.length > 40 ? item.name.substring(0, 37) + '...' : item.name;
      
      doc.text(name, 20, yPos);
      doc.text(item.quantity.toString(), 145, yPos);
      doc.text(`S/ ${item.price.toFixed(2)}`, 160, yPos);
      doc.text(`S/ ${itemTotal.toFixed(2)}`, 180, yPos);
      
      yPos += 10;
    });

    // Total
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL A PAGAR: S/ ${total.toFixed(2)}`, 190, yPos, { align: 'right' });

    // Footer
    yPos += 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('¡Gracias por tu compra!', 105, yPos, { align: 'center' });
    
    // Save PDF
    doc.save('Boleta-ComercialTorres.pdf');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing
    setTimeout(() => {
      generateReceipt();
      clearCart(); // Clear the cart
      Swal.fire({
        title: '¡Pago Exitoso!',
        text: 'Tu boleta se descargará automáticamente.',
        icon: 'success',
        confirmButtonColor: '#E3000F',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        navigate('/');
      });
    }, 1500);
  };

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  // If user is not logged in, we render nothing while redirecting (handled by useEffect)
  if (!user) {
    return null;
  }

  if (cart.length === 0) {
    return null;
  }

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

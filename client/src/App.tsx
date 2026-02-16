import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './presentation/components/layout/Header';
import Footer from './presentation/components/layout/Footer';
import HomePage from './presentation/pages/HomePage';
import UserPanelPage from './presentation/pages/UserPanelPage';
import LoginPage from './presentation/pages/LoginPage';
import AboutPage from './presentation/pages/AboutPage';
import CheckoutPage from './presentation/pages/CheckoutPage';
import ProductDetailPage from './presentation/pages/ProductDetailPage';
import CartSidebar from './presentation/components/cart/CartSidebar';
import FloatingCartButton from './presentation/components/cart/FloatingCartButton';
import { CartProvider } from './presentation/context/CartContext';
import { FilterProvider } from './presentation/context/FilterContext';
import { AuthProvider } from './presentation/context/AuthContext';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <FilterProvider>
            <div className="app">
              <Header />
              <CartSidebar />
              <FloatingCartButton />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/profile" element={<UserPanelPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
              </Routes>
              <Footer />
            </div>
          </FilterProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

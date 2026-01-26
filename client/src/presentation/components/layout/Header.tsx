import { Link } from 'react-router-dom';
import './Header.css';
import { useCart } from '../../context/CartContext';
import { useFilter } from '../../context/FilterContext';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { toggleCart } = useCart();
  const { setSearch, setCategory, category } = useFilter();
  const { user } = useAuth();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCategory = (cat: string) => {
    setCategory(cat);
  };

  return (
    <>
      <div className="top-bar">
        <p>¡ENVÍO GRATIS POR COMPRAS MAYORES A S/ 199!</p>
      </div>
      <header className="main-header">
        <div className="container header-content">
          <div className="logo">
            <Link to="/" onClick={() => handleCategory('')}>
              <img src="/logo.png" alt="Comercial Torres" />
              <span className="logo-text">Comercial Torres</span>
            </Link>
          </div>

          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Buscar productos, marcas y más..." 
              onChange={handleSearch}
            />
            <button><i className="fas fa-search"></i></button>
          </div>

          <div className="user-actions">
            {user ? (
              <Link to="/profile">
                <i className="far fa-user"></i> <span>{user.displayName?.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link to="/login">
                <i className="far fa-user"></i> <span>Ingresar</span>
              </Link>
            )}
            
            <a href="#" onClick={(e) => { e.preventDefault(); toggleCart(); }}>
              <i className="fas fa-shopping-bag"></i> 
              <span>Carrito</span>
            </a>
          </div>
        </div>
      </header>
      <nav className="main-nav">
        <div className="container">
          <ul>
            <li><Link to="/" className={category === '' ? 'active' : ''} onClick={() => handleCategory('')}>TODOS</Link></li>
            <li><Link to="/" className={category === 'MUJER' ? 'active' : ''} onClick={() => handleCategory('MUJER')}>MUJER</Link></li>
            <li><Link to="/" className={category === 'HOMBRE' ? 'active' : ''} onClick={() => handleCategory('HOMBRE')}>HOMBRE</Link></li>
            <li><Link to="/" className={category === 'INFANTIL' ? 'active' : ''} onClick={() => handleCategory('INFANTIL')}>INFANTIL</Link></li>
            <li><Link to="/about">NOSOTROS</Link></li>
          </ul>
        </div>
      </nav>
    </>
  );
}

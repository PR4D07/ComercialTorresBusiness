import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import './UserPanel.css';

export default function UserPanelPage() {
  const { user, loading, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Cargando...</div>;
  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfile user={user} />;
      case 'orders':
        return <UserOrders />;
      case 'addresses':
        return <UserAddresses />;
      case 'admin':
        return isAdmin ? <AnalyticsDashboard /> : <div>Acceso denegado</div>;
      default:
        return <UserProfile user={user} />;
    }
  };

  return (
    <div className="container user-panel-page">
      <aside className="user-sidebar">
        <div className="user-info-summary">
          {user.photoURL && !imageError ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              className="avatar-img" 
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="avatar-placeholder">{user.displayName?.charAt(0)}</div>
          )}
          <h3>{user.displayName}</h3>
          <p>{user.email}</p>
          {isAdmin && <span className="badge-admin">Administrador</span>}
        </div>
        <nav className="user-nav">
          <button 
            className={activeTab === 'profile' ? 'active' : ''} 
            onClick={() => setActiveTab('profile')}
          >
            <i className="far fa-user"></i> Mi Perfil
          </button>
          
          {isAdmin && (
            <button 
                className={activeTab === 'admin' ? 'active' : ''} 
                onClick={() => setActiveTab('admin')}
            >
                <i className="fas fa-chart-line"></i> Métricas
            </button>
          )}

          <button 
            className={activeTab === 'orders' ? 'active' : ''} 
            onClick={() => setActiveTab('orders')}
          >
            <i className="fas fa-box"></i> Mis Pedidos
          </button>
          <button 
            className={activeTab === 'addresses' ? 'active' : ''} 
            onClick={() => setActiveTab('addresses')}
          >
            <i className="fas fa-map-marker-alt"></i> Direcciones
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
          </button>
        </nav>
      </aside>
      <main className="user-content">
        {renderContent()}
      </main>
    </div>
  );
}

function UserProfile({ user }: { user: any }) {
  return (
    <div className="panel-section">
      <h2>Mi Perfil</h2>
      <form className="user-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Nombre Completo</label>
          <input type="text" defaultValue={user.displayName} />
        </div>
        <div className="form-group">
          <label>Correo Electrónico</label>
          <input type="email" defaultValue={user.email} disabled />
        </div>
        <div className="form-group">
          <label>Teléfono</label>
          <input type="tel" defaultValue={user.phoneNumber || ''} placeholder="Agregar teléfono" />
        </div>
        <button className="btn-save">Guardar Cambios</button>
      </form>
    </div>
  );
}

function UserOrders() {
  return (
    <div className="panel-section">
      <h2>Pedidos (Próximamente)</h2>
      <p>
        Por ahora no realizamos delivery ni gestionamos pedidos en línea desde la web.
      </p>
      <p>
        Puedes visitarnos en tienda física para realizar tus compras. 
        Esta sección se habilitará más adelante cuando activemos los pedidos en línea.
      </p>
    </div>
  );
}

function UserAddresses() {
  return (
    <div className="panel-section">
      <h2>Mis Direcciones</h2>
      <div className="address-card">
        <div className="address-icon"><i className="fas fa-home"></i></div>
        <div className="address-info">
          <h4>Casa</h4>
          <p>Av. Principal 123, Lima, Perú</p>
          <p>Ref: Frente al parque</p>
        </div>
        <div className="address-actions">
          <button>Editar</button>
          <button>Eliminar</button>
        </div>
      </div>
      <button className="btn-add-address">+ Agregar Nueva Dirección</button>
    </div>
  );
}

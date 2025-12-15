import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Package, ShoppingCart, Users, BarChart3, LogOut, Bell } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: BarChart3, label: 'Dashboard' },
    { path: '/inventario', icon: Package, label: 'Gestión de Inventario' },
    { path: '/ventas', icon: ShoppingCart, label: 'Gestión de Ventas' },
    { path: '/clientes', icon: Users, label: 'Gestión de Clientes' },
    { path: '/reportes', icon: BarChart3, label: 'Reportes y Estadísticas' },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Rico Encanto</h1>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <h2>Rico Encanto</h2>
          </div>
          <div className="header-right">
            <button className="icon-btn" title="Notificaciones">
              <Bell size={20} />
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Salir
            </button>
          </div>
        </header>

        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

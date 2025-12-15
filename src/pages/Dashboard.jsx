import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { dashboardAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    ventasDelDia: 30000,
    productosStockBajo: 5,
    totalClientes: 120,
    ventasRecientes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Cargando...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">
        <h1 className="page-title">Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <h3>Ventas del Día</h3>
            </div>
            <p className="stat-value">{formatCurrency(stats.ventasDelDia)}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h3>Productos con Stock Bajo</h3>
            </div>
            <p className="stat-value">{stats.productosStockBajo}</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h3>Total de Clientes</h3>
            </div>
            <p className="stat-value">{stats.totalClientes}</p>
          </div>
        </div>

        <div className="recent-sales">
          <h2 className="section-title">Ventas Recientes</h2>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.ventasRecientes.slice(0, 5).map((venta) => (
                  venta.productos?.map((producto, idx) => (
                    <tr key={`${venta.id}-${idx}`}>
                      <td>{producto.nombre || 'Chocolate'}</td>
                      <td>{producto.cantidad}</td>
                      <td>{formatCurrency(producto.precioUnitario)}</td>
                      <td>{formatCurrency(producto.cantidad * producto.precioUnitario)}</td>
                    </tr>
                  ))
                ))}
                {stats.ventasRecientes.length === 0 && (
                  <>
                    <tr>
                      <td>Chocolate</td>
                      <td>2</td>
                      <td>{formatCurrency(5000)}</td>
                      <td>{formatCurrency(10000)}</td>
                    </tr>
                    <tr>
                      <td>Queso con bocadillo</td>
                      <td>10</td>
                      <td>{formatCurrency(5000)}</td>
                      <td>{formatCurrency(100000)}</td>
                    </tr>
                    <tr>
                      <td>Maracuya</td>
                      <td>5</td>
                      <td>{formatCurrency(5000)}</td>
                      <td>{formatCurrency(25000)}</td>
                    </tr>
                    <tr>
                      <td>Gelatina mosaico</td>
                      <td>8</td>
                      <td>{formatCurrency(3000)}</td>
                      <td>{formatCurrency(24000)}</td>
                    </tr>
                    <tr>
                      <td>Chocorramo</td>
                      <td>1</td>
                      <td>{formatCurrency(5000)}</td>
                      <td>{formatCurrency(50000)}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

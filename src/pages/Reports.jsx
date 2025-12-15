import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { dashboardAPI } from '../services/api';
import { BarChart3 } from 'lucide-react';
import './Reports.css';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadReports();
  }, [dateRange]);

  const loadReports = async () => {
    try {
      const response = await dashboardAPI.getReports(dateRange);
      setReportData(response.data);
    } catch (error) {
      console.error('Error loading reports:', error);
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
        <div className="loading">Cargando reportes...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="reports-page">
        <div className="page-header">
          <h1 className="page-title">Reportes y Estadísticas</h1>
        </div>

        <div className="filters-card">
          <div className="form-group">
            <label>Fecha Inicio</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Fecha Fin</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <BarChart3 size={24} />
            </div>
            <div className="stat-content">
              <h3>Total Ventas</h3>
              <p className="stat-value">{reportData?.totalVentas || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <BarChart3 size={24} />
            </div>
            <div className="stat-content">
              <h3>Ingresos Totales</h3>
              <p className="stat-value">{formatCurrency(reportData?.ingresos || 0)}</p>
            </div>
          </div>
        </div>

        <div className="report-section">
          <h2>Productos Más Vendidos</h2>
          <div className="products-list">
            {reportData?.productosMasVendidos?.length > 0 ? (
              reportData.productosMasVendidos.map((product, index) => (
                <div key={index} className="product-item">
                  <span className="product-name">{product.nombre}</span>
                  <span className="product-quantity">{product.cantidad} unidades</span>
                </div>
              ))
            ) : (
              <p>No hay datos disponibles</p>
            )}
          </div>
        </div>

        <div className="report-section">
          <h2>Ventas por Estado</h2>
          <div className="status-grid">
            {reportData?.ventasPorEstado && Object.entries(reportData.ventasPorEstado).map(([estado, cantidad]) => (
              <div key={estado} className="status-item">
                <span className="status-label">{estado}</span>
                <span className="status-count">{cantidad}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;

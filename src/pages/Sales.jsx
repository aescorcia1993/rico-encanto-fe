import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { salesAPI, productsAPI, clientsAPI } from '../services/api';
import { Search, Plus, X } from 'lucide-react';
import './Sales.css';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    cliente: '',
    clienteId: '',
    productos: [],
    estado: 'Pendiente'
  });
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadSales();
  }, [search]);

  useEffect(() => {
    if (showModal) {
      loadProducts();
      loadClients();
    }
  }, [showModal]);

  const loadSales = async () => {
    try {
      const response = await salesAPI.getAll({ search });
      setSales(response.data);
    } catch (error) {
      console.error('Error loading sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data.filter(p => p.estado === 'Disponible'));
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadClients = async () => {
    try {
      const response = await clientsAPI.getAll();
      setClients(response.data);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleAddProduct = () => {
    if (!selectedProduct || quantity < 1) {
      alert('Selecciona un producto y cantidad válida');
      return;
    }

    const product = products.find(p => p.id === parseInt(selectedProduct));
    if (!product) return;

    if (quantity > product.stock) {
      alert(`Stock insuficiente. Disponible: ${product.stock}`);
      return;
    }

    const existingProduct = formData.productos.find(p => p.productoId === product.id);
    
    if (existingProduct) {
      // Actualizar cantidad si ya existe
      setFormData({
        ...formData,
        productos: formData.productos.map(p =>
          p.productoId === product.id
            ? { ...p, cantidad: p.cantidad + quantity }
            : p
        )
      });
    } else {
      // Agregar nuevo producto
      setFormData({
        ...formData,
        productos: [
          ...formData.productos,
          {
            productoId: product.id,
            nombre: product.nombre,
            cantidad: quantity,
            precioUnitario: product.precio
          }
        ]
      });
    }

    setSelectedProduct('');
    setQuantity(1);
  };

  const handleRemoveProduct = (productoId) => {
    setFormData({
      ...formData,
      productos: formData.productos.filter(p => p.productoId !== productoId)
    });
  };

  const calculateTotal = () => {
    return formData.productos.reduce((sum, p) => sum + (p.cantidad * p.precioUnitario), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.productos.length === 0) {
      alert('Agrega al menos un producto');
      return;
    }

    if (!formData.cliente) {
      alert('Selecciona o ingresa un cliente');
      return;
    }

    try {
      await salesAPI.create(formData);
      setShowModal(false);
      resetForm();
      loadSales();
    } catch (error) {
      console.error('Error creating sale:', error);
      alert(error.response?.data?.error || 'Error al crear la venta');
    }
  };

  const resetForm = () => {
    setFormData({
      cliente: '',
      clienteId: '',
      productos: [],
      estado: 'Pendiente'
    });
    setSelectedProduct('');
    setQuantity(1);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusClass = (estado) => {
    switch (estado.toLowerCase()) {
      case 'completada':
        return 'completada';
      case 'pendiente':
        return 'pendiente';
      case 'cancelada':
        return 'cancelada';
      default:
        return '';
    }
  };

  return (
    <Layout>
      <div className="sales-page">
        <div className="page-header">
          <h1 className="page-title">Gestión de Ventas</h1>
          <button 
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <Plus size={20} />
            Nueva Venta
          </button>
        </div>

        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar ventas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID de Venta</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>Cargando...</td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No se encontraron ventas</td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id}>
                    <td>#{sale.id}</td>
                    <td>{sale.cliente}</td>
                    <td>{formatDate(sale.fecha)}</td>
                    <td>{formatCurrency(sale.total)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(sale.estado)}`}>
                        {sale.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
              <h2>Nueva Venta</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Cliente</label>
                  <select
                    value={formData.clienteId}
                    onChange={(e) => {
                      const clientId = e.target.value;
                      const client = clients.find(c => c.id === parseInt(clientId));
                      setFormData({
                        ...formData,
                        clienteId: clientId,
                        cliente: client ? client.nombre : ''
                      });
                    }}
                    required
                  >
                    <option value="">Seleccionar cliente...</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-section">
                  <h3>Agregar Productos</h3>
                  <div className="form-row">
                    <div className="form-group" style={{ flex: 2 }}>
                      <label>Producto</label>
                      <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                      >
                        <option value="">Seleccionar producto...</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.nombre} - ${product.precio.toLocaleString()} (Stock: {product.stock})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      />
                    </div>

                    <div className="form-group" style={{ alignSelf: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleAddProduct}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>

                {formData.productos.length > 0 && (
                  <div className="products-list">
                    <h3>Productos en la Venta</h3>
                    <table className="mini-table">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Precio Unit.</th>
                          <th>Subtotal</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.productos.map((producto, index) => (
                          <tr key={index}>
                            <td>{producto.nombre}</td>
                            <td>{producto.cantidad}</td>
                            <td>{formatCurrency(producto.precioUnitario)}</td>
                            <td>{formatCurrency(producto.cantidad * producto.precioUnitario)}</td>
                            <td>
                              <button
                                type="button"
                                className="btn-icon btn-danger"
                                onClick={() => handleRemoveProduct(producto.productoId)}
                              >
                                <X size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="total-row">
                          <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                            Total:
                          </td>
                          <td style={{ fontWeight: 'bold', fontSize: '18px' }}>
                            {formatCurrency(calculateTotal())}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Completada">Completada</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Crear Venta
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Sales;

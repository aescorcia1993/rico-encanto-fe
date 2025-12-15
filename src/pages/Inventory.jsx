import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { productsAPI } from '../services/api';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import './Inventory.css';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    stock: '',
    precio: '',
    estado: 'Disponible'
  });

  useEffect(() => {
    loadProducts();
  }, [search]);

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll(search);
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, formData);
      } else {
        await productsAPI.create(formData);
      }
      
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ nombre: '', stock: '', precio: '', estado: 'Disponible' });
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      stock: product.stock,
      precio: product.precio,
      estado: product.estado
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        await productsAPI.delete(id);
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <Layout>
      <div className="inventory-page">
        <div className="page-header">
          <h1 className="page-title">Gestión de Inventario</h1>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setEditingProduct(null);
              setFormData({ nombre: '', stock: '', precio: '', estado: 'Disponible' });
              setShowModal(true);
            }}
          >
            <Plus size={20} />
            Añadir Producto
          </button>
        </div>

        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre del Producto</th>
                <th>Stock Actual</th>
                <th>Precio de Venta</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>Cargando...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No se encontraron productos</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.nombre}</td>
                    <td>{product.stock}</td>
                    <td>{formatCurrency(product.precio)}</td>
                    <td>
                      <span className={`status-badge ${product.estado.toLowerCase()}`}>
                        {product.estado}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(product)}
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="btn-icon btn-danger"
                          onClick={() => handleDelete(product.id)}
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{editingProduct ? 'Editar Producto' : 'Añadir Producto'}</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nombre del Producto</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Precio</label>
                    <input
                      type="number"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Agotado">Agotado</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Actualizar' : 'Guardar'}
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

export default Inventory;

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { clientsAPI } from '../services/api';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import './Clients.css';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });

  useEffect(() => {
    loadClients();
  }, [search]);

  const loadClients = async () => {
    try {
      const response = await clientsAPI.getAll(search);
      setClients(response.data);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingClient) {
        await clientsAPI.update(editingClient.id, formData);
      } else {
        await clientsAPI.create(formData);
      }
      
      setShowModal(false);
      setEditingClient(null);
      setFormData({ nombre: '', email: '', telefono: '' });
      loadClients();
    } catch (error) {
      console.error('Error saving client:', error);
      alert(error.response?.data?.error || 'Error al guardar el cliente');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      nombre: client.nombre,
      email: client.email,
      telefono: client.telefono
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        await clientsAPI.delete(id);
        loadClients();
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Error al eliminar el cliente');
      }
    }
  };

  return (
    <Layout>
      <div className="clients-page">
        <div className="page-header">
          <h1 className="page-title">Gestión de Clientes</h1>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setEditingClient(null);
              setFormData({ nombre: '', email: '', telefono: '' });
              setShowModal(true);
            }}
          >
            <Plus size={20} />
            Añadir Cliente
          </button>
        </div>

        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Fecha de Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>Cargando...</td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No se encontraron clientes</td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.nombre}</td>
                    <td>{client.email}</td>
                    <td>{client.telefono || 'N/A'}</td>
                    <td>{new Date(client.fechaRegistro).toLocaleDateString('es-CO')}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(client)}
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="btn-icon btn-danger"
                          onClick={() => handleDelete(client.id)}
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
              <h2>{editingClient ? 'Editar Cliente' : 'Añadir Cliente'}</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="Opcional"
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingClient ? 'Actualizar' : 'Guardar'}
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

export default Clients;

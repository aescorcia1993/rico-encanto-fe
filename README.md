# Rico Encanto - Frontend

Frontend para el sistema de gestión de la pastelería Rico Encanto, desarrollado con React + Vite.

## 🚀 Tecnologías

- React 18
- React Router DOM
- Vite
- Axios
- Lucide React (iconos)
- Node.js v20+

## 📦 Instalación

```bash
npm install
```

## 🔧 Configuración

Crear archivo `.env` con las siguientes variables:

```
VITE_API_URL=http://localhost:5000/api
```

## ▶️ Ejecución

Desarrollo:
```bash
npm run dev
```

Build para producción:
```bash
npm run build
```

Vista previa del build:
```bash
npm run preview
```

## 🔐 Credenciales de prueba

- Email: `admin@ricoencanto.com` (pre-llenado)
- Password: `admin123` (pre-llenado)

**Nota**: Las credenciales vienen automáticamente completadas para facilitar el acceso en este MVP.

## 📱 Funcionalidades

### Login
- Autenticación de usuarios
- Recordar sesión
- Gestión de tokens JWT

### Dashboard
- Ventas del día
- Productos con stock bajo
- Total de clientes
- Ventas recientes

### Gestión de Inventario
- Listar productos
- Crear nuevos productos
- Editar productos existentes
- Eliminar productos
- Búsqueda de productos
- Indicadores de estado (Disponible/Agotado)

### Gestión de Ventas
- Listar todas las ventas
- Ver detalle de ventas
- Estados: Completada, Pendiente, Cancelada
- Búsqueda de ventas

### Gestión de Clientes
- Listar clientes
- Crear nuevos clientes
- Editar clientes
- Eliminar clientes
- Búsqueda de clientes

### Reportes y Estadísticas
- Total de ventas en período
- Ingresos totales
- Productos más vendidos
- Ventas por estado
- Filtros por fecha

## 🎨 Diseño

El diseño está basado en los mockups de Figma proporcionados, con:
- Paleta de colores naranja (#D97706) para elementos primarios
- Interfaz limpia y moderna
- Responsive design
- Componentes reutilizables

## 📁 Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── Layout.jsx
│   └── PrivateRoute.jsx
├── contexts/        # Contextos de React
│   └── AuthContext.jsx
├── pages/           # Páginas de la aplicación
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Inventory.jsx
│   ├── Sales.jsx
│   ├── Clients.jsx
│   └── Reports.jsx
├── services/        # Servicios y API
│   └── api.js
├── App.jsx          # Componente principal
└── main.jsx         # Punto de entrada
```

## 📝 Notas

- La aplicación requiere que el backend esté corriendo en el puerto 5000
- Las rutas están protegidas con autenticación JWT
- Los estilos están organizados por componente
- Responsive hasta 768px

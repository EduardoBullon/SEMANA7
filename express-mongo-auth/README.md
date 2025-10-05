# Express Mongo Auth

Sistema de autenticación con Express.js, MongoDB y control de roles desarrollado para el Laboratorio SEMANA7.

## Características

- ✅ Autenticación con JWT
- ✅ Sistema de roles (usuario/admin)
- ✅ Validación de contraseñas seguras
- ✅ Interface web con EJS + Materialize CSS
- ✅ API RESTful completa
- ✅ Gestión de perfiles de usuario
- ✅ Dashboard diferenciado por roles
- ✅ Páginas de error personalizadas

## Estructura del Proyecto

```
express-mongo-auth/
├── src/
│   ├── controllers/          # Controladores de la aplicación
│   ├── middlewares/          # Middlewares de autenticación y autorización
│   ├── models/              # Modelos de Mongoose
│   ├── repositories/        # Capa de acceso a datos
│   ├── routes/              # Definición de rutas
│   ├── services/            # Lógica de negocio
│   ├── utils/               # Utilidades (seeds, etc.)
│   └── server.js            # Punto de entrada de la aplicación
├── views/                   # Plantillas EJS
│   ├── partials/            # Componentes reutilizables
│   ├── signin.ejs           # Página de inicio de sesión
│   ├── signup.ejs           # Página de registro
│   ├── profile.ejs          # Página de perfil
│   ├── dashboard-user.ejs   # Dashboard de usuario
│   ├── dashboard-admin.ejs  # Dashboard de administrador
│   ├── 403.ejs             # Página de error 403
│   └── 404.ejs             # Página de error 404
├── public/                  # Archivos estáticos
│   ├── css/                 # Estilos personalizados
│   └── js/                  # JavaScript del cliente
└── package.json
```

## Instalación

1. **Clonar el proyecto** (o usar el directorio actual)

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con tus configuraciones:
   ```env
   MONGODB_URI=mongodb://localhost:27017/express-mongo-auth
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=1h
   BCRYPT_SALT_ROUNDS=10
   PORT=3000
   SEED_ADMIN_EMAIL=admin@example.com
   SEED_ADMIN_PASSWORD=Admin@123
   ```

4. **Asegurarse de que MongoDB esté corriendo**
   ```bash
   # Windows
   net start MongoDB
   
   # O usar MongoDB Compass/Atlas
   ```

## Uso

### Iniciar la aplicación

```bash
node src/server.js
```

La aplicación estará disponible en: `http://localhost:3000`

### Usuarios predefinidos

Al iniciar por primera vez, se crean automáticamente:
- **Roles**: `user`, `admin`
- **Usuario admin**: `admin@example.com` / `Admin@123` (configurable en .env)

### Páginas principales

- **Inicio**: `/` - Página principal
- **Iniciar sesión**: `/signin` 
- **Registrarse**: `/signup`
- **Mi perfil**: `/profile` (requiere autenticación)
- **Dashboard usuario**: `/dashboard/user` (rol: user o admin)
- **Dashboard admin**: `/dashboard/admin` (rol: admin)

## API Endpoints

### Autenticación
- `POST /api/auth/signUp` - Registro de usuario
- `POST /api/auth/signIn` - Inicio de sesión

### Usuarios
- `GET /api/users` - Listar usuarios (solo admin)
- `GET /api/users/me` - Obtener perfil propio
- `PUT /api/users/me` - Actualizar perfil propio
- `PUT /api/users/me/password` - Cambiar contraseña

### Ejemplo de registro

```javascript
POST /api/auth/signUp
{
  "email": "usuario@example.com",
  "password": "MiPassword123!",
  "name": "Juan",
  "lastName": "Pérez",
  "phoneNumber": "1234567890",
  "birthdate": "1995-06-15",
  "url_profile": "https://github.com/usuario",
  "address": "Calle 123, Ciudad"
}
```

### Ejemplo de inicio de sesión

```javascript
POST /api/auth/signIn
{
  "email": "admin@example.com",
  "password": "Admin@123"
}

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Validaciones

### Contraseña
- Mínimo 8 caracteres
- Al menos 1 letra mayúscula
- Al menos 1 dígito
- Al menos 1 carácter especial (`!@#$%^&*()_+-=[]{}|;':\"\\,.<>/?`)

### Campos requeridos para registro
- `email` (único)
- `password` (con validaciones)
- `lastName`
- `phoneNumber`
- `birthdate`

### Campos opcionales
- `name`
- `url_profile`
- `address`

## Tecnologías utilizadas

- **Backend**: Node.js, Express.js
- **Base de datos**: MongoDB con Mongoose
- **Autenticación**: JWT (JSON Web Tokens)
- **Encriptación**: bcrypt
- **Frontend**: EJS, Materialize CSS
- **Validaciones**: Expresiones regulares, validaciones de Mongoose

## Desarrollo

### Estructura de roles

- **user**: Puede acceder a su dashboard y perfil
- **admin**: Puede acceder a todo lo anterior + dashboard administrativo + listar usuarios

### Middlewares de seguridad

- `authenticate`: Verifica JWT válido
- `authorize`: Verifica roles requeridos
- `extractUser`: Extrae usuario opcional para vistas

### Manejo de errores

- Errores de validación (400)
- No autorizado (401)
- Prohibido (403)
- No encontrado (404)
- Error interno del servidor (500)

## Comandos útiles

```bash
# Verificar sintaxis
node --check src/server.js

# Instalar nueva dependencia
npm install <package-name>

# Ver logs en tiempo real
npm start

# Verificar base de datos
mongosh
use express-mongo-auth
db.users.find()
db.roles.find()
```

## Resolución de problemas

### Error de conexión a MongoDB
```
Asegúrate de que MongoDB esté corriendo en el puerto 27017
o actualiza MONGODB_URI en .env
```

### Error de token JWT
```
Verifica que JWT_SECRET esté definido en .env
y que el token no haya expirado
```

### Error de permisos
```
Revisa que el usuario tenga el rol correcto
para acceder al recurso solicitado
```

---

**Desarrollado para**: Laboratorio SEMANA7 - Desarrollo de Aplicaciones Web Avanzadas
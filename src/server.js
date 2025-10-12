import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import pagesRoutes from './routes/pages.routes.js';
import seedRoles from './utils/seedRoles.js';
import seedAdmin from './utils/seedAdmin.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🧩 Configurar motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // para CSS, imágenes, etc.

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Rutas FRONTEND
app.use('/', pagesRoutes);


// Health check
app.get('/health', (req, res) => res.status(200).json({ ok: true }));

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { autoIndex: true })
  .then(async () => {
    console.log('Mongo connected');
    await seedRoles();
    await seedAdmin();
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
  })
  .catch(err => {
    console.error('Error al conectar con Mongo:', err);
    process.exit(1);
  });

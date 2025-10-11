import express from 'express';
import UserController from '../controllers/UserController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

// GET /api/users (solo el rol Admin)
router.get('/', authenticate, authorize(['admin']), UserController.getAll);

// GET /api/users/me (cualquier usuario autenticado)
router.get('/me', authenticate, authorize([]), UserController.getMe);

// PUT /api/users/me (actualiza datos del perfil)
router.put('/me', authenticate, authorize([]), UserController.updateProfile);

// PUT /api/users/me/password (actualiza solo la contraseña)
router.put('/me/password', authenticate, authorize([]), UserController.updatePassword);

export default router;

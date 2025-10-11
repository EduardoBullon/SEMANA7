import express from 'express';
const router = express.Router();

// ---------- PÚBLICAS ----------
router.get('/', (req, res) => res.redirect('/signin'));
router.get('/signin', (req, res) => res.render('auth/signin'));
router.get('/signup', (req, res) => res.render('auth/signup'));

// ---------- PRIVADAS ----------
router.get('/dashboard/user', (req, res) => res.render('dashboards/user'));
router.get('/dashboard/admin', (req, res) => res.render('dashboards/admin'));
router.get('/profile', (req, res) => res.render('profile'));

// ---------- ERRORES ----------
router.get('/403', (req, res) => res.render('errors/403'));
router.get('/404', (req, res) => res.render('errors/404'));

// Si ninguna ruta coincide
router.use((req, res) => res.status(404).render('errors/404'));

export default router;

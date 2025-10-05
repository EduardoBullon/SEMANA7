import express from 'express';
import jwt from 'jsonwebtoken';
import userService from '../services/UserService.js';

const router = express.Router();

async function extractUser(req, res, next) {
    try {
        let token = null;
        const header = req.headers.authorization;
        if (header && header.startsWith('Bearer ')) {
            token = header.split(' ')[1];
        }
        
        if (!token && req.headers.cookie) {
            const cookies = req.headers.cookie.split(';');
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'auth_token') {
                    token = value;
                    break;
                }
            }
        }
        
        if (token) {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            
            const user = await userService.getById(payload.sub);
            req.user = user;
        }
    } catch (err) {
    }
    next();
}

function requireAuth(req, res, next) {
    if (!req.user) {
        return res.redirect('/signin');
    }
    next();
}

function requireRole(roles = []) {
    return (req, res, next) => {
        if (!req.user) {
            return res.redirect('/signin');
        }
        
        if (roles.length > 0) {
            const hasRole = req.user.roles.some(role => roles.includes(role));
            if (!hasRole) {
                return res.status(403).render('403', { user: req.user });
            }
        }
        
        next();
    };
}

router.get('/', extractUser, (req, res) => {
    res.render('index', { user: req.user });
});

router.get('/signin', extractUser, (req, res) => {
    res.render('signin');
});

router.get('/signup', extractUser, (req, res) => {
    if (req.user) {
        const isAdmin = req.user.roles.includes('admin');
        return res.redirect(isAdmin ? '/dashboard/admin' : '/dashboard/user');
    }
    res.render('signup');
});

router.get('/profile', extractUser, requireAuth, (req, res) => {
    res.render('profile', { user: req.user });
});

router.get('/dashboard/user', extractUser, requireRole(['user', 'admin']), (req, res) => {
    res.render('dashboard-user', { user: req.user });
});

router.get('/dashboard/admin', extractUser, requireRole(['admin']), (req, res) => {
    res.render('dashboard-admin', { user: req.user });
});

router.get('/403', extractUser, (req, res) => {
    res.status(403).render('403', { user: req.user });
});

router.get('/404', extractUser, (req, res) => {
    res.status(404).render('404', { user: req.user });
});

router.use((req, res) => {
    res.status(404).render('404', { user: req.user });
});

export default router;
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

class AuthService {

    validatePasswordRules(password) {
        const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%\^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        return re.test(password);
    }

    calculateAge(birthdate) {
        const bd = new Date(birthdate);
        const diff = Date.now() - bd.getTime();
        const age = new Date(diff).getUTCFullYear() - 1970;
        return age;
    }

    async signUp({ email, password, name, lastName, phoneNumber, birthdate, url_profile, address, roles = ['user'] }) {
        const existing = await userRepository.findByEmail(email);
        if (existing) {
            const err = new Error('El email ya se encuentra en uso');
            err.status = 400;
            throw err;
        }

        if (!this.validatePasswordRules(password)) {
            const err = new Error('La contraseña debe tener al menos 8 caracteres, una mayúscula, un dígito y un carácter especial');
            err.status = 400;
            throw err;
        }

        const age = this.calculateAge(birthdate);
        if (age < 0) {
            const err = new Error('birthdate inválida');
            err.status = 400;
            throw err;
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
        const hashed = await bcrypt.hash(password, saltRounds);

        const roleDocs = [];
        for (const r of roles) {
            let roleDoc = await roleRepository.findByName(r);
            if (!roleDoc) roleDoc = await roleRepository.create({ name: r });
            roleDocs.push(roleDoc._id);
        }

        const user = await userRepository.create({ 
            email, 
            password: hashed, 
            name, 
            lastName,
            phoneNumber,
            birthdate,
            url_profile,
            address,
            roles: roleDocs 
        });

        return {
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName
        };
    }

    async signIn({ email, password }) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            const err = new Error('Credenciales inválidas');
            err.status = 401;
            throw err;
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            const err = new Error('Credenciales inválidas');
            err.status = 401;
            throw err;
        }

        const roles = (user.roles || []).map(r => (r.name ? r.name : r));

        const token = jwt.sign({ 
            sub: user._id, 
            roles }, 
            process.env.JWT_SECRET, 
            { 
                expiresIn: process.env.JWT_EXPIRES_IN || '1h' 
            }
        );

        return { token };
    }
}

export default new AuthService();

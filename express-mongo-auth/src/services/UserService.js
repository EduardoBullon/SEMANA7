import userRepository from '../repositories/UserRepository.js';
import bcrypt from 'bcrypt';

class UserService {

    async getAll() {
        return userRepository.getAll();
    }

    async getById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            birthdate: user.birthdate,
            url_profile: user.url_profile,
            address: user.address,
            roles: user.roles.map(r => r.name),
            createdAt: user.createdAt
        };
    }

    async updateProfile(id, updateData) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }

        if (updateData.lastName && !updateData.lastName.trim()) {
            const err = new Error('El apellido es requerido');
            err.status = 400;
            throw err;
        }

        if (updateData.phoneNumber && !updateData.phoneNumber.trim()) {
            const err = new Error('El teléfono es requerido');
            err.status = 400;
            throw err;
        }

        if (updateData.birthdate && !updateData.birthdate.trim()) {
            const err = new Error('La fecha de nacimiento es requerida');
            err.status = 400;
            throw err;
        }

        const updatedUser = await userRepository.updateProfile(id, updateData);
        return {
            id: updatedUser._id,
            email: updatedUser.email,
            name: updatedUser.name,
            lastName: updatedUser.lastName,
            phoneNumber: updatedUser.phoneNumber,
            birthdate: updatedUser.birthdate,
            url_profile: updatedUser.url_profile,
            address: updatedUser.address,
            roles: updatedUser.roles.map(r => r.name)
        };
    }

    async changePassword(id, currentPassword, newPassword) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            const err = new Error('La contraseña actual es incorrecta');
            err.status = 400;
            throw err;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%\^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            const err = new Error('La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, un dígito y un carácter especial');
            err.status = 400;
            throw err;
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        await userRepository.updatePassword(id, hashedNewPassword);
    }
}

export default new UserService();
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
            address: user.address,
            url_profile: user.url_profile,
            age: user.age,
            roles: user.roles.map(r => r.name)
        };
    }

    async updateProfile(id, data) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }

        const updatedUser = await userRepository.updateProfile(id, data);

        return {
            id: updatedUser._id,
            email: updatedUser.email,
            name: updatedUser.name,
            lastName: updatedUser.lastName,
            phoneNumber: updatedUser.phoneNumber,
            birthdate: updatedUser.birthdate,
            address: updatedUser.address,
            url_profile: updatedUser.url_profile,
            roles: updatedUser.roles.map(r => r.name)
        };
    }

    async updatePassword(id, oldPassword, newPassword) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            const err = new Error('La contraseña actual no es correcta');
            err.status = 400;
            throw err;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await userRepository.updatePassword(id, hashedPassword);

        return {
            id: updatedUser._id,
            email: updatedUser.email,
            name: updatedUser.name,
            message: 'Contraseña actualizada correctamente'
        };
    }
}

export default new UserService();

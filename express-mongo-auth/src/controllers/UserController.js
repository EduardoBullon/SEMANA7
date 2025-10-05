import userService from '../services/UserService.js';

class UserController {

    async getAll(req, res, next) {
        try {
            const users = await userService.getAll();
            res.status(200).json(users);
        } catch (err) {
            next(err);
        }
    }

    async getMe(req, res, next) {
        try {
            const user = await userService.getById(req.userId);
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }

    async updateMe(req, res, next) {
        try {
            const userId = req.userId;
            const updateData = req.body;
            
            delete updateData.email;
            delete updateData.password;
            delete updateData.roles;
            
            const updatedUser = await userService.updateProfile(userId, updateData);
            res.status(200).json(updatedUser);
        } catch (err) {
            next(err);
        }
    }

    async changePassword(req, res, next) {
        try {
            const userId = req.userId;
            const { currentPassword, newPassword } = req.body;
            
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ 
                    message: 'Se requieren la contraseña actual y la nueva contraseña' 
                });
            }
            
            await userService.changePassword(userId, currentPassword, newPassword);
            res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController();

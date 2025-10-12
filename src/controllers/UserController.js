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

    async updateProfile(req, res, next) {
        try {
            const updatedUser = await userService.updateProfile(req.userId, req.body);
            res.status(200).json(updatedUser);
        } catch (err) {
            next(err);
        }
    }

    async updatePassword(req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body;

            if (!oldPassword || !newPassword) {
                return res.status(400).json({ message: 'Debe proporcionar la contraseña actual y la nueva.' });
            }

            const result = await userService.updatePassword(req.userId, oldPassword, newPassword);
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController();

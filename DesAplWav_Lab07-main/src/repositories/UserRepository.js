import User from '../models/User.js';

class UserRepository {
    async create(userData) {
        const user = new User(userData);
        return user.save();
    }

    async findByEmail(email) {
        return User.findOne({ email }).populate('roles').exec();
    }

    async findById(id) {
        return User.findById(id).populate('roles').exec();
    }

    async updatePassword(id, hashedPassword) {
        return User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true }).exec();
    }

    async getAll() {
        return User.find().populate('roles').exec();
    }

	async updateProfile(id, data) {
		const allowedFields = ['name', 'lastName', 'phoneNumber', 'birthdate', 'address', 'url_profile'];
		const updateData = {};

		for (const field of allowedFields) {
			if (data[field] !== undefined) updateData[field] = data[field];
		}

		return User.findByIdAndUpdate(id, updateData, { new: true }).populate('roles').exec();
	}

}

export default new UserRepository();
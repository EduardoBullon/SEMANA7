import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';
import bcrypt from 'bcrypt';

export default async function seedUsers() {
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
    const existing = await userRepository.findByEmail(adminEmail);
    if (existing) {
        console.log('Admin user already exists');
        return;
    }

    let adminRole = await roleRepository.findByName('admin');
    if (!adminRole) adminRole = await roleRepository.create({ name: 'admin' });

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
    const hashed = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'Admin@123', saltRounds);

    await userRepository.create({
        email: adminEmail,
        password: hashed,
        name: 'Admin',
        lastName: 'User',
        phoneNumber: '0000000000',
        birthdate: new Date('1990-01-01'),
        url_profile: '',
        address: '',
        roles: [adminRole._id]
    });

    console.log('Seeded admin user:', adminEmail);
}

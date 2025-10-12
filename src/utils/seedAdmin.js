import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';
import bcrypt from 'bcrypt';

export default async function seedAdmin() {
  const adminRole = await roleRepository.findByName('admin');
  if (!adminRole) {
    console.log('Rol admin no encontrado. Ejecuta primero seedRoles().');
    return;
  }

  const existingAdmin = await userRepository.findByEmail('admin@gmail.com');
  if (existingAdmin) {
    console.log('El usuario administrador ya existe.');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin', 10);

  await userRepository.create({
    name: 'Administrador',
    lastName: 'Principal',
    email: 'admin@gmail.com',
    password: hashedPassword,
    phoneNumber: '999999999',
    birthdate: new Date('1990-01-01'),
    address: 'Oficina Central',
    url_profile: '',
    roles: [adminRole._id],
  });

  console.log('Usuario administrador creado: admin@gmail.com / admin');
}

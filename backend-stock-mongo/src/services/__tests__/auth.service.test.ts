// src/services/__tests__/auth.service.test.ts
// Configurar JWT_SECRET antes de importar el servicio
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';

import { register, login } from '../auth.service';
import * as userModel from '../../models/users.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock de las dependencias
jest.mock('../../models/users.model');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('debe registrar un nuevo usuario correctamente', async () => {
      // Arrange (Preparar)
      const username = 'testuser';
      const email = 'test@test.com';
      const password = 'password123';
      const hashedPassword = 'hashed_password';
      const userId = 'user123';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (userModel.createUser as jest.Mock).mockResolvedValue(userId);

      // Act (Actuar)
      const result = await register(username, email, password);

      // Assert (Afirmar)
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(userModel.createUser).toHaveBeenCalledWith({
        username,
        email,
        password: hashedPassword,
      });
      expect(result).toBe(userId);
    });

    it('debe lanzar error si el usuario ya existe', async () => {
      // Arrange
      const username = 'testuser';
      const email = 'test@test.com';
      const password = 'password123';

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      (userModel.createUser as jest.Mock).mockRejectedValue(
        new Error('Usuario ya existe')
      );

      // Act & Assert
      await expect(register(username, email, password)).rejects.toThrow(
        'Usuario ya existe'
      );
    });
  });

  describe('login', () => {
    it('debe hacer login correctamente con credenciales válidas', async () => {
      // Arrange
      const email = 'test@test.com';
      const password = 'password123';
      const user = {
        id: 'user123',
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashed_password',
        role: 'user',
      };
      const token = 'jwt_token_123';

      (userModel.findUser as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(token);

      // Act
      const result = await login(email, password);

      // Assert
      expect(userModel.findUser).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toBe(token);
    });

    it('debe lanzar error si el usuario no existe', async () => {
      // Arrange
      const email = 'test@test.com';
      const password = 'password123';

      (userModel.findUser as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(login(email, password)).rejects.toThrow(
        'Credenciales inválidas'
      );
    });

    it('debe lanzar error si la contraseña es incorrecta', async () => {
      // Arrange
      const email = 'test@test.com';
      const password = 'wrong_password';
      const user = {
        id: 'user123',
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashed_password',
        role: 'user',
      };

      (userModel.findUser as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(login(email, password)).rejects.toThrow(
        'Credenciales inválidas'
      );
    });
  });
});

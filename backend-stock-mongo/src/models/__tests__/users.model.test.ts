// src/models/__tests__/users.model.test.ts
// ⚠️ IMPORTANTE: Mockear mongoose ANTES de importar el módulo users.model

// Mock de la instancia del usuario
const createMockInstance = () => ({
  _id: { toString: () => 'user123' },
  save: jest.fn(),
});

// Mock del modelo User (constructor + métodos estáticos)
const createMockUserModel = () => {
  const MockUserModel: any = jest.fn().mockImplementation(() => {
    const instance = createMockInstance();
    instance.save.mockResolvedValue(instance);
    return instance;
  });

  MockUserModel.findOne = jest.fn().mockReturnValue({
    lean: jest.fn().mockResolvedValue(null),
  });

  return MockUserModel;
};

// Mock de mongoose.model
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  const MockUserModel = createMockUserModel();

  return {
    ...actualMongoose,
    model: jest.fn(() => MockUserModel),
  };
});

// Ahora importamos después de configurar el mock
import mongoose from 'mongoose';
import { createUser, findUser } from '../users.model';

describe('Users Model', () => {
  let mockUserModel: any;
  let lastCreatedInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Obtener el mock del modelo desde mongoose.model
    mockUserModel = (mongoose.model as jest.Mock)();

    // Configurar el mock para capturar la instancia creada
    (mockUserModel as jest.Mock).mockImplementation(() => {
      lastCreatedInstance = {
        _id: { toString: () => 'user123' },
        save: jest.fn().mockResolvedValue({
          _id: { toString: () => 'user123' },
        }),
      };
      return lastCreatedInstance;
    });
  });

  describe('createUser', () => {
    it('debe crear un usuario correctamente', async () => {
      // Arrange
      const userData = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashed_password',
      };

      // Act
      const result = await createUser(userData);

      // Assert
      expect(mockUserModel).toHaveBeenCalledWith({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: 'user',
      });
      expect(lastCreatedInstance.save).toHaveBeenCalled();
      expect(result).toBe('user123');
    });

    it('debe lanzar error si falla al guardar', async () => {
      // Arrange
      const userData = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashed_password',
      };
      const error = new Error('Error al guardar');

      // Configurar el mock para que save falle
      (mockUserModel as jest.Mock).mockImplementation(() => {
        lastCreatedInstance = {
          _id: { toString: () => 'user123' },
          save: jest.fn().mockRejectedValue(error),
        };
        return lastCreatedInstance;
      });

      // Act & Assert
      await expect(createUser(userData)).rejects.toThrow('Error al guardar');
    });
  });

  describe('findUser', () => {
    it('debe encontrar un usuario por email', async () => {
      // Arrange
      const email = 'test@test.com';
      const username = '';
      const mockMongooseUser = {
        _id: { toString: () => 'user123' },
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashed_password',
        role: 'user',
      };

      const mockQuery = {
        lean: jest.fn().mockResolvedValue(mockMongooseUser),
      };
      mockUserModel.findOne.mockReturnValue(mockQuery);

      // Act
      const result = await findUser(email, username);

      // Assert
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        $or: [{ email }, { username }],
      });
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'user123',
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashed_password',
        role: 'user',
      });
    });

    it('debe encontrar un usuario por username', async () => {
      // Arrange
      const email = '';
      const username = 'testuser';
      const mockMongooseUser = {
        _id: { toString: () => 'user123' },
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashed_password',
        role: 'user',
      };

      const mockQuery = {
        lean: jest.fn().mockResolvedValue(mockMongooseUser),
      };
      mockUserModel.findOne.mockReturnValue(mockQuery);

      // Act
      const result = await findUser(email, username);

      // Assert
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        $or: [{ email }, { username }],
      });
      expect(mockQuery.lean).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'user123',
        username: 'testuser',
        email: 'test@test.com',
        password: 'hashed_password',
        role: 'user',
      });
    });

    it('debe retornar null si no encuentra el usuario', async () => {
      // Arrange
      const email = 'notfound@test.com';
      const username = '';

      const mockQuery = {
        lean: jest.fn().mockResolvedValue(null),
      };
      mockUserModel.findOne.mockReturnValue(mockQuery);

      // Act
      const result = await findUser(email, username);

      // Assert
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        $or: [{ email }, { username }],
      });
      expect(result).toBeNull();
    });

    it('debe usar valores por defecto cuando no se pasan parámetros', async () => {
      // Arrange
      const mockQuery = {
        lean: jest.fn().mockResolvedValue(null),
      };
      mockUserModel.findOne.mockReturnValue(mockQuery);

      // Act
      const result = await findUser();

      // Assert
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        $or: [{ email: '' }, { username: '' }],
      });
      expect(result).toBeNull();
    });
  });
});

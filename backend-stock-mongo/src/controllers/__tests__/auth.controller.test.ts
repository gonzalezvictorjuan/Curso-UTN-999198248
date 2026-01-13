// src/controllers/__tests__/auth.controller.test.ts
// Configurar JWT_SECRET antes de importar el controlador
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';

import { Request, Response } from 'express';
import { register, login } from '../auth.controller';
import * as authService from '../../services/auth.service';
import { validationResult } from 'express-validator';

// Mock de las dependencias
jest.mock('../../services/auth.service');
jest.mock('express-validator');

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('debe registrar un usuario y retornar 201', async () => {
      // Arrange
      mockRequest.body = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
      };

      (
        validationResult as jest.MockedFunction<typeof validationResult>
      ).mockReturnValue({
        isEmpty: () => true,
        array: () => [],
      } as any);
      (authService.register as jest.Mock).mockResolvedValue('user123');

      // Act
      await register(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(authService.register).toHaveBeenCalledWith(
        'testuser',
        'test@test.com',
        'password123'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Usuario creado exitosamente',
      });
    });

    it('debe retornar 400 si hay errores de validación', async () => {
      // Arrange
      mockRequest.body = {
        username: '',
        email: 'invalid-email',
        password: '123',
      };

      (
        validationResult as jest.MockedFunction<typeof validationResult>
      ).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Email inválido' }],
      } as any);

      // Act
      await register(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(authService.register).not.toHaveBeenCalled();
    });

    it('debe manejar errores del servicio', async () => {
      // Arrange
      mockRequest.body = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
      };
      const error = new Error('Usuario ya existe');
      (error as any).code = 'ER_DUP_ENTRY';

      (
        validationResult as jest.MockedFunction<typeof validationResult>
      ).mockReturnValue({
        isEmpty: () => true,
        array: () => [],
      } as any);
      (authService.register as jest.Mock).mockRejectedValue(error);

      // Act
      await register(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'El usuario o email ya existe',
      });
    });

    it('debe manejar errores genéricos del servicio', async () => {
      // Arrange
      mockRequest.body = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
      };
      const error = new Error('Error genérico');

      (
        validationResult as jest.MockedFunction<typeof validationResult>
      ).mockReturnValue({
        isEmpty: () => true,
        array: () => [],
      } as any);
      (authService.register as jest.Mock).mockRejectedValue(error);

      // Act
      await register(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error al registrar el usuario',
      });
    });
  });

  describe('login', () => {
    it('debe hacer login y retornar token', async () => {
      // Arrange
      mockRequest.body = {
        email: 'test@test.com',
        password: 'password123',
      };
      const token = 'jwt_token_123';

      (
        validationResult as jest.MockedFunction<typeof validationResult>
      ).mockReturnValue({
        isEmpty: () => true,
        array: () => [],
      } as any);
      (authService.login as jest.Mock).mockResolvedValue(token);

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(
        'test@test.com',
        'password123'
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        token,
      });
    });

    it('debe retornar 400 si hay errores de validación', async () => {
      // Arrange
      mockRequest.body = {
        email: 'invalid-email',
        password: '',
      };

      (
        validationResult as jest.MockedFunction<typeof validationResult>
      ).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: 'Email inválido' }],
      } as any);

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('debe manejar errores de credenciales inválidas', async () => {
      // Arrange
      mockRequest.body = {
        email: 'test@test.com',
        password: 'wrong_password',
      };
      const error = new Error('Credenciales inválidas');

      (
        validationResult as jest.MockedFunction<typeof validationResult>
      ).mockReturnValue({
        isEmpty: () => true,
        array: () => [],
      } as any);
      (authService.login as jest.Mock).mockRejectedValue(error);

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Credenciales inválidas',
      });
    });

    it('debe manejar errores genéricos del servicio', async () => {
      // Arrange
      mockRequest.body = {
        email: 'test@test.com',
        password: 'password123',
      };
      const error = new Error('Error genérico');

      (
        validationResult as jest.MockedFunction<typeof validationResult>
      ).mockReturnValue({
        isEmpty: () => true,
        array: () => [],
      } as any);
      (authService.login as jest.Mock).mockRejectedValue(error);

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error al iniciar sesión',
      });
    });
  });
});

// src/middlewares/__tests__/auth.middleware.test.ts
// Configurar JWT_SECRET antes de importar el middleware
process.env.JWT_SECRET = 'test-secret';

import { Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../auth.middleware';
import jwt from 'jsonwebtoken';
import { UserRole } from '../../types/auth';

// Mock de jsonwebtoken
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('debe permitir acceso con token válido', () => {
      // Arrange
      const token = 'valid_token';
      const decoded = {
        id: 'user123',
        username: 'testuser',
        role: 'user',
      };

      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      (jwt.verify as jest.Mock).mockImplementation(
        (token, secret, callback) => {
          callback(null, decoded);
        }
      );

      // Act
      authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(
        token,
        'test-secret',
        expect.any(Function)
      );
      expect(mockRequest.user).toEqual(decoded);
      expect(mockNext).toHaveBeenCalled();
    });

    it('debe rechazar acceso sin token', () => {
      // Arrange
      mockRequest.headers = {};

      // Act
      authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'No token provided',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('debe rechazar acceso con token inválido', () => {
      // Arrange
      const token = 'invalid_token';
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      (jwt.verify as jest.Mock).mockImplementation(
        (token, secret, callback) => {
          callback(new Error('Token inválido'), null);
        }
      );

      // Act
      authenticate(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid token or expired',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('authorize', () => {
    it('debe permitir acceso si el usuario tiene el rol requerido', () => {
      // Arrange
      const requiredRoles: Array<'user' | 'admin'> = ['admin'];
      mockRequest.user = {
        id: 'user123',
        username: 'admin',
        role: UserRole.ADMIN,
      };

      // Act
      authorize(requiredRoles)(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalled();
    });

    it('debe rechazar acceso si el usuario no tiene el rol requerido', () => {
      // Arrange
      const requiredRoles: Array<'user' | 'admin'> = ['admin'];
      mockRequest.user = {
        id: 'user123',
        username: 'user',
        role: UserRole.USER,
      };

      // Act
      authorize(requiredRoles)(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Acceso denegado',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('debe rechazar acceso si no hay usuario en la request', () => {
      // Arrange
      const requiredRoles: Array<'user' | 'admin'> = ['admin'];
      mockRequest.user = undefined;

      // Act
      authorize(requiredRoles)(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Acceso denegado',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});

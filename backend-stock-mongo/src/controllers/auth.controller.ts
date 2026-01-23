import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { validationResult } from 'express-validator';

export const register = async (req: Request, res: Response) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    console.log('Registering user:', username, email, password);

    await authService.register(username, email, password);

    return res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El usuario o email ya existe' });
    }

    console.log('Error during registration:', error);
    return res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const token = await authService.login(email, password);

    return res.json({ token });
  } catch (error: any) {
    if (error.message === 'Credenciales inválidas') {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

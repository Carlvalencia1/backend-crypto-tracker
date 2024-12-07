// UserController.ts
import { Request, Response } from 'express';
import { UserService } from '../../negocio/services/usersService';

export class UserController {
    constructor(readonly userService: UserService) {}

    // Registro de usuario
    async register(req: Request, res: Response) {
        try {
            const user = await this.userService.registerUser(req.body);
            if (user) {
                res.status(201).json({ message: 'User registered successfully', data: user });
            } else {
                res.status(400).json({ message: 'User registration failed' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error registering user', error });
        }
    }

    // Inicio de sesión de usuario
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const token = await this.userService.loginUser(email, password);
            if (token) {
                res.status(200).json({ message: 'Login successful', token });
            } else {
                res.status(400).json({ message: 'Invalid email or password' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error });
        }
    }

    // Obtener todos los usuarios
    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json({ data: users });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error });
        }
    }

    // Obtener usuario por ID
    async getUserById(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            const user = await this.userService.getId(userId);
            if (user) {
                res.status(200).json({ data: user });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user', error });
        }
    }

    // Eliminar un usuario
    async deleteUser(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            const result = await this.userService.deleteUser(userId);
            if (result) {
                res.status(200).json({ message: 'User deleted successfully' });
            } else {
                res.status(400).json({ message: 'Error deleting user' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error });
        }
    }

    // Obtener portafolio de un usuario
    async getUserPortfolio(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.userId);
            const portfolio = await this.userService.getUserPortfolio(userId);
            res.status(200).json({ data: portfolio });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching portfolio', error });
        }
    }

    // Añadir criptomoneda al portafolio del usuario
    async addCryptoToPortfolio(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.userId);
            const { cryptoSymbol, quantity, averageBuyPrice } = req.body;
            const result = await this.userService.addCryptoToPortfolio(userId, { cryptoSymbol, quantity, averageBuyPrice });
            res.status(201).json({ message: 'Crypto added to portfolio', data: result });
        } catch (error) {
            res.status(500).json({ message: 'Error adding crypto to portfolio', error });
        }
    }

    // Obtener transacciones de la billetera del usuario
    async getWalletTransactions(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.userId);
            const transactions = await this.userService.getWalletTransactions(userId);
            res.status(200).json({ data: transactions });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching wallet transactions', error });
        }
    }

    // Crear transacción en la billetera
    async createWalletTransaction(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.userId);
            const { type, amount, status } = req.body;
            const result = await this.userService.createWalletTransaction(userId, { type, amount, status });
            res.status(201).json({ message: 'Wallet transaction created', data: result });
        } catch (error) {
            res.status(500).json({ message: 'Error creating wallet transaction', error });
        }
    }

    // Obtener favoritos del usuario
    async getFavorites(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.userId);
            const favorites = await this.userService.getUserFavorites(userId);
            res.status(200).json({ data: favorites });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching favorites', error });
        }
    }

    // Añadir criptomoneda a los favoritos del usuario
    async addFavorite(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.userId);
            const { cryptoSymbol } = req.body;
            const updatedFavorites = await this.userService.addCryptoToFavorites(userId, cryptoSymbol);
            res.status(201).json({ message: 'Crypto added to favorites', data: updatedFavorites });
        } catch (error) {
            res.status(500).json({ message: 'Error adding to favorites', error });
        }
    }

    // Eliminar criptomoneda de los favoritos del usuario
    async removeFavorite(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.userId);
            const { cryptoSymbol } = req.params;
            const result = await this.userService.removeCryptoFromFavorites(userId, cryptoSymbol);
            res.status(200).json({ message: 'Crypto removed from favorites', data: result });
        } catch (error) {
            res.status(500).json({ message: 'Error removing from favorites', error });
        }
    }

    // Limpiar todos los favoritos de un usuario
    async clearFavorites(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.userId);
            const result = await this.userService.clearAllFavorites(userId);
            res.status(200).json({ message: 'All favorites cleared', data: result });
        } catch (error) {
            res.status(500).json({ message: 'Error clearing favorites', error });
        }
    }
}

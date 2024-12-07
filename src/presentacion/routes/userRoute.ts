import express, { Router } from 'express';
import { UserController } from '../controllers/usersController';
import { UserService } from '../../negocio/services/usersService';
import { UserRepository } from '../../persistencia/repositorios/UserRepository';

export const userRoutes: Router = express.Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Rutas para el registro y el inicio de sesión
userRoutes.post('/register', userController.register.bind(userController));
userRoutes.post('/login', userController.login.bind(userController));

// Rutas CRUD para usuarios
userRoutes.get('/', userController.getAllUsers.bind(userController));
userRoutes.get('/:id', userController.getUserById.bind(userController));
userRoutes.delete('/:id', userController.deleteUser.bind(userController));

// Rutas para gestionar el portafolio del usuario
userRoutes.get('/:userId/portfolio', userController.getUserPortfolio.bind(userController));
userRoutes.post('/:userId/portfolio', userController.addCryptoToPortfolio.bind(userController));

// Rutas para gestionar favoritos del usuario
userRoutes.get('/:userId/favorites', userController.getFavorites.bind(userController));
userRoutes.post('/:userId/favorites', userController.addFavorite.bind(userController));
userRoutes.delete('/:userId/favorites/:cryptoSymbol', userController.removeFavorite.bind(userController));
userRoutes.delete('/:userId/favorites', userController.clearFavorites.bind(userController));

// Rutas para gestionar transacciones de la billetera
userRoutes.get('/:userId/wallet-transactions', userController.getWalletTransactions.bind(userController));
userRoutes.post('/:userId/wallet-transactions', userController.createWalletTransaction.bind(userController));

export default userRoutes;

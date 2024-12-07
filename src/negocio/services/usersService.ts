// UserService.ts
import { User } from '../../persistencia/models/User';
import { UserRepository } from '../../persistencia/repositorios/UserRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserService {
    constructor(readonly userRepository: UserRepository) {}

    async registerUser(data: any): Promise<User | null> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.userRepository.createNewUser({ ...data, password: hashedPassword });
    }

    async loginUser(email: string, password: string): Promise<string | null> {
        const user = await this.userRepository.getUserByEmail(email);
        if (user && await bcrypt.compare(password, user.getPassword())) {
            const token = jwt.sign({ userId: user.getId() }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
            return token;
        }
        return null;
    }

    async getAllUsers(): Promise<User[] | null> {
        return this.userRepository.getAllUsers();
    }

    async getId(id: number): Promise<User | null> {
        return this.userRepository.getId(id);
    }

    async deleteUser(id: number): Promise<any> {
        return this.userRepository.deleteUser(id);
    }

    async getUserPortfolio(userId: number): Promise<any | null> {
        return this.userRepository.getUserPortfolio(userId);
    }

    async addCryptoToPortfolio(userId: number, data: { cryptoSymbol: string; quantity: number; averageBuyPrice: number }): Promise<any | null> {
        return this.userRepository.addCryptoToPortfolio(userId, data);
    }

    async getWalletTransactions(userId: number): Promise<any | null> {
        return this.userRepository.getWalletTransactions(userId);
    }

    async createWalletTransaction(userId: number, data: { type: 'deposit' | 'withdrawal'; amount: number; status: 'pending' | 'completed' }): Promise<any | null> {
        return this.userRepository.createWalletTransaction(userId, data);
    }

    // Nueva funcionalidad: Gestión de favoritos
    async getUserFavorites(userId: number): Promise<any | null> {
        return this.userRepository.getUserFavorites(userId);
    }

    async addCryptoToFavorites(userId: number, cryptoSymbol: string): Promise<any | null> {
        return this.userRepository.addCryptoToFavorites(userId, cryptoSymbol);
    }

    async removeCryptoFromFavorites(userId: number, cryptoSymbol: string): Promise<any | null> {
        return this.userRepository.removeCryptoFromFavorites(userId, cryptoSymbol);
    }

    async clearAllFavorites(userId: number): Promise<any | null> {
        return this.userRepository.clearAllFavorites(userId);
    }
}

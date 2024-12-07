// UserRepository.ts
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { User } from '../models/User';
dotenv.config();

export class UserRepository {
    private connection: mysql.Pool;

    constructor() {
        this.connection = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            waitForConnections: true,
            connectionLimit: 10,
        });
    }

    async getAllUsers(): Promise<User[] | null> {
        const [rows] = await this.connection.execute('SELECT * FROM users');
        return rows as User[];
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const [rows]: any = await this.connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return new User(rows[0].id, rows[0].name, rows[0].email, rows[0].password);
        }
        return null;
    }

    async createNewUser(data: any): Promise<User | null> {
        try {
            const [result]: any = await this.connection.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [data.name, data.email, data.password]);
            return new User(result.insertId, data.name, data.email, data.password);
        } catch (error) {
            return null;
        }
    }

    async getId(id: number): Promise<User | null> {
        const [rows]: any = await this.connection.execute('SELECT * FROM users WHERE id = ?', [id]);
        if (rows.length > 0) {
            return new User(rows[0].id, rows[0].name, rows[0].email, rows[0].password);
        }
        return null;
    }

    async deleteUser(id: number): Promise<any | null> {
        try {
            await this.connection.execute('DELETE FROM users WHERE id = ?', [id]);
            return { status: true };
        } catch (error) {
            return null;
        }
    }

    async getUserPortfolio(userId: number): Promise<any | null> {
        const [rows]: any = await this.connection.execute('SELECT * FROM portfolio WHERE user_id = ?', [userId]);
        return rows;
    }

    async addCryptoToPortfolio(userId: number, data: { cryptoSymbol: string; quantity: number; averageBuyPrice: number }): Promise<any | null> {
        try {
            await this.connection.execute('INSERT INTO portfolio (user_id, crypto_symbol, quantity, average_buy_price) VALUES (?, ?, ?, ?)', [userId, data.cryptoSymbol, data.quantity, data.averageBuyPrice]);
            return { status: true };
        } catch (error) {
            return null;
        }
    }

    async getWalletTransactions(userId: number): Promise<any | null> {
        const [rows]: any = await this.connection.execute('SELECT * FROM transactions WHERE user_id = ?', [userId]);
        return rows;
    }

    async createWalletTransaction(userId: number, data: { type: string; amount: number; status: string }): Promise<any | null> {
        try {
            await this.connection.execute('INSERT INTO transactions (user_id, type, amount, status) VALUES (?, ?, ?, ?)', [userId, data.type, data.amount, data.status]);
            return { status: true };
        } catch (error) {
            return null;
        }
    }

    // Nueva funcionalidad: Gestión de favoritos
    async getUserFavorites(userId: number): Promise<any | null> {
        const [rows]: any = await this.connection.execute('SELECT * FROM favorites WHERE user_id = ?', [userId]);
        return rows;
    }

    async addCryptoToFavorites(userId: number, cryptoSymbol: string): Promise<any | null> {
        try {
            await this.connection.execute('INSERT INTO favorites (user_id, crypto_symbol) VALUES (?, ?)', [userId, cryptoSymbol]);
            return { status: true };
        } catch (error) {
            return null;
        }
    }

    async removeCryptoFromFavorites(userId: number, cryptoSymbol: string): Promise<any | null> {
        try {
            await this.connection.execute('DELETE FROM favorites WHERE user_id = ? AND crypto_symbol = ?', [userId, cryptoSymbol]);
            return { status: true };
        } catch (error) {
            return null;
        }
    }

    async clearAllFavorites(userId: number): Promise<any | null> {
        try {
            await this.connection.execute('DELETE FROM favorites WHERE user_id = ?', [userId]);
            return { status: true };
        } catch (error) {
            return null;
        }
    }
}

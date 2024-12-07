import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import signale from 'signale';
import cors from 'cors';
import { userRoutes } from './presentacion/routes/userRoute';

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/api/v1/users', userRoutes);

app.listen(3000, () => {
    signale.success('Server running on port 3000');
});

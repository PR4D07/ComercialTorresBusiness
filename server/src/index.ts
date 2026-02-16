import dotenv from 'dotenv';
import path from 'path';

// Try loading from default location first, then explicit path
const result = dotenv.config();
if (result.error) {
    dotenv.config({ path: path.join(process.cwd(), '.env') });
}

import express from 'express';
import cors from 'cors';
import productRoutes from './infrastructure/http/routes/productRoutes';
import analyticsRoutes from './infrastructure/http/routes/analyticsRoutes';
import eventRoutes from './infrastructure/http/routes/eventRoutes';
import userRoutes from './infrastructure/http/routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Comercial Torres Backend is running');
});

app.use('/api', productRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

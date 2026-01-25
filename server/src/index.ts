import express from 'express';
import cors from 'cors';
import productRoutes from './infrastructure/http/routes/productRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*', // Permitir todas las conexiones por ahora para evitar problemas de CORS
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Root route for health check
app.get('/', (req, res) => {
    res.send('Comercial Torres Backend is running');
});

// Routes
app.use('/api', productRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

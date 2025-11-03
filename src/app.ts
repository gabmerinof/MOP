import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import nocache from 'nocache';
import 'reflect-metadata';
import { corsMiddleware } from './config/cors';
import { responseFormatter } from './middleware/responseFormater';
import { sequelize } from './models';
import authRoutes from './routes/auth';
import pointsRoutes from './routes/points';

dotenv.config({ path: __dirname + '/../.env' });

const API_PREFIX = '/api';
const app = express();
app.use(nocache());
app.use(compression());
app.use(corsMiddleware);
app.use(express.json({ limit: '1gb' }));
app.use(express.urlencoded({
    extended: true,
    inflate: true,
    limit: "1mb",
    parameterLimit: 5000,
    type: "application/x-www-form-urlencoded",
}));
app.use(responseFormatter);

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/points`, pointsRoutes);

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Traffic Geo API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

app.get('/', function (req, res) {
    res.send('Sistema de gestión de tráfico georeferencial');
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).json({
        error: 'ERROR',
        message: err.message
    });
});

app.all('/{*any}', (req: express.Request, res: express.Response) => {
    res.status(404).json({
        error: 'ERROR',
        message: 'Ruta no encontrada'
    });
});

const PORT = process.env['PORT'];
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        await sequelize.sync({ force: false });
        console.log('Modelos sincronizados con la base de datos.');

        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
            console.log(`Documentación disponible en http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();
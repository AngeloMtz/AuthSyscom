import express, {Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';

// Cargar variables de entorno
dotenv.config();

const app : Express = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARES ====================

// Seguridad
app.use(helmet());

// CORS - Configurar para permitir tu frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== RUTAS ====================

// Ruta de health check
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API de Autenticación funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Ruta 404 - No encontrada
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Manejador global de errores
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
  console.log(`
    🚀 Servidor corriendo en puerto ${PORT}
    📍 Entorno: ${process.env.NODE_ENV || 'development'}
    🔗 URL: http://localhost:${PORT}
    📧 Email service: Resend
    📱 SMS service: Twilio
  `);
});

export default app;
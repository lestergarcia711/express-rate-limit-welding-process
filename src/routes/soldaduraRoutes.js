import { Router } from "express";
import { tigLimiter } from '../middlewares/rateLimiter.js';
import { verEstadoMaquina, procesarSoldaduraTig } from '../controllers/soldaduraController.js';


const router = Router();

router.get('/estado', verEstadoMaquina);

router.post('/tig', tigLimiter, procesarSoldaduraTig);

export default router;

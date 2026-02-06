import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';

const router = Router();
const analyticsController = new AnalyticsController();

router.get('/kpis', analyticsController.getKPIs);

export default router;

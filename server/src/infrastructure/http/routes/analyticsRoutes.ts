import { Router } from 'express';

const router = Router();

router.get('/kpis', (req, res) => {
  const { startDate = '30daysAgo', endDate = 'today' } = req.query;

  res.json({
    sessions: 0,
    whatsappClicks: 0,
    averageSessionDurationMinutes: 0,
    averageSessionDurationSeconds: 0,
    startDate: String(startDate),
    endDate: String(endDate)
  });
});

export default router;


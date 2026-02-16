import { Router } from 'express';
import { supabase } from '../../config/supabase';

const router = Router();

router.get('/kpis', async (req, res) => {
  const { startDate = '30daysAgo', endDate = 'today' } = req.query;

  try {
    const { data, error } = await supabase
      .from('events')
      .select('event_type, metadata');

    if (error) {
      console.error('Error fetching events for analytics:', error);
      return res.json({
        sessions: 0,
        whatsappClicks: 0,
        averageSessionDurationMinutes: 0,
        averageSessionDurationSeconds: 0,
        startDate: String(startDate),
        endDate: String(endDate)
      });
    }

    const events = data ?? [];

    const sessions = events.length;
    const whatsappClicks = events.filter((event: any) => event.event_type === 'whatsapp_click').length;

    let totalSeconds = 0;
    let durationEvents = 0;

    for (const event of events as any[]) {
      const seconds = event.metadata?.sessionDurationSeconds ?? event.metadata?.durationSeconds;
      if (typeof seconds === 'number' && Number.isFinite(seconds) && seconds > 0) {
        totalSeconds += seconds;
        durationEvents += 1;
      }
    }

    const averageSessionDurationSeconds = durationEvents ? totalSeconds / durationEvents : 0;
    const averageSessionDurationMinutes = averageSessionDurationSeconds / 60;

    return res.json({
      sessions,
      whatsappClicks,
      averageSessionDurationMinutes,
      averageSessionDurationSeconds,
      startDate: String(startDate),
      endDate: String(endDate)
    });
  } catch (err) {
    console.error('Unexpected error building analytics KPIs:', err);
    return res.json({
      sessions: 0,
      whatsappClicks: 0,
      averageSessionDurationMinutes: 0,
      averageSessionDurationSeconds: 0,
      startDate: String(startDate),
      endDate: String(endDate)
    });
  }
});

export default router;


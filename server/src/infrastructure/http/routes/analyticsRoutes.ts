import { Router } from 'express';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const router = Router();

const propertyId = process.env.GA4_PROPERTY_ID;

let analyticsClient: BetaAnalyticsDataClient | null = null;

const getAnalyticsClient = () => {
  if (analyticsClient) return analyticsClient;

  const rawCredentials = process.env.GA4_SERVICE_ACCOUNT_KEY;

  if (rawCredentials) {
    try {
      const credentials = JSON.parse(rawCredentials);
      analyticsClient = new BetaAnalyticsDataClient({ credentials });
    } catch (err) {
      console.error('Error parsing GA4_SERVICE_ACCOUNT_KEY JSON:', err);
      analyticsClient = new BetaAnalyticsDataClient();
    }
  } else {
    analyticsClient = new BetaAnalyticsDataClient();
  }

  return analyticsClient;
};

router.get('/kpis', async (req, res) => {
  const { startDate = '30daysAgo', endDate = 'today' } = req.query;

  if (!propertyId) {
    console.warn('GA4_PROPERTY_ID is not set. Returning zero KPIs.');
    return res.json({
      sessions: 0,
      whatsappClicks: 0,
      averageSessionDurationMinutes: 0,
      averageSessionDurationSeconds: 0,
      startDate: String(startDate),
      endDate: String(endDate)
    });
  }

  try {
    const client = getAnalyticsClient();

    const [sessionsResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: String(startDate),
          endDate: String(endDate)
        }
      ],
      metrics: [
        { name: 'sessions' },
        { name: 'averageSessionDuration' }
      ]
    });

    let sessions = 0;
    let averageSessionDurationSeconds = 0;

    if (sessionsResponse.rows && sessionsResponse.rows[0]?.metricValues) {
      const [sessionsMetric, avgDurationMetric] = sessionsResponse.rows[0].metricValues;
      sessions = Number(sessionsMetric?.value ?? 0);
      averageSessionDurationSeconds = Number(avgDurationMetric?.value ?? 0);
    }

    const [whatsappResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: String(startDate),
          endDate: String(endDate)
        }
      ],
      metrics: [{ name: 'eventCount' }],
      dimensions: [{ name: 'eventName' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            matchType: 'EXACT',
            value: 'whatsapp_click'
          }
        }
      }
    });

    let whatsappClicks = 0;

    if (whatsappResponse.rows && whatsappResponse.rows[0]?.metricValues) {
      whatsappClicks = Number(whatsappResponse.rows[0].metricValues[0]?.value ?? 0);
    }

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
    console.error('Error fetching KPIs from Google Analytics:', err);
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


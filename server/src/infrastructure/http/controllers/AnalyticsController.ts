import { Request, Response } from 'express';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import path from 'path';

export class AnalyticsController {
    private analyticsDataClient: BetaAnalyticsDataClient;
    private propertyId: string;

    constructor() {
        // Buscamos el archivo de credenciales en la raíz del servidor
        const keyFilePath = path.join(process.cwd(), 'ga-credentials.json');
        
        this.analyticsDataClient = new BetaAnalyticsDataClient({
            keyFilename: keyFilePath,
        });

        this.propertyId = process.env.GA4_PROPERTY_ID || ''; 
    }

    public getKPIs = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!this.propertyId) {
                console.error('GA4_PROPERTY_ID missing in .env');
                res.status(500).json({ error: 'GA4_PROPERTY_ID no configurado' });
                return;
            }

            const { startDate = '30daysAgo', endDate = 'today' } = req.query;

            // 1. Obtener Sesiones y Duración
            const [basicReport] = await this.analyticsDataClient.runReport({
                property: `properties/${this.propertyId}`,
                dateRanges: [{ startDate: startDate as string, endDate: endDate as string }],
                metrics: [
                    { name: 'sessions' },
                    { name: 'averageSessionDuration' }
                ],
            });

            // 2. Obtener Clics de WhatsApp
            const [whatsappReport] = await this.analyticsDataClient.runReport({
                property: `properties/${this.propertyId}`,
                dateRanges: [{ startDate: startDate as string, endDate: endDate as string }],
                metrics: [{ name: 'eventCount' }],
                dimensionFilter: {
                    filter: {
                        fieldName: 'eventName',
                        stringFilter: { value: 'whatsapp_click' }
                    }
                }
            });

            const sessions = Number(basicReport.totals?.[0]?.metricValues?.[0]?.value || 0);
            const avgDurationSeconds = Number(basicReport.totals?.[0]?.metricValues?.[1]?.value || 0);
            const whatsappClicks = Number(whatsappReport.totals?.[0]?.metricValues?.[0]?.value || 0);
            const avgDurationMinutes = Math.round((avgDurationSeconds / 60) * 100) / 100;

            res.json({
                startDate,
                endDate,
                sessions,
                whatsappClicks,
                averageSessionDurationSeconds: avgDurationSeconds,
                averageSessionDurationMinutes: avgDurationMinutes
            });

        } catch (error) {
            console.error('Error fetching Analytics data:', error);
            res.status(500).json({ error: 'Error al conectar con Google Analytics', details: String(error) });
        }
    }
}

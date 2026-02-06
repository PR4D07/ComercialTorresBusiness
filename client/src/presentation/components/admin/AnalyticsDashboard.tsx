import { useState, useEffect } from 'react';
import './AnalyticsDashboard.css';

interface KPIs {
    sessions: number;
    whatsappClicks: number;
    averageSessionDurationMinutes: number;
    averageSessionDurationSeconds: number;
    startDate: string;
    endDate: string;
}

export const AnalyticsDashboard = () => {
    const [kpis, setKpis] = useState<KPIs | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [range, setRange] = useState('30daysAgo');

    useEffect(() => {
        fetchKPIs(range);
    }, [range]);

    const fetchKPIs = async (dateRange: string) => {
        setLoading(true);
        setError(null);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const res = await fetch(`${apiUrl}/api/analytics/kpis?startDate=${dateRange}&endDate=today`);
            
            if (!res.ok) throw new Error('Error al cargar métricas');
            
            const data = await res.json();
            setKpis(data);
        } catch (err) {
            console.error(err);
            setError('No se pudieron cargar las estadísticas. Asegúrate de que el servidor esté corriendo.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !kpis) return <div className="analytics-loading">Cargando métricas...</div>;
    if (error) return <div className="analytics-error">{error}</div>;

    return (
        <div className="analytics-dashboard">
            <div className="analytics-header">
                <h3>Rendimiento del Sitio</h3>
                <select value={range} onChange={(e) => setRange(e.target.value)} className="analytics-select">
                    <option value="7daysAgo">Últimos 7 días</option>
                    <option value="30daysAgo">Últimos 30 días</option>
                    <option value="90daysAgo">Últimos 3 meses</option>
                </select>
            </div>

            <div className="kpi-grid">
                {/* KPI 1: Visitas */}
                <div className="kpi-card">
                    <div className="kpi-title">Visitas Totales</div>
                    <div className="kpi-value">{kpis?.sessions}</div>
                    <div className="kpi-target">Meta: 10-50 / mes</div>
                    <div className={`kpi-status ${kpis && kpis.sessions >= 10 ? 'success' : 'pending'}`}>
                        {kpis && kpis.sessions >= 10 ? 'Meta alcanzada' : 'En progreso'}
                    </div>
                </div>

                {/* KPI 2: Clics WhatsApp */}
                <div className="kpi-card">
                    <div className="kpi-title">Clics a WhatsApp</div>
                    <div className="kpi-value">{kpis?.whatsappClicks}</div>
                    <div className="kpi-target">Meta: 10-20 / mes</div>
                    <div className={`kpi-status ${kpis && kpis.whatsappClicks >= 10 ? 'success' : 'pending'}`}>
                        {kpis && kpis.whatsappClicks >= 10 ? 'Meta alcanzada' : 'En progreso'}
                    </div>
                </div>

                {/* KPI 3: Duración Sesión */}
                <div className="kpi-card">
                    <div className="kpi-title">Tiempo Promedio</div>
                    <div className="kpi-value">{kpis?.averageSessionDurationMinutes} min</div>
                    <div className="kpi-target">Meta: &ge; 1.0 min</div>
                    <div className={`kpi-status ${kpis && kpis.averageSessionDurationMinutes >= 1 ? 'success' : 'pending'}`}>
                        {kpis && kpis.averageSessionDurationMinutes >= 1 ? 'Buen engagement' : 'Mejorable'}
                    </div>
                </div>
            </div>
        </div>
    );
};

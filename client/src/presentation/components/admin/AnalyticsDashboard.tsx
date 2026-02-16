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

export default function AnalyticsDashboard() {
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

    const calculatePercent = (value: number, target: number) => {
        if (!target || !Number.isFinite(target)) return 0;
        if (!Number.isFinite(value) || value <= 0) return 0;
        const percent = (value / target) * 100;
        if (percent < 0) return 0;
        if (percent > 100) return 100;
        return Math.round(percent);
    };

    const sessionsGoalMax = 50;
    const whatsappGoalMax = 20;
    const sessionMinutesGoal = 1;

    const sessionsPercent = kpis ? calculatePercent(kpis.sessions, sessionsGoalMax) : 0;
    const whatsappPercent = kpis ? calculatePercent(kpis.whatsappClicks, whatsappGoalMax) : 0;
    const sessionDurationPercent = kpis ? calculatePercent(kpis.averageSessionDurationMinutes, sessionMinutesGoal) : 0;

    return (
        <div className="analytics-dashboard">
            <div className="analytics-header">
                <div>
                    <h3>Resumen de Métricas del Sitio</h3>
                    {kpis && (
                        <p className="analytics-subtitle">
                            Datos de Google Analytics entre <strong>{kpis.startDate}</strong> y <strong>{kpis.endDate}</strong>.
                        </p>
                    )}
                </div>
                <div className="analytics-header-right">
                    <label className="analytics-range-label">
                        Rango:
                        <select value={range} onChange={(e) => setRange(e.target.value)} className="analytics-select">
                            <option value="7daysAgo">Últimos 7 días</option>
                            <option value="30daysAgo">Últimos 30 días</option>
                            <option value="90daysAgo">Últimos 3 meses</option>
                        </select>
                    </label>
                </div>
            </div>

            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-title">Visitas al sitio</div>
                    <div className="kpi-value">{kpis?.sessions}</div>
                    <div className="kpi-target">Usuarios que ingresaron a la web en el periodo elegido.</div>
                    <div className="kpi-progress">
                        <div className="kpi-progress-bar" style={{ width: `${sessionsPercent}%` }} />
                    </div>
                    <div className="kpi-progress-label">
                        {sessionsPercent}% de 50 visitas objetivo
                    </div>
                    <div className={`kpi-status ${kpis && kpis.sessions >= 10 ? 'success' : 'pending'}`}>
                        {kpis && kpis.sessions >= 10 ? 'Meta alcanzada' : 'En progreso'}
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-title">Clics al botón de WhatsApp</div>
                    <div className="kpi-value">{kpis?.whatsappClicks}</div>
                    <div className="kpi-target">Veces que los usuarios hicieron clic para contactarte por WhatsApp.</div>
                    <div className="kpi-progress">
                        <div className="kpi-progress-bar whatsapp" style={{ width: `${whatsappPercent}%` }} />
                    </div>
                    <div className="kpi-progress-label">
                        {whatsappPercent}% de 20 clics objetivo
                    </div>
                    <div className={`kpi-status ${kpis && kpis.whatsappClicks >= 10 ? 'success' : 'pending'}`}>
                        {kpis && kpis.whatsappClicks >= 10 ? 'Meta alcanzada' : 'En progreso'}
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-title">Tiempo promedio por visita</div>
                    <div className="kpi-value">
                        {kpis?.averageSessionDurationMinutes.toFixed(1)} min
                    </div>
                    <div className="kpi-target">
                        Tiempo que, en promedio, cada usuario permanece navegando en la web.
                    </div>
                    <div className="kpi-progress">
                        <div className="kpi-progress-bar time" style={{ width: `${sessionDurationPercent}%` }} />
                    </div>
                    <div className="kpi-progress-label">
                        {sessionDurationPercent}% de la meta de 1 minuto (ideal &ge; 1.0 min)
                    </div>
                    <div className={`kpi-status ${kpis && kpis.averageSessionDurationMinutes >= 1 ? 'success' : 'pending'}`}>
                        {kpis && (
                            kpis.averageSessionDurationMinutes >= 1
                                ? 'Meta alcanzada (buen tiempo de visita)'
                                : kpis.averageSessionDurationMinutes >= 0.5
                                    ? 'Cerca de la meta'
                                    : 'Por debajo de la meta'
                        )}
                    </div>
                </div>
            </div>
            <p className="analytics-footnote">
                Metas de referencia: 10–50 visitas y 10–20 clics a WhatsApp por mes, con un tiempo promedio por visita de al menos 1 minuto.
            </p>
        </div>
    );
};

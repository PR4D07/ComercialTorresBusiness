import { StrictMode, useState, useEffect, Component, type ReactNode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID
const isProd = import.meta.env.MODE === 'production'
if (isProd && gaId) {
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  document.head.appendChild(script)

  type DataLayerArgs = [key: string, ...rest: unknown[]]

  interface AnalyticsWindow extends Window {
    dataLayer?: unknown[]
    gtag?: (...args: DataLayerArgs) => void
  }

  const win = window as AnalyticsWindow
  win.dataLayer = win.dataLayer || []
  win.gtag = (...args: DataLayerArgs) => {
    win.dataLayer?.push(args)
  }
  win.gtag('js', new Date())
  win.gtag('config', gaId)
}

// ErrorBoundary para capturar errores de renderizado
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '5px', margin: '20px', fontFamily: 'sans-serif' }}>
          <h1>Algo salió mal en la aplicación (Render Error).</h1>
          <p>Por favor, revisa la consola para más detalles o intenta recargar.</p>
          <pre style={{ overflow: 'auto', marginTop: '10px' }}>{this.state.error?.toString()}</pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: 20, padding: 10 }}>Recargar</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// AppLoader para capturar errores de importación/evaluación de módulos
type AppComponentType = ComponentType | null

function AppLoader() {
  const [AppModule, setAppModule] = useState<AppComponentType>(null);
  const [loadError, setLoadError] = useState<unknown>(null);

  useEffect(() => {
    console.log("Iniciando carga dinámica de App.tsx...");
    import('./App.tsx')
      .then(module => {
        console.log("App.tsx cargado exitosamente");
        setAppModule(() => module.default);
      })
      .catch(err => {
        console.error("Error crítico cargando App.tsx:", err);
        setLoadError(err);
      });
  }, []);

  if (loadError) {
    return (
      <div style={{ padding: 20, color: 'white', backgroundColor: '#D32F2F', fontFamily: 'sans-serif', height: '100vh' }}>
        <h1>Error Fatal de Carga</h1>
        <p>No se pudo iniciar la aplicación debido a un error en el código.</p>
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: 15, borderRadius: 5, overflow: 'auto', margin: '15px 0' }}>
          <strong>Detalle del error:</strong>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{String(loadError)}</pre>
        </div>
        <p>Verifica la consola del navegador (F12) para más detalles técnicos.</p>
        <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', cursor: 'pointer' }}>Intentar de nuevo</button>
      </div>
    );
  }

  if (!AppModule) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#555' }}>
        <div style={{ width: 40, height: 40, border: '4px solid #ddd', borderTopColor: '#e3000f', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <h2 style={{ marginTop: 20 }}>Iniciando Comercial Torres...</h2>
        <p>Cargando módulos...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <AppModule />;
}

console.log("Montando root...");

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error("Elemento root no encontrado en index.html");

  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <AppLoader />
      </ErrorBoundary>
    </StrictMode>,
  )
} catch (e) {
  console.error("Error fatal al montar root:", e);
  document.body.innerHTML = `<div style="color:red; padding:20px;"><h1>Error Fatal al Montar React</h1><pre>${e}</pre></div>`;
}

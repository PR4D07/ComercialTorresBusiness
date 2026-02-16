import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, signInWithGoogle, loginWithEmail, registerWithEmail, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from || '/profile';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al autenticarse');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      setError('No se pudo iniciar sesión con Google');
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Ingresa tu correo para recuperar la contraseña');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email);
    } catch (err: any) {
      setError(err.message || 'No se pudo enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page container">
      <div className="login-card">
        <h2>{isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
        {error && <p style={{ color: '#c62828', marginBottom: 16 }}>{error}</p>}
        <form onSubmit={handleEmailAuth}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {isRegistering ? 'Registrarse' : 'Ingresar'}
          </button>
        </form>

        <button type="button" onClick={handleResetPassword} disabled={loading} style={{ marginTop: 8 }}>
          Recuperar contraseña
        </button>

        <div style={{ margin: '16px 0' }}>
          <span>o continúa con</span>
        </div>

        <button type="button" onClick={handleGoogleLogin} disabled={loading}>
          Continuar con Google
        </button>

        <div style={{ marginTop: 16 }}>
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(null);
            }}
          >
            {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
}


import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, signInWithGoogle, loginWithEmail, registerWithEmail, resetPassword, updateUserPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user && !needsPasswordSetup) {
      const state = location.state as { from?: string } | null;
      const from = state?.from || '/profile';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location, needsPasswordSetup]);

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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocurrió un error al autenticarse';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const isNewUser = await signInWithGoogle();
      if (isNewUser) {
        setNeedsPasswordSetup(true);
      }
    } catch {
      setError('No se pudo iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await updateUserPassword(newPassword);
      setNeedsPasswordSetup(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo guardar la contraseña';
      setError(message);
    } finally {
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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo enviar el correo de recuperación';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page container">
      <div className="login-card">
        <h2 className="login-title">Bienvenido</h2>
        <p className="login-subtitle">
          {isRegistering
            ? 'Crea tu cuenta para guardar tus datos y futuras compras.'
            : 'Inicia sesión para ver tu perfil y pedidos.'}
        </p>
        {error && <p className="login-error">{error}</p>}
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
            {isRegistering ? 'Registrarse' : 'Iniciar sesión'}
          </button>
        </form>

        {!isRegistering && (
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={loading}
            className="login-link-button"
          >
            ¿Olvidaste tu contraseña?
          </button>
        )}

        <div className="login-divider">
          <span>o continúa con</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="login-google-button"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt=""
            className="login-google-icon"
          />
          <span>Continuar con Google</span>
        </button>

        {needsPasswordSetup && (
          <div className="password-setup">
            <h3>Crea tu contraseña</h3>
            <p>
              Es tu primera vez iniciando con Google. Crea una contraseña para poder ingresar también con correo y clave.
            </p>
            <form onSubmit={handleSetPassword} className="password-setup-form">
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                Guardar contraseña
              </button>
            </form>
          </div>
        )}

        <div className="login-footer">
          {isRegistering ? (
            <button
              type="button"
              onClick={() => {
                setIsRegistering(false);
                setError(null);
              }}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          ) : (
            <>
              <span>¿No tienes cuenta? </span>
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setError(null);
                }}
              >
                Regístrate aquí
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

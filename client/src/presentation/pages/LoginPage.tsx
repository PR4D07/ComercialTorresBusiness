import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import './LoginPage.css';

export default function LoginPage() {
  const { signInWithGoogle, loginWithEmail, registerWithEmail, resetPassword, updateUserPassword, user } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState(''); // Estado para nueva contraseña tras Google Login
  const [showPasswordSetup, setShowPasswordSetup] = useState(false); // Modal/Form para crear contraseña
  const [isGoogleLoginProcessing, setIsGoogleLoginProcessing] = useState(false); // Flag para bloquear redirección
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user && !showPasswordSetup && !isGoogleLoginProcessing) {
      navigate('/profile');
    }
  }, [user, navigate, showPasswordSetup, isGoogleLoginProcessing]);

  const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado. Si usas Gmail, prueba el botón "Continuar con Google".';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Credenciales no válidas. Si usas Google, usa el botón o crea una contraseña con "Olvidaste tu contraseña".';
      case 'auth/weak-password':
        return 'La contraseña es muy débil. Debe tener al menos 6 caracteres.';
      case 'auth/popup-closed-by-user':
        return 'Se cerró la ventana de inicio de sesión antes de terminar.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Intenta de nuevo más tarde.';
      default:
        return 'Ocurrió un error al intentar autenticarse. Intenta nuevamente.';
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsGoogleLoginProcessing(true); // Bloqueamos redirección
    try {
      const isNewUser = await signInWithGoogle();
      if (isNewUser) {
        setShowPasswordSetup(true); // Mostramos formulario de crear contraseña
        setSuccessMsg("¡Bienvenido! Para mayor seguridad y flexibilidad, crea una contraseña para tu cuenta.");
      } 
      // Si no es nuevo usuario, isGoogleLoginProcessing se quedará en true un momento
      // pero el useEffect eventualmente redirigirá cuando lo pongamos en false o si decidimos redirigir manualmente.
      // Sin embargo, para usuarios recurrentes, queremos que redirija.
      
      if (!isNewUser) {
         setIsGoogleLoginProcessing(false); // Permitimos redirección
      }
    } catch (error: any) {
      console.error("Error completo de Firebase:", error);
      setErrorMsg(getFriendlyErrorMessage(error.code));
      setIsGoogleLoginProcessing(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    
    try {
      await updateUserPassword(newPassword);
      setShowPasswordSetup(false);
      setIsGoogleLoginProcessing(false);
      // El useEffect se encargará de redirigir
    } catch (error: any) {
      setErrorMsg("Error al guardar la contraseña: " + error.message);
    }
  };
  
  const handleSkipPasswordSetup = () => {
    setShowPasswordSetup(false);
    setIsGoogleLoginProcessing(false);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMsg("Ingresa tu correo electrónico para recuperar la contraseña.");
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await resetPassword(email);
      setSuccessMsg("Correo de recuperación enviado. Revisa tu bandeja de entrada.");
    } catch (error: any) {
      console.error("Error recuperando contraseña:", error);
      setErrorMsg(getFriendlyErrorMessage(error.code));
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (error: any) {
      console.error("Error de autenticación:", error);
      setErrorMsg(getFriendlyErrorMessage(error.code));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {showPasswordSetup ? (
          <>
            <h2>Crear Contraseña</h2>
            <p>Has iniciado sesión con Google correctamente. Configura una contraseña para poder ingresar también con tu correo y clave en el futuro.</p>
            
            {errorMsg && (
              <div className="error-alert" style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '15px',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSetNewPassword} className="email-form">
              <input
                type="password"
                placeholder="Nueva Contraseña (mínimo 6 caracteres)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="input-field"
                minLength={6}
              />
              <button type="submit" className="btn-primary">
                Guardar Contraseña y Continuar
              </button>
              <button 
                type="button" 
                onClick={handleSkipPasswordSetup}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  textDecoration: 'underline',
                  fontSize: '0.9rem',
                  marginTop: '15px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Omitir por ahora
              </button>
            </form>
          </>
        ) : (
          <>
            <h2>{isRegistering ? 'Crear Cuenta' : 'Bienvenido'}</h2>
            <p>{isRegistering ? 'Regístrate para continuar' : 'Inicia sesión para ver tu perfil y pedidos'}</p>
            
            {successMsg && (
              <div className="success-alert" style={{
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '15px',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                {successMsg}
              </div>
            )}
    
            {errorMsg && (
              <div className="error-alert" style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '15px',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                {errorMsg}
              </div>
            )}
            
            <form onSubmit={handleEmailAuth} className="email-form">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
              <button type="submit" className="btn-primary">
                {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
              </button>
              
              {!isRegistering && (
                <button 
                  type="button" 
                  onClick={handleResetPassword}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    textDecoration: 'underline',
                    fontSize: '0.8rem',
                    marginTop: '10px',
                    cursor: 'pointer'
                  }}
                >
                  ¿Olvidaste tu contraseña o quieres crear una?
                </button>
              )}
            </form>
    
            <div className="divider">
              <span>O continúa con</span>
            </div>
    
            <button 
              className="google-btn"
              onClick={handleGoogleLogin}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
              <span>Google</span>
            </button>
    
            <div className="toggle-auth">
              <p>
                {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                <button className="btn-link" onClick={() => {
                  setIsRegistering(!isRegistering);
                  setErrorMsg(null);
                  setPassword('');
                }}>
                  {isRegistering ? 'Inicia sesión aquí' : 'Regístrate aquí'}
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

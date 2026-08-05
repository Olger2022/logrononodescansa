import React, { useState } from 'react';
import { UserProfile, LogronoSector } from '../types';
import { 
  Building2, 
  Mail, 
  Lock, 
  User, 
  CreditCard, 
  MapPin, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  KeyRound, 
  ShieldCheck, 
  UserPlus, 
  LogIn, 
  HelpCircle,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface LoginModuleProps {
  onLoginSuccess: (user: UserProfile) => void;
  lang?: 'es' | 'shuar';
  onBackToSplash?: () => void;
}

type AuthMode = 'login' | 'register' | 'recover';

const LOGRONO_SECTORS: LogronoSector[] = [
  'Logroño Centro (Cabecera)',
  'Parroquia Yaupi',
  'Parroquia Shimpis',
  'Comunidad Shuar Kakaim',
  'Comunidad Shuar Kimius',
  'Sector Río Upano',
  'Sector Transkutukú'
];

export const LoginModule: React.FC<LoginModuleProps> = ({ onLoginSuccess, onBackToSplash }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCedula, setRegCedula] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSector, setRegSector] = useState<LogronoSector>('Logroño Centro (Cabecera)');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');

  // Password Recovery Form State
  const [recoverIdentifier, setRecoverIdentifier] = useState('');
  const [recoverySuccessMessage, setRecoverySuccessMessage] = useState('');
  const [recoverError, setRecoverError] = useState('');

  // Handle Standard Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Por favor complete todos los campos requeridos.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user: UserProfile = {
        id: `usr-${Date.now()}`,
        name: loginEmail.includes('admin') ? 'Ing. María Viteri' : 'Juan Shakaim',
        email: loginEmail,
        role: loginEmail.includes('admin') ? 'admin' : 'ciudadano',
        sector: 'Logroño Centro (Cabecera)',
        provider: 'password',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };
      onLoginSuccess(user);
    }, 600);
  };

  // Handle Google Login Simulation
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const googleUser: UserProfile = {
        id: `usr-google-${Date.now()}`,
        name: 'Carlos Antuash (Google)',
        email: 'carlos.antuash.logrono@gmail.com',
        role: 'ciudadano',
        sector: 'Comunidad Shuar Kakaim',
        provider: 'google',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      };
      onLoginSuccess(googleUser);
    }, 800);
  };

  // Handle Registration Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim() || !regCedula.trim() || !regPassword.trim()) {
      setRegError('Todos los campos marcados con (*) son obligatorios.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Las contraseñas no coinciden. Verifique ambas claves.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('La contraseña debe contener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser: UserProfile = {
        id: `usr-new-${Date.now()}`,
        name: regName,
        email: regEmail,
        cedula: regCedula,
        sector: regSector,
        role: 'ciudadano',
        provider: 'password'
      };
      onLoginSuccess(newUser);
    }, 700);
  };

  // Handle Recovery Submit
  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverError('');
    setRecoverySuccessMessage('');

    if (!recoverIdentifier.trim()) {
      setRecoverError('Ingrese su correo electrónico o número de cédula registrado.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRecoverySuccessMessage(
        `Se ha enviado un correo con las instrucciones de recuperación a "${recoverIdentifier}". Por favor revise su bandeja de entrada o correo no deseado.`
      );
    }, 800);
  };

  // Quick Demo Autofill Helpers
  const autofillDemo = (role: 'ciudadano' | 'admin' | 'tecnico') => {
    if (role === 'ciudadano') {
      setLoginEmail('ciudadano@logrono.gob.ec');
      setLoginPassword('logrono2026');
    } else if (role === 'admin') {
      setLoginEmail('admin.despacho@logrono.gob.ec');
      setLoginPassword('adminLogrono2026');
    } else {
      setLoginEmail('obraspublicas@logrono.gob.ec');
      setLoginPassword('tecnicoGad2026');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-600/20 via-teal-700/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Municipal Branding Header */}
      <header className="relative z-10 border-b border-emerald-900/60 bg-emerald-950/80 backdrop-blur-md px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-amber-400 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight text-white font-serif">
                GAD MUNICIPAL DEL CANTÓN LOGROÑO
              </h2>
              <p className="text-[11px] text-emerald-300/80 font-medium">
                Morona Santiago • Ecuador • Plataforma Digital Ciudadana 2026
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {onBackToSplash && (
              <button
                type="button"
                onClick={onBackToSplash}
                className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 transition-colors flex items-center space-x-1 text-xs cursor-pointer"
                title="Volver a la pantalla de bienvenida"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Bienvenida</span>
              </button>
            )}
            <div className="hidden sm:flex items-center space-x-2 bg-emerald-900/40 border border-emerald-700/40 px-3 py-1 rounded-full text-[11px] text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Acceso Seguro Encriptado SSL 256-bit</span>
            </div>
          </div>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Card Title & Municipal Logotype Emblem */}
          <div className="bg-gradient-to-b from-emerald-950 to-slate-900 p-6 border-b border-slate-800 text-center relative">
            {/* Municipal Logotype Emblem */}
            <div className="mx-auto w-16 h-16 mb-3 rounded-2xl bg-slate-950 border border-emerald-500/30 p-2 shadow-inner flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl animate-pulse" />
              {/* Official Custom Emblem SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-400">
                <path fill="currentColor" opacity="0.15" d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" />
                <path fill="none" stroke="currentColor" strokeWidth="4" d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" />
                <circle cx="50" cy="50" r="22" fill="none" stroke="#F59E0B" strokeWidth="3" />
                <path fill="#10B981" d="M35 60 L50 35 L65 60 Z" />
                <path fill="#34D399" d="M45 60 L55 45 L65 60 Z" />
                <path stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" d="M30 70 Q50 78 70 70" />
              </svg>
            </div>

            <h1 className="text-2xl font-black text-white font-serif tracking-tight">
              Logroño Conecta
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Sistema de Participación Ciudadana y Gestión Municipal
            </p>

            {/* Navigation Tabs (Login, Register, Recovery) */}
            <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 mt-5">
              <button
                type="button"
                onClick={() => { setMode('login'); setLoginError(''); }}
                className={`py-2 px-1 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Ingresar</span>
              </button>

              <button
                type="button"
                onClick={() => { setMode('register'); setRegError(''); }}
                className={`py-2 px-1 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Registro</span>
              </button>

              <button
                type="button"
                onClick={() => { setMode('recover'); setRecoverError(''); setRecoverySuccessMessage(''); }}
                className={`py-2 px-1 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                  mode === 'recover'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Recuperar</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            
            {/* GOOGLE SIGN-IN OPTION (Professional Button with Multi-Color Google Image Icon) */}
            {mode === 'login' && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold py-3 px-4 rounded-xl border border-slate-300 shadow-sm hover:shadow transition-all flex items-center justify-center space-x-3 cursor-pointer group disabled:opacity-50"
                >
                  {/* Google SVG Official Logo Icon */}
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm">Continuar con Correo de Google</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    o con credenciales GAD
                  </span>
                </div>
              </>
            )}

            {/* MODE 1: LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="bg-red-950/80 border border-red-500/60 p-3 rounded-xl flex items-center space-x-2 text-xs text-red-200">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Correo Electrónico o Usuario GAD *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="ejemplo@logrono.gob.ec"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none transition-all focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-300">
                      Contraseña *
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('recover')}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      ¿Olvidó su clave?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white rounded-xl pl-9 pr-10 py-2.5 text-xs outline-none transition-all focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Professional Action Button with Image Icon Badge */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-emerald-900/40 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-950/60 flex items-center justify-center text-emerald-300">
                    <LogIn className="w-3.5 h-3.5" />
                  </div>
                  <span>{isLoading ? 'Autenticando...' : 'Iniciar Sesión'}</span>
                </button>

                {/* Quick Autofill Presets for Testing */}
                <div className="pt-3 border-t border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider text-center">
                    Cuentas de prueba rápida:
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => autofillDemo('ciudadano')}
                      className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-medium text-slate-300 text-center transition-colors cursor-pointer"
                    >
                      👤 Ciudadano
                    </button>
                    <button
                      type="button"
                      onClick={() => autofillDemo('admin')}
                      className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-medium text-amber-300 text-center transition-colors cursor-pointer"
                    >
                      🛡️ Admin GAD
                    </button>
                    <button
                      type="button"
                      onClick={() => autofillDemo('tecnico')}
                      className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-medium text-emerald-300 text-center transition-colors cursor-pointer"
                    >
                      🔧 Técnico
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* MODE 2: REGISTRATION FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                {regError && (
                  <div className="bg-red-950/80 border border-red-500/60 p-2.5 rounded-xl flex items-center space-x-2 text-xs text-red-200">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Nombres y Apellidos *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Ej. Juan Shakaim Antuash"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white rounded-xl pl-9 pr-3 py-2 text-xs outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Cédula / RUC *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                        <CreditCard className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={regCedula}
                        onChange={(e) => setRegCedula(e.target.value)}
                        placeholder="1400XXXXXX"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white rounded-xl pl-8 pr-2 py-2 text-xs outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Teléfono Móvil
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="099XXXXXXX"
                        className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white rounded-xl pl-8 pr-2 py-2 text-xs outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Correo Electrónico *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white rounded-xl pl-9 pr-3 py-2 text-xs outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Sector o Parroquia de Residencia *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <select
                      value={regSector}
                      onChange={(e) => setRegSector(e.target.value as LogronoSector)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white rounded-xl pl-9 pr-3 py-2 text-xs outline-none transition-all"
                    >
                      {LOGRONO_SECTORS.map((sec) => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white rounded-xl px-3 py-2 text-xs outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Confirmar Clave *
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white rounded-xl px-3 py-2 text-xs outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Professional Registration Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-3"
                >
                  <div className="w-5 h-5 rounded-md bg-emerald-950/60 flex items-center justify-center text-emerald-300">
                    <UserPlus className="w-3.5 h-3.5" />
                  </div>
                  <span>{isLoading ? 'Creando Cuenta...' : 'Crear Cuenta Ciudadana'}</span>
                </button>
              </form>
            )}

            {/* MODE 3: PASSWORD & USERNAME RECOVERY MODULE */}
            {mode === 'recover' && (
              <form onSubmit={handleRecoverySubmit} className="space-y-4">
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs text-slate-300 flex items-start space-x-2">
                  <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p>
                    Ingrese su correo electrónico registrado o su número de cédula. Le enviaremos un código de seguridad para restablecer su contraseña.
                  </p>
                </div>

                {recoverError && (
                  <div className="bg-red-950/80 border border-red-500/60 p-3 rounded-xl flex items-center space-x-2 text-xs text-red-200">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>{recoverError}</span>
                  </div>
                )}

                {recoverySuccessMessage && (
                  <div className="bg-emerald-950/90 border border-emerald-500/60 p-3 rounded-xl space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-emerald-300 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Instrucciones Enviadas</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {recoverySuccessMessage}
                    </p>
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="mt-2 w-full bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Volver al Inicio de Sesión
                    </button>
                  </div>
                )}

                {!recoverySuccessMessage && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Correo Electrónico o Cédula de Identidad *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={recoverIdentifier}
                          onChange={(e) => setRecoverIdentifier(e.target.value)}
                          placeholder="ejemplo@logrono.gob.ec o 1400XXXXXX"
                          className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 text-white rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Professional Recovery Action Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      <div className="w-6 h-6 rounded-lg bg-amber-950/40 flex items-center justify-center text-slate-950">
                        <KeyRound className="w-3.5 h-3.5" />
                      </div>
                      <span>{isLoading ? 'Procesando Solicitud...' : 'Enviar Enlace de Recuperación'}</span>
                    </button>
                  </>
                )}
              </form>
            )}

          </div>

          {/* Footer Card Info */}
          <div className="bg-slate-950/80 p-3 border-t border-slate-800 text-center text-[11px] text-slate-400">
            <span>¿Necesita asistencia presencial? Visite el Despacho GAD Cantón Logroño.</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-emerald-900/60 bg-emerald-950/90 text-center py-3 px-4 text-xs text-emerald-300/80">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 GAD Municipal de Logroño • Morona Santiago, Ecuador</span>
          <div className="flex items-center space-x-2 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Plataforma con Interoperabilidad Intercultural Shuar</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

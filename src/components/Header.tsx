import React, { useState } from 'react';
import { Box, Phone, Menu, X, ArrowRight, ShieldCheck, MapPin, User, LogOut } from 'lucide-react';

interface HeaderProps {
  onOpenEstimator: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenChat: () => void;
  onOpenCrmDrawer?: () => void;
  leadsCount?: number;
  currentUser?: { displayName?: string | null; email?: string | null; photoURL?: string | null } | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenEstimator,
  onNavigateSection,
  onOpenChat,
  onOpenCrmDrawer,
  leadsCount = 0,
  currentUser,
  onSignIn,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Inicio', target: 'hero' },
    { label: 'Quiénes somos', target: 'nosotros' },
    { label: 'Construcción de Viviendas', target: 'viviendas' },
    { label: 'Reformas Integrales', target: 'reformas' },
    { label: 'Cómo funciona', target: 'proceso' },
    { label: 'Contacto', target: 'contacto' },
  ];

  const handleNavClick = (target: string) => {
    onNavigateSection(target);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-all">
      {/* Top micro-bar with location and direct contact */}
      <div className="bg-stone-950 text-stone-400 text-xs border-b border-stone-800/80 px-4 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              Sede: Vivero de Empresas de Torrijos (Toledo, España)
            </span>
            <span className="text-stone-600">·</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Técnicos Colegiados & Garantía Decenal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+34925770033"
              className="flex items-center gap-1.5 text-stone-300 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-500" />
              <span>Atención Técnica: 925 77 00 33</span>
            </a>
            <span className="text-stone-600">·</span>
            <button
              onClick={onOpenChat}
              className="text-amber-400 hover:underline hover:text-amber-300 transition-colors"
            >
              Consultar con Asistente Virtual
            </button>
            {onOpenCrmDrawer && (
              <>
                <span className="text-stone-600">·</span>
                <button
                  onClick={onOpenCrmDrawer}
                  className="text-stone-300 hover:text-amber-400 flex items-center gap-1.5 transition-colors font-mono"
                  title="Panel de seguimiento de leads de Torrijos"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>CRM Leads {leadsCount > 0 ? `(${leadsCount})` : ''}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-11 h-11 bg-gradient-to-br from-amber-500 via-amber-600 to-stone-900 rounded-lg p-0.5 flex items-center justify-center shadow-lg shadow-amber-600/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-stone-950 rounded-[7px] flex items-center justify-center relative overflow-hidden">
              <Box className="w-6 h-6 text-amber-400 relative z-10 transition-transform group-hover:rotate-12" />
              <div className="absolute inset-0 bg-amber-500/10 blur-xs" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white font-mono">
                PROJECT<span className="text-amber-500 font-sans ml-1">3D</span>
              </span>
              <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-semibold">
                Torrijos
              </span>
            </div>
            <span className="text-[11px] text-stone-400 tracking-wide font-normal">
              Viviendas Adosadas & Reformas Integrales
            </span>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-300">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleNavClick(link.target)}
              className="hover:text-amber-400 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA Button & Google Auth */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2 bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs font-mono">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Usuario'}
                  className="w-5 h-5 rounded-full object-cover border border-amber-500/50"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="text-stone-300 max-w-[110px] truncate text-[11px]">
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
              {onSignOut && (
                <button
                  onClick={onSignOut}
                  title="Cerrar sesión"
                  className="text-stone-500 hover:text-red-400 ml-1 p-0.5 rounded transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            onSignIn && (
              <button
                onClick={onSignIn}
                className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 hover:border-amber-500/40 text-stone-200 text-xs font-medium px-3 py-2 rounded-lg transition-colors shadow-sm"
                title="Acceder con Google Workspace"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>Google</span>
              </button>
            )
          )}

          {onOpenCrmDrawer && (
            <button
              onClick={onOpenCrmDrawer}
              className="text-xs font-mono text-stone-300 hover:text-amber-400 px-3 py-2 rounded-lg border border-stone-800 hover:border-amber-500/40 bg-stone-950 flex items-center gap-1.5 transition-colors"
              title="Panel de CRM y trazabilidad de leads"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>CRM Leads {leadsCount > 0 ? `(${leadsCount})` : ''}</span>
            </button>
          )}
          <button
            onClick={onOpenEstimator}
            className="relative group overflow-hidden bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm px-5 py-2.5 rounded-lg transition-all shadow-md shadow-amber-500/25 flex items-center gap-2"
          >
            <span>Calcula tu proyecto</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenEstimator}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs px-3 py-1.5 rounded-md sm:hidden"
          >
            Calcula
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-400 hover:text-white focus:outline-none"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 border-b border-stone-800 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => handleNavClick(link.target)}
                className="text-left py-2 px-3 text-stone-200 hover:bg-stone-900 rounded-md text-sm font-medium hover:text-amber-400 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEstimator();
              }}
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow"
            >
              <span>Calcula tu proyecto (Paso a paso)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {currentUser ? (
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-900 border border-stone-800 text-xs">
                <div className="flex items-center gap-2">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Usuario'}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-stone-300 truncate max-w-[150px]">
                    {currentUser.displayName || currentUser.email}
                  </span>
                </div>
                {onSignOut && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSignOut();
                    }}
                    className="text-stone-400 hover:text-red-400 text-xs font-mono"
                  >
                    Salir
                  </button>
                )}
              </div>
            ) : (
              onSignIn && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSignIn();
                  }}
                  className="w-full border border-stone-700 bg-stone-900 text-stone-200 py-2 rounded-lg text-xs flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>Acceder con Google</span>
                </button>
              )
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className="w-full border border-stone-700 hover:border-stone-600 text-stone-300 py-2 rounded-lg text-xs"
            >
              Hablar con el Asistente IA
            </button>
            {onOpenCrmDrawer && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCrmDrawer();
                }}
                className="w-full border border-stone-800 bg-stone-900 text-stone-300 py-2 rounded-lg text-xs font-mono flex items-center justify-center gap-2 hover:text-amber-400"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>CRM Leads {leadsCount > 0 ? `(${leadsCount})` : ''}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

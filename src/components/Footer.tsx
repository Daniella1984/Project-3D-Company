import React from 'react';
import { Box, MapPin, Phone, Mail, ShieldCheck, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenEstimator: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenEstimator }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 text-stone-400 border-t border-stone-800 text-xs font-normal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-stone-900 rounded-lg p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-stone-950 rounded-[6px] flex items-center justify-center">
                  <Box className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-mono">
                PROJECT<span className="text-amber-500 font-sans ml-1">3D</span>
              </span>
            </div>

            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Empresa pionera en estimación geométrica 3D, construcción de viviendas adosadas de alta eficiencia y reformas integrales. Con sede física en el <strong>Vivero de Empresas de Torrijos (Toledo, España)</strong>.
            </p>

            <div className="pt-2 text-stone-500 font-mono text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Vivero de Empresas de Torrijos · 45500 Toledo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>Atención Técnica: +34 925 77 00 33</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-stone-200 uppercase font-semibold tracking-wider">
              Navegación
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateSection('hero')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('nosotros')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Quiénes somos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('viviendas')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Construcción de Viviendas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('reformas')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Reformas Integrales
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('proceso')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Cómo funciona
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('contacto')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          {/* Servicios y Ecosistema 3D */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-stone-200 uppercase font-semibold tracking-wider">
              Ecosistema 3D
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenEstimator}
                  className="text-amber-400 hover:text-amber-300 font-medium"
                >
                  Calcula tu proyecto (Paso a paso)
                </button>
              </li>
              <li>
                <span className="text-stone-400">Visor de Archivos STL / OBJ</span>
              </li>
              <li>
                <span className="text-stone-400">Margen Preventivo del 15%</span>
              </li>
              <li>
                <span className="text-stone-400">Verificación CTE & Passivhaus</span>
              </li>
              <li>
                <span className="text-stone-400">Revisión Técnica en Parcela</span>
              </li>
            </ul>
          </div>

          {/* Garantías y Seguridad */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-stone-200 uppercase font-semibold tracking-wider">
              Régimen Garantías
            </div>
            <div className="space-y-2 text-[11px] text-stone-400 leading-relaxed">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Garantía Decenal LOE
              </div>
              <p>
                Técnicos colegiados adscritos al Colegio Oficial de Aparejadores y Arquitectos Técnicos de Toledo.
              </p>
              <p className="text-[10px] text-stone-500 font-mono">
                Póliza de Responsabilidad Civil Profesional suscrita.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-stone-500">
            © {new Date().getFullYear()} PROJECT 3D S.L. · Todos los derechos reservados · Vivero de Empresas de Torrijos (Toledo, España).
          </p>

          <div className="flex items-center gap-6">
            <span className="text-stone-500 hover:text-stone-300 cursor-pointer">Aviso Legal</span>
            <span className="text-stone-500 hover:text-stone-300 cursor-pointer">Privacidad RGPD</span>
            <span className="text-stone-500 hover:text-stone-300 cursor-pointer">Cookies</span>
            <button
              onClick={scrollToTop}
              className="p-1.5 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white rounded-lg transition-colors"
              aria-label="Subir arriba"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

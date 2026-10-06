import React from 'react';
import {
  UploadCloud,
  MessageSquareCode,
  ShieldAlert,
  Sparkles,
  Building2,
  Layers,
  CheckCircle2,
  ChevronRight,
  Compass,
  Play,
  Video,
} from 'lucide-react';
import { House3DVideoPlayer } from './House3DVideoPlayer';

interface HeroProps {
  onStartEstimatorWithStl: () => void;
  onOpenChat: () => void;
  onExploreProjects: () => void;
  onOpenVideoModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartEstimatorWithStl,
  onOpenChat,
  onExploreProjects,
  onOpenVideoModal,
}) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-stone-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-stone-800">
      {/* Subtle architectural grid pattern background */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Ambient gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-600/15 via-orange-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Meta kicker (anti-pill clean unboxed text) */}
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 tracking-wider uppercase">
              <Compass className="w-4 h-4 text-amber-500" />
              <span>Innovación Constructiva</span>
              <span className="text-stone-600">·</span>
              <span>Vivero de Empresas de Torrijos (Toledo)</span>
            </div>

            {/* Powerful Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Construcción de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">viviendas adosadas</span> y reformas con precisión 3D.
            </h1>

            {/* Subtitle with Torrijos, Toledo and Spain context */}
            <p className="text-lg sm:text-xl text-stone-300 leading-relaxed max-w-2xl font-normal">
              Digitalizamos la edificación residencial desde nuestra sede en el <strong>Vivero de Empresas de Torrijos (Toledo, España)</strong>. Modelado geométrico de archivos STL, estimación paramétrica con margen de seguridad del 15% y control de obra sin sorpresas de costes.
            </p>

            {/* Two Primary CTAs demanded by user prompt + Video Quick Tour */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onStartEstimatorWithStl}
                className="group bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-7 py-4 rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-3 text-base"
              >
                <UploadCloud className="w-5 h-5 text-stone-950 transition-transform group-hover:-translate-y-0.5" />
                <span>Subir archivo STL</span>
              </button>

              <button
                onClick={onOpenChat}
                className="group bg-stone-900 hover:bg-stone-800 text-stone-100 border border-stone-700 hover:border-amber-500/50 font-semibold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-base shadow-sm"
              >
                <MessageSquareCode className="w-5 h-5 text-amber-400 transition-transform group-hover:scale-110" />
                <span>Hablar con el Asistente IA</span>
              </button>
            </div>

            {/* Video Tour Quick Action */}
            {onOpenVideoModal && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onOpenVideoModal}
                  className="inline-flex items-center gap-2 text-xs font-mono text-stone-400 hover:text-amber-400 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                    <Play className="w-3 h-3 fill-amber-400 ml-0.5" />
                  </span>
                  <span>Ver video cinematográfico 3D de vivienda adosada en Torrijos (4K)</span>
                </button>
              </div>
            )}

            {/* Trust and Technical Guarantees row */}
            <div className="pt-6 border-t border-stone-800/80 grid grid-cols-3 gap-4 text-xs font-mono text-stone-400">
              <div>
                <div className="text-amber-400 font-bold text-lg font-mono">Fase 1 Gratis</div>
                <div className="text-stone-400 leading-snug">Estimación global +15% margen</div>
              </div>
              <div>
                <div className="text-stone-200 font-bold text-lg font-mono">Fase 2 Pro</div>
                <div className="text-stone-400 leading-snug">Desglose según m² (Deducible)</div>
              </div>
              <div>
                <div className="text-stone-200 font-bold text-lg font-mono">RGPD · UE</div>
                <div className="text-stone-400 leading-snug">Custodia cifrada de archivos STL</div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D House Video & Interactive BIM Showcase */}
          <div className="lg:col-span-5 relative">
            <House3DVideoPlayer
              onOpenEstimator={onStartEstimatorWithStl}
              onExpandFullscreen={onOpenVideoModal}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

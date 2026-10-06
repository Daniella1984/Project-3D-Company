import React, { useRef, useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Download, ArrowRight, ShieldCheck, CheckCircle2, Building, Sparkles } from 'lucide-react';

interface HouseVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEstimator: () => void;
}

export const HouseVideoModal: React.FC<HouseVideoModalProps> = ({
  isOpen,
  onClose,
  onOpenEstimator,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!isOpen) return null;

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-stone-900 border-2 border-amber-500/70 rounded-3xl shadow-2xl overflow-hidden text-stone-100 relative">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Recorrido Cinematográfico 3D · Vivienda Adosada
                </h3>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                  Torrijos (Toledo)
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Visualización tridimensional y acabados arquitectónicos de alta eficiencia
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Display */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://cdn.coverr.co/videos/coverr-modern-house-architecture-5353/1080p.mp4" type="video/mp4" />
            <source src="https://cdn.coverr.co/videos/coverr-modern-minimalist-house-5682/1080p.mp4" type="video/mp4" />
          </video>

          {/* Video Overlay Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-stone-950/75 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-stone-800">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="p-2 rounded-xl bg-amber-500 text-stone-950 hover:bg-amber-400 font-bold transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={handleToggleMute}
                className="p-2 rounded-xl bg-stone-800 text-stone-200 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-xs font-mono text-stone-300">
                Modelo Adosado Passivhaus · 142 m²
              </span>
            </div>

            <div className="text-[11px] font-mono text-amber-400 font-bold hidden sm:block">
              PROJECT 3D · Torrijos (Toledo)
            </div>
          </div>
        </div>

        {/* Technical Highlights & CTA */}
        <div className="p-6 bg-stone-950 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-mono text-amber-400 font-bold uppercase">
              ¿Quieres construir un modelo similar o reformar el tuyo?
            </div>
            <div className="text-xs text-stone-300">
              Calcula gratis tu estimación inicial aplicando el 15% de margen preventivo.
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenEstimator();
              }}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
            >
              <span>Calcular Presupuesto en 5 Pasos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

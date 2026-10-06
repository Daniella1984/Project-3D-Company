import React from 'react';
import {
  ShieldCheck,
  Scale,
  FileText,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  MapPin,
  Lock,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ValidationTransparencyProps {
  onRequestReview: () => void;
}

export const ValidationTransparencySection: React.FC<ValidationTransparencyProps> = ({
  onRequestReview,
}) => {
  return (
    <section className="py-20 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-mono text-amber-500 uppercase tracking-widest flex items-center gap-2">
            <Scale className="w-4 h-4" />
            <span>Modelo Comercial & Rigor Técnico</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Modelo de Dos Fases Comerciales y Transparencia Radical (+15%)
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Eliminamos la incertidumbre en los costes de autopromoción y reforma. Conoce con claridad qué obtienes de forma totalmente gratuita y qué incluye el estudio técnico visado de Nivel 2.
          </p>
        </div>

        {/* TWO COMMERCIAL TIERS COMPARISON GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Card Tier 1: Nivel 1 Gratuito */}
          <div className="bg-stone-900 rounded-3xl border border-stone-800 p-8 flex flex-col justify-between space-y-6 hover:border-stone-700 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase bg-stone-800 text-stone-300 border border-stone-700 px-3 py-1 rounded-full">
                  Fase 1 · Acceso Inmediato
                </span>
                <span className="text-base font-mono font-black text-emerald-400">
                  100% GRATUITO
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">
                  Nivel 1: Estimación Inicial Gratuita
                </h3>
                <p className="text-stone-400 text-xs sm:text-sm mt-2 leading-relaxed">
                  Calcula de manera instantánea la volumetría y el rango económico global de tu vivienda adosada o reforma antes de gastar un solo euro.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-stone-300 pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Subida de archivo STL con visor 3D web ligero en tiempo real.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Cálculo paramétrico aplicando el <strong>15% de margen de seguridad</strong> preventivo.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Aviso legal explícito de no contractualidad para proteger tus expectativas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Dossier resumen descargable en PDF con referencia de expediente.</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-stone-800 text-xs text-stone-400 font-mono">
              Ideal para una primera orientación de viabilidad económica.
            </div>
          </div>

          {/* Card Tier 2: Nivel 2 De Pago según m² */}
          <div className="bg-stone-900 rounded-3xl border-2 border-amber-500/80 p-8 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-2xl shadow-amber-950/20">
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Fase 2 · Rigor Colegiado
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  Coste Variable según m²
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">
                  Nivel 2: Estudio Técnico Avanzado Visado
                </h3>
                <p className="text-stone-300 text-xs sm:text-sm mt-2 leading-relaxed">
                  Para promotores que exigen el desglose milimétrico partida por partida, mediciones verificadas in situ y precio contractual cerrado.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-stone-300 pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Desglose completo por partidas PEM</strong> (Cimentación, Estructura, REBT, Aerotermia, Acabados).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Auditoría de colisiones 3D de la malla STL por aparejador colegiado.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Tarifa transparente: <strong>Base 180 € + 1.80 €/m² adicional</strong> (&gt; 90 m²).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>100% Deducible</strong> en la factura final de obra al construir con PROJECT 3D.</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-stone-800 flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold">Entrega visada en &lt; 48 horas</span>
              <button
                onClick={onRequestReview}
                className="text-stone-200 hover:text-white underline font-bold flex items-center gap-1"
              >
                <span>Calcular tarifa de mi proyecto</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* CUMPLIMIENTO RGPD Y PRIVACIDAD DE ARCHIVOS STL */}
        <div className="bg-stone-900/90 rounded-3xl border border-stone-800 p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Compromiso Legal RGPD y Custodia Confidencial de Archivos STL
              </h3>
              <p className="text-xs text-stone-400">
                Garantías conforme al Reglamento General de Protección de Datos (RGPD UE 2016/679) y Ley Orgánica 3/2018 (LOPDGDD).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-300">
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
              <div className="font-bold text-white font-mono text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Secreto Profesional Arquitectónico
              </div>
              <p className="text-stone-400 leading-relaxed text-[11px]">
                Nuestros aparejadores y arquitectos técnicos están sujetos al deber de sigilo deontológico. Los planos y geometrías se tratan con estricta confidencialidad.
              </p>
            </div>

            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
              <div className="font-bold text-white font-mono text-xs flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Cifrado TLS & Servidores en España/UE
              </div>
              <p className="text-stone-400 leading-relaxed text-[11px]">
                Toda la transferencia de archivos STL y modelos 3D se efectúa mediante túnel cifrado SSL/TLS de 256 bits, alojado en infraestructura europea protegida.
              </p>
            </div>

            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
              <div className="font-bold text-white font-mono text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Propiedad Intelectual Intacta
              </div>
              <p className="text-stone-400 leading-relaxed text-[11px]">
                El promotor conserva el 100% de la autoría sobre sus planos y mallas 3D. PROJECT 3D nunca cede, vende ni reutiliza modelos con terceros.
              </p>
            </div>
          </div>
        </div>

        {/* The Mandatory Notice Callout */}
        <div className="bg-amber-950/25 border-l-4 border-amber-500 p-5 rounded-r-xl space-y-2">
          <div className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Aviso Legal Obligatorio de No Contractualidad
          </div>
          <p className="text-xs text-stone-300 leading-relaxed font-medium">
            "Atención: Toda estimación automática generada en esta plataforma es un estudio preliminar basado en la geometría del archivo STL y los parámetros facilitados, aplicando un margen de seguridad del 15%. No constituye un presupuesto contractual vinculado. Un técnico especialista de PROJECT 3D validará los datos in situ para emitir su presupuesto definitivo."
          </p>
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { UploadCloud, Cpu, ShieldAlert, FileCheck, ArrowRight } from 'lucide-react';

interface ProcessSectionProps {
  onStartEstimator: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onStartEstimator }) => {
  const steps = [
    {
      num: '01',
      title: 'Carga de Archivo STL o Parámetros',
      desc: 'Sube tu modelo 3D o introduce los datos clave de tu vivienda (metros cuadrados, plantas y ubicación).',
      icon: UploadCloud,
    },
    {
      num: '02',
      title: 'Lectura Geométrica & Volumetría',
      desc: 'Nuestro motor analiza la malla 3D, calcula el volumen exacto de edificación y comprueba la coherencia del diseño.',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Estimación con Margen de Seguridad 15%',
      desc: 'Desglosamos los costes por capítulos constructivos aplicando estrictamente un 15% preventivo para contingencias.',
      icon: ShieldAlert,
    },
    {
      num: '04',
      title: 'Validación Técnica en Torrijos',
      desc: 'Un arquitecto técnico especialista de PROJECT 3D visita el terreno o inmueble para emitir tu presupuesto contractual definitivo.',
      icon: FileCheck,
    },
  ];

  return (
    <section id="proceso" className="py-20 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-mono text-amber-500 uppercase tracking-widest">
            Metodología Digital & Física
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Cómo Funciona el Ecosistema PROJECT 3D
          </h2>
          <p className="text-stone-400 text-sm sm:text-base">
            De la maqueta tridimensional a la obra real en 4 pasos rigurosos y sin sorpresas financieras.
          </p>
        </div>

        {/* 4 Steps timeline */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-stone-950 p-6 rounded-2xl border border-stone-800 relative hover:border-amber-500/50 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-stone-800/80">
                    <span className="font-mono text-2xl font-black text-amber-500/80 group-hover:text-amber-400 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mt-4 group-hover:text-amber-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-stone-400 text-xs mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-stone-800/60 text-[11px] font-mono text-stone-500 flex items-center gap-1">
                  <span>Paso {idx + 1} de 4</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive CTA to start process */}
        <div className="mt-14 text-center">
          <button
            onClick={onStartEstimator}
            className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 text-sm transition-all"
          >
            <span>Iniciar Estimación Guiada en 5 Minutos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

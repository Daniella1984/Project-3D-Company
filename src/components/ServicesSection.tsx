import React from 'react';
import { Home, Hammer, Check, ArrowRight, Sparkles, Sliders, Shield } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (serviceType: 'obra_nueva' | 'reforma_integral') => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  return (
    <section className="py-20 bg-stone-950 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-mono text-amber-500 uppercase tracking-widest">
            Especialización Técnica
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Nuestras Dos Grandes Líneas de Actuación
          </h2>
          <p className="text-stone-400 text-sm sm:text-base">
            Diseñadas específicamente para el mercado residencial de Torrijos, Toledo y área de influencia de Madrid, garantizando cumplimiento del CTE y máxima calificación energética.
          </p>
        </div>

        {/* Services Comparison Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Service 1: Viviendas Adosadas */}
          <div id="viviendas" className="bg-stone-900 rounded-3xl border border-stone-800 p-8 sm:p-10 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Home className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono text-amber-400 uppercase bg-amber-950/60 border border-amber-800 px-3 py-1 rounded-full">
                  Obra Nueva
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  Construcción de Viviendas Adosadas
                </h3>
                <p className="text-stone-400 text-sm mt-2 leading-relaxed">
                  Proyectos integrales desde el replanteo y cimentación hasta la entrega de llaves. Optimizamos parcelas estrechas típicas de suelo urbano en Torrijos y comarca, garantizando privacidad, luz natural y patios funcionales.
                </p>
              </div>

              {/* Specific features */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono text-stone-300 font-semibold uppercase tracking-wider">
                  Especificaciones Técnicas Incluidas:
                </div>
                {[
                  'Cimentación sismorresistente con solera ventilada antihumedad.',
                  'Aislamiento térmico exterior continuo SATE (consumo casi nulo).',
                  'Estructuras mixtas de hormigón armado y forjados unidireccionales.',
                  'Preinstalación y montaje de climatización por aerotermia y suelo radiante.',
                  'Gestión integral de licencias de obra mayor en ayuntamientos locales.',
                  'Garantía decenal con Organismo de Control Técnico (OCT) y seguro.',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-300">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-stone-800/80 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-mono text-stone-400 uppercase">Rango Orientativo Base</div>
                <div className="text-xl font-bold font-mono text-amber-400">1.180 € - 1.850 € / m²</div>
              </div>
              <button
                onClick={() => onSelectService('obra_nueva')}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow"
              >
                <span>Estimar Vivienda Adosada</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Service 2: Reformas Integrales */}
          <div id="reformas" className="bg-stone-900 rounded-3xl border border-stone-800 p-8 sm:p-10 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Hammer className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono text-amber-400 uppercase bg-amber-950/60 border border-amber-800 px-3 py-1 rounded-full">
                  Rehabilitación Integral
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  Reformas Integrales de Vivienda
                </h3>
                <p className="text-stone-400 text-sm mt-2 leading-relaxed">
                  Rediseñamos por completo el espacio interior de pisos, adosados antiguos y chalets. Eliminamos barreras arquitectónicas, renovamos canalizaciones obsoletas y creamos hogares contemporáneos y luminosos.
                </p>
              </div>

              {/* Specific features */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono text-stone-300 font-semibold uppercase tracking-wider">
                  Especificaciones Técnicas Incluidas:
                </div>
                {[
                  'Demoliciones controladas con gestión de residuos en vertedero homologado.',
                  'Nueva distribución diáfana con tabiquería de yeso laminado insonorizado.',
                  'Renovación integral de fontanería multicapa y electricidad bajo REBT.',
                  'Sustitución de ventanas por perfiles con rotura de puente térmico y gas argón.',
                  'Alicatados porcelánicos rectificados y platos de ducha a ras de suelo.',
                  'Coordinación de gremios con jefe de obra asignado en Torrijos.',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-300">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-stone-800/80 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-mono text-stone-400 uppercase">Rango Orientativo Base</div>
                <div className="text-xl font-bold font-mono text-amber-400">690 € - 1.220 € / m²</div>
              </div>
              <button
                onClick={() => onSelectService('reforma_integral')}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow"
              >
                <span>Estimar Reforma Integral</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

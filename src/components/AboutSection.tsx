import React from 'react';
import { Building, MapPin, Award, CheckCircle, ShieldCheck, Cpu } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="nosotros" className="py-20 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
            <Building className="w-4 h-4" />
            <span>Nuestra Identidad</span>
            <span className="text-stone-700">·</span>
            <span>Torrijos (Toledo)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Nacidos en el Vivero de Empresas de Torrijos para transformar la edificación residencial.
          </h2>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
            PROJECT 3D surge como respuesta a la falta de rigor técnico y transparencia en los presupuestos de construcción tradicional. Combinamos la experiencia en obra de la provincia de Toledo y Madrid con herramientas de modelado tridimensional y cálculo de geometrías STL.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1 */}
          <div className="bg-stone-950 p-7 rounded-2xl border border-stone-800 hover:border-amber-500/40 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Arraigo Local en Torrijos</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Ubicados en el vivero de empresas de Torrijos (Toledo). Conocemos a fondo el planeamiento urbanístico, las normativas municipales y la red de proveedores cualificados de Castilla-La Mancha y Madrid.
            </p>
            <div className="pt-2 text-xs font-mono text-amber-400">
              Vivero de Empresas de Torrijos
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-stone-950 p-7 rounded-2xl border border-stone-800 hover:border-amber-500/40 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Ingeniería 3D & Archivos STL</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Analizamos la volumetría real de tu proyecto mediante mallas 3D y archivos STL. Detectamos colisiones de tuberías, exceso de volumen y optimizamos cada metro cuadrado antes de poner el primer ladrillo.
            </p>
            <div className="pt-2 text-xs font-mono text-amber-400">
              Precisión milimétrica pre-construcción
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-stone-950 p-7 rounded-2xl border border-stone-800 hover:border-amber-500/40 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Honestidad Radical (+15%)</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              No emitimos presupuestos 'gancho' artificialmente bajos para captar clientes y luego encarecer la obra. Incorporamos un margen de seguridad del 15% que protege tu patrimonio y garantiza el precio acordado.
            </p>
            <div className="pt-2 text-xs font-mono text-amber-400">
              Sin sobrecostes inesperados
            </div>
          </div>

        </div>

        {/* Credibility banner */}
        <div className="mt-12 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 rounded-2xl border border-stone-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-white text-sm">Equipo de Técnicos Colegiados en Toledo y Madrid</div>
              <div className="text-stone-400 text-xs">Colegio Oficial de Arquitectos y Colegio Oficial de Aparejadores y Arquitectos Técnicos.</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-stone-300">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-400" /> Seguro RC Todo Riesgo</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-400" /> Garantía Decenal LOE</span>
          </div>
        </div>

      </div>
    </section>
  );
};

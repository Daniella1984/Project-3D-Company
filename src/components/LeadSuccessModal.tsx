import React from 'react';
import { CheckCircle2, Calendar, Phone, MapPin, X, ArrowRight } from 'lucide-react';
import { EstimationResult } from '../types';

interface LeadSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  result?: EstimationResult | null;
}

export const LeadSuccessModal: React.FC<LeadSuccessModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-stone-900 border-2 border-emerald-500/60 rounded-3xl shadow-2xl p-6 sm:p-8 text-stone-100 relative space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
            Solicitud Registrada con Éxito
          </div>
          <h3 className="text-2xl font-black text-white">
            ¡Revisión Técnica Profesional Solicitada!
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Hemos asignado tu expediente preliminar a nuestro equipo de aparejadores y arquitectos técnicos en la sede de <strong>Torrijos (Toledo)</strong>.
          </p>
        </div>

        {/* Reference summary box */}
        <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2 text-xs font-mono">
          {result && (
            <div className="flex justify-between">
              <span className="text-stone-400">Código de Expediente:</span>
              <span className="text-amber-400 font-bold">{result.referenceCode}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-stone-400">Sede Responsable:</span>
            <span className="text-stone-200">Vivero de Empresas de Torrijos</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Plazo de Respuesta:</span>
            <span className="text-emerald-400 font-bold">&lt; 24 horas laborables</span>
          </div>
        </div>

        {/* Next Steps List */}
        <div className="space-y-2.5">
          <div className="text-xs font-mono text-stone-400 uppercase tracking-wider font-semibold">
            ¿Cuáles son los siguientes pasos?
          </div>
          <ul className="space-y-2 text-xs text-stone-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">1.</span>
              <span>Llamada técnica para confirmar detalles de la parcela o inmueble.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">2.</span>
              <span>Visita in-situ en Torrijos, Toledo o Madrid para toma de datos reales.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">3.</span>
              <span>Emisión del <strong>Presupuesto Contractual Definitivo y Cerrado</strong>.</span>
            </li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <span>Entendido, volver a la página</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};

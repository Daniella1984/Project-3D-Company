import React, { useState } from 'react';
import { EstimationResult } from '../types';
import {
  ShieldCheck,
  CreditCard,
  Building,
  CheckCircle2,
  Lock,
  FileText,
  X,
  ArrowRight,
  Sparkles,
  Smartphone,
  Banknote,
  Clock,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Level2OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: EstimationResult;
  onSuccessUnlock: () => void;
}

export const Level2OrderModal: React.FC<Level2OrderModalProps> = ({
  isOpen,
  onClose,
  result,
  onSuccessUnlock,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'tarjeta' | 'bizum' | 'transferencia'>('tarjeta');
  const [nifCif, setNifCif] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  if (!isOpen) return null;

  const { level2Study, parameters, client } = result;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setOrderCompleted(true);
      onSuccessUnlock();

      try {
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6'],
        });
      } catch (err) {
        // ignore in test environments
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-stone-900 border-2 border-amber-500/80 rounded-3xl shadow-2xl overflow-hidden text-stone-100 relative">
        
        {/* Header */}
        <div className="px-6 py-5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Contratar FASE B: Estudio Técnico Avanzado de Pago Variable
                </h3>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                  Torrijos
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Desglose exhaustivo por partidas y validación colegiada del proyecto ({parameters.superficieM2} m²)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderCompleted ? (
          /* Order Confirmation View */
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Encargo Técnico Activado
              </span>
              <h4 className="text-2xl font-black text-white">
                ¡FASE B Contratada con Éxito!
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                Hemos asignado el expediente <strong>{result.referenceCode}</strong> al departamento de Arquitectura Técnica de nuestra sede en el Vivero de Empresas de Torrijos (Toledo).
              </p>
            </div>

            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-xs font-mono text-left max-w-md mx-auto space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-400">Importe Abonado:</span>
                <span className="text-emerald-400 font-bold">{level2Study.totalWithIva} € (IVA incl.)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Deducción en Obra:</span>
                <span className="text-amber-400 font-bold">100% Deducible (-{level2Study.totalWithIva} €)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Plazo de Emisión:</span>
                <span className="text-stone-200">&lt; 48 horas laborables</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full max-w-md bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 rounded-xl text-xs transition-colors shadow-lg shadow-amber-500/25"
            >
              Ver Desglose Completo Desbloqueado Ahora
            </button>
          </div>
        ) : (
          /* Order Form View */
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
            
            {/* Transparent Variable Fee Calculation Card */}
            <div className="bg-stone-950 rounded-2xl border border-stone-800 p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-stone-300 font-bold pb-2 border-b border-stone-800/80">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-500" />
                  Cálculo de Coste Variable por Superficie ({level2Study.surfaceM2} m²)
                </span>
                <span className="text-amber-400 font-semibold">Tarifa Regulada</span>
              </div>

              <div className="flex justify-between text-stone-400">
                <span>Tarifa Base (Apertura de expediente hasta 90 m²):</span>
                <span className="text-stone-200">{level2Study.baseFee} €</span>
              </div>

              {level2Study.surfaceM2 > 90 ? (
                <div className="flex justify-between text-stone-400">
                  <span>
                    Variable por superficie ({level2Study.surfaceM2 - 90} m² adicionales × {level2Study.ratePerAdditionalM2.toFixed(2)} €/m²):
                  </span>
                  <span className="text-stone-200">+{level2Study.variableM2Fee} €</span>
                </div>
              ) : (
                <div className="flex justify-between text-stone-400">
                  <span>Variable por superficie (&le; 90 m²):</span>
                  <span className="text-emerald-400 font-semibold">0 € (Incluido en base)</span>
                </div>
              )}

              <div className="flex justify-between text-stone-300 pt-1 border-t border-stone-800/60">
                <span>Base Imponible:</span>
                <span className="font-bold text-stone-100">{level2Study.totalBeforeIva} €</span>
              </div>

              <div className="flex justify-between text-stone-400">
                <span>IVA Servicios Técnicos de Arquitectura (21%):</span>
                <span>+{level2Study.iva21} €</span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-black text-amber-400 pt-2 border-t border-stone-800">
                <span>TOTAL ESTUDIO TÉCNICO AVANZADO:</span>
                <span>{level2Study.totalWithIva} €</span>
              </div>

              {/* 100% Deductible Highlight */}
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Garantía 100% Deducible:</strong> Este importe íntegro ({level2Study.totalWithIva} €) se descontará de la primera certificación de obra al construir o reformar con PROJECT 3D.
                </p>
              </div>
            </div>

            {/* Included Deliverables */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-stone-300 font-semibold uppercase tracking-wider">
                Entregables Oficiales Visados Incluidos:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300">
                {level2Study.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-stone-300 font-semibold uppercase tracking-wider">
                Selecciona la Forma de Pago / Facturación:
              </span>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('tarjeta')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'tarjeta'
                      ? 'border-amber-500 bg-amber-500/15 text-white'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold">Tarjeta Segura</span>
                  <span className="text-[9px] font-mono text-stone-400">Visa / Mastercard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bizum')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'bizum'
                      ? 'border-amber-500 bg-amber-500/15 text-white'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold">Bizum Empresas</span>
                  <span className="text-[9px] font-mono text-stone-400">Inmediato</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('transferencia')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'transferencia'
                      ? 'border-amber-500 bg-amber-500/15 text-white'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-white'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold">Transferencia</span>
                  <span className="text-[9px] font-mono text-stone-400">Factura Proforma</span>
                </button>
              </div>
            </div>

            {/* Billing identification field */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-stone-300 font-semibold flex items-center justify-between">
                <span>NIF / CIF para la Factura Oficial Española (Opcional)</span>
                <span className="text-[10px] text-stone-500">Deducible fiscalmente</span>
              </label>
              <input
                type="text"
                placeholder="Ej. 12345678Z o B-45999999"
                value={nifCif}
                onChange={(e) => setNifCif(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none"
              />
            </div>

            {/* RGPD & Security badge */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-stone-400 bg-stone-950 p-2.5 rounded-xl border border-stone-800">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pasarela cifrada TLS 256 bits · Factura con validez legal tributaria en España</span>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold py-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/30"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>Conectando con Pasarela Segura...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar y Contratar Estudio FASE B ({level2Study.totalWithIva} €)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

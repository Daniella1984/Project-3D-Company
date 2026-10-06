import React from 'react';
import { LeadRecord } from '../types';
import {
  Users,
  Clock,
  Mail,
  Phone,
  CheckCircle2,
  MapPin,
  Building,
  FileText,
  X,
  ExternalLink,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface CrmLeadsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  leads: LeadRecord[];
  onSelectLeadDossier: (lead: LeadRecord) => void;
}

export const CrmLeadsDrawer: React.FC<CrmLeadsDrawerProps> = ({
  isOpen,
  onClose,
  leads,
  onSelectLeadDossier,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-stone-900 border-2 border-amber-500/70 rounded-3xl shadow-2xl overflow-hidden text-stone-100 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  CRM Interno & Derivación Comercial
                </h3>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                  Sede Torrijos (Toledo)
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Trazabilidad de leads automáticos, avisos por email y compromiso de atención &lt; 24h
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {leads.length === 0 ? (
            <div className="p-12 text-center space-y-3 bg-stone-950 rounded-2xl border border-stone-800">
              <Users className="w-12 h-12 text-stone-600 mx-auto" />
              <div className="text-sm font-bold text-stone-300">No hay expedientes registrados aún</div>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Completa el formulario CRO en una sola página para generar una estimación inicial y verás cómo se activa la derivación comercial en tiempo real.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-stone-950 p-5 rounded-2xl border border-stone-800 hover:border-amber-500/50 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-800/80">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {lead.referenceCode}
                      </span>
                      <span className="text-stone-600">·</span>
                      <span className="text-xs font-bold text-stone-100">
                        {lead.client.nombre} {lead.client.apellidos}
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.2 rounded font-semibold">
                        Estado: Lead ({lead.status.toUpperCase()})
                      </span>
                    </div>

                    <div className="text-xs font-mono text-stone-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>SLA Restante: ~{lead.slaHoursRemaining}h</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-300 font-mono">
                    <div className="space-y-1">
                      <div className="text-[10px] text-stone-500 uppercase">Contacto</div>
                      <div className="flex items-center gap-1 text-stone-200">
                        <Phone className="w-3 h-3 text-amber-400" />
                        <span>{lead.client.telefono}</span>
                      </div>
                      <div className="flex items-center gap-1 text-stone-400 text-[11px] truncate">
                        <Mail className="w-3 h-3 text-amber-400" />
                        <span className="truncate">{lead.client.email}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] text-stone-500 uppercase">Proyecto & Ubicación</div>
                      <div className="text-stone-200">
                        {lead.parameters.type === 'obra_nueva' ? 'Obra Nueva Adosada' : 'Reforma Integral'}
                      </div>
                      <div className="text-[11px] text-amber-300">
                        {lead.parameters.superficieM2} m² · {lead.client.localidad}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] text-stone-500 uppercase">Estimación +15%</div>
                      <div className="text-base font-bold text-emerald-400">
                        {lead.estimation.totalEstimate.toLocaleString()} €
                      </div>
                      <div className="text-[10px] text-stone-400">
                        PEM Base + Margen 15% + IVA 10%
                      </div>
                    </div>
                  </div>

                  {/* Automated Triggers Status */}
                  <div className="pt-3 border-t border-stone-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono">
                    <div className="flex items-center gap-4 text-emerald-400">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Email confirmación enviado al cliente
                      </span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Alerta comercial asignada (Torrijos)
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectLeadDossier(lead)}
                      className="text-amber-400 hover:text-white underline font-bold flex items-center gap-1 self-start sm:self-auto"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Ver Dossier de Estimación</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs font-mono text-stone-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Base de datos relacional · Registro de leads con cifrado RGPD</span>
          </div>
          <button
            onClick={onClose}
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-1.5 rounded-lg text-xs transition-colors"
          >
            Cerrar CRM
          </button>
        </div>

      </div>
    </div>
  );
};

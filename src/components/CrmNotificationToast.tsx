import React from 'react';
import { Mail, Bell, CheckCircle2, ShieldCheck, Clock, UserCheck, MapPin } from 'lucide-react';
import { LeadRecord } from '../types';

interface CrmNotificationToastProps {
  lead: LeadRecord | null;
  onClose: () => void;
  onOpenCrmDrawer?: () => void;
}

export const CrmNotificationToast: React.FC<CrmNotificationToastProps> = ({
  lead,
  onClose,
  onOpenCrmDrawer,
}) => {
  if (!lead) return null;

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-50 max-w-md w-full bg-stone-900 border-2 border-emerald-500/80 rounded-2xl shadow-2xl p-4 text-stone-100 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
              CRM AUTOMATIZADO · LEAD REGISTRADO
            </span>
            <span className="text-[10px] font-mono text-stone-400">{lead.referenceCode}</span>
          </div>

          <h5 className="text-xs font-bold text-white">
            Expediente asignado al equipo comercial de Torrijos (Toledo)
          </h5>

          <p className="text-[11px] text-stone-300 leading-snug">
            Hemos disparado simultáneamente las 2 acciones automáticas:
          </p>

          <div className="space-y-1 pt-1 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-emerald-300">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Copia de estimación enviada a {lead.client.email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <Bell className="w-3.5 h-3.5 shrink-0" />
              <span>Aviso interno enviado a comerciales en Torrijos (SLA &lt; 24h)</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white text-xs p-1 rounded hover:bg-stone-800"
        >
          ✕
        </button>
      </div>

      <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between text-[10px] font-mono text-stone-400">
        <span className="flex items-center gap-1 text-stone-300">
          <Clock className="w-3 h-3 text-amber-500" />
          Plazo de contacto: &lt; 24h laborables
        </span>
        {onOpenCrmDrawer && (
          <button
            onClick={onOpenCrmDrawer}
            className="text-amber-400 hover:underline font-bold"
          >
            Ver Pipeline CRM
          </button>
        )}
      </div>
    </div>
  );
};

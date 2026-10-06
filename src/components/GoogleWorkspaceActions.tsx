import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Calendar,
  Presentation,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
} from 'lucide-react';
import { EstimationResult } from '../types';
import {
  exportEstimateToGoogleSheets,
  createGoogleSlidesPresentation,
} from '../services/googleWorkspace';
import { recordWorkspaceExportToFirestore } from '../services/firestoreService';
import { getAccessToken, googleSignIn } from '../lib/firebase';

interface GoogleWorkspaceActionsProps {
  estimation: EstimationResult;
  onOpenCalendarModal: () => void;
  userEmail?: string | null;
}

export const GoogleWorkspaceActions: React.FC<GoogleWorkspaceActionsProps> = ({
  estimation,
  onOpenCalendarModal,
  userEmail,
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [successLink, setSuccessLink] = useState<{ type: string; url: string; label: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Helper to ensure authenticated
  const ensureAuthenticated = async (): Promise<boolean> => {
    const token = await getAccessToken();
    if (!token) {
      try {
        const res = await googleSignIn();
        return !!res?.accessToken;
      } catch (err: any) {
        setErrorMsg('Debes iniciar sesión con Google para usar las herramientas de Google Workspace.');
        return false;
      }
    }
    return true;
  };

  const handleExportSheets = async () => {
    setErrorMsg(null);
    setSuccessLink(null);

    // Confirmation dialog before creating / mutating in user's Drive
    const confirmed = window.confirm(
      '¿Deseas exportar este presupuesto detallado a una nueva hoja de cálculo en tu Google Drive?'
    );
    if (!confirmed) return;

    setLoadingAction('sheets');
    try {
      const isAuth = await ensureAuthenticated();
      if (!isAuth) {
        setLoadingAction(null);
        return;
      }

      const res = await exportEstimateToGoogleSheets(
        estimation,
        `${estimation.client.nombre} ${estimation.client.apellidos}`
      );

      if (!res.success || !res.url) {
        throw new Error(res.error || 'Error al exportar a Google Sheets');
      }

      setSuccessLink({
        type: 'sheets',
        url: res.url,
        label: 'Hoja de Cálculo en Google Sheets Creada',
      });

      // Registrar en Firestore
      await recordWorkspaceExportToFirestore({
        id: `exp_sheets_${Date.now()}`,
        type: 'sheets',
        title: `Presupuesto ${estimation.referenceCode}`,
        fileId: res.id,
        fileUrl: res.url,
        leadReference: estimation.referenceCode,
        createdAt: new Date().toISOString(),
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al exportar a Google Sheets');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExportSlides = async () => {
    setErrorMsg(null);
    setSuccessLink(null);

    const confirmed = window.confirm(
      '¿Deseas generar una presentación ejecutiva de este proyecto en tu Google Slides?'
    );
    if (!confirmed) return;

    setLoadingAction('slides');
    try {
      const isAuth = await ensureAuthenticated();
      if (!isAuth) {
        setLoadingAction(null);
        return;
      }

      const res = await createGoogleSlidesPresentation(
        estimation,
        `${estimation.client.nombre} ${estimation.client.apellidos}`
      );

      if (!res.success || !res.url) {
        throw new Error(res.error || 'Error al generar presentación en Google Slides');
      }

      setSuccessLink({
        type: 'slides',
        url: res.url,
        label: 'Presentación en Google Slides Creada',
      });

      // Registrar en Firestore
      await recordWorkspaceExportToFirestore({
        id: `exp_slides_${Date.now()}`,
        type: 'slides',
        title: `Dossier Ejecutivo ${estimation.referenceCode}`,
        fileId: res.id,
        fileUrl: res.url,
        leadReference: estimation.referenceCode,
        createdAt: new Date().toISOString(),
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al exportar a Google Slides');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5 space-y-4 text-xs font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h4 className="font-bold text-white uppercase tracking-wider text-xs">
            Ecosistema Google Workspace & Drive
          </h4>
        </div>
        <span className="text-[11px] text-stone-400">
          Sincronización en la nube para {estimation.referenceCode}
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successLink && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{successLink.label}</span>
          </div>
          <a
            href={successLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-lg text-[11px] flex items-center gap-1.5 transition-colors"
          >
            <span>Abrir Documento</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Grid of 3 Google Workspace Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Google Sheets */}
        <button
          onClick={handleExportSheets}
          disabled={loadingAction !== null}
          className="p-3.5 rounded-xl border border-stone-800 bg-stone-900 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-left transition-all group flex flex-col justify-between gap-3 disabled:opacity-50"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-stone-500 group-hover:text-emerald-400 font-bold">
              SHEETS
            </span>
          </div>
          <div>
            <div className="font-bold text-white text-xs group-hover:text-emerald-300">
              Exportar a Google Sheets
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              Hoja de cálculo con PEM completo y 15% margen
            </div>
          </div>
          {loadingAction === 'sheets' && (
            <div className="flex items-center gap-1.5 text-emerald-400 text-[10px]">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Generando en Drive...</span>
            </div>
          )}
        </button>

        {/* Google Calendar */}
        <button
          onClick={onOpenCalendarModal}
          disabled={loadingAction !== null}
          className="p-3.5 rounded-xl border border-stone-800 bg-stone-900 hover:border-blue-500/50 hover:bg-blue-500/5 text-left transition-all group flex flex-col justify-between gap-3 disabled:opacity-50"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-stone-500 group-hover:text-blue-400 font-bold">
              CALENDAR
            </span>
          </div>
          <div>
            <div className="font-bold text-white text-xs group-hover:text-blue-300">
              Agendar en Google Calendar
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              Cita con técnico en Torrijos o en tu parcela
            </div>
          </div>
        </button>

        {/* Google Slides */}
        <button
          onClick={handleExportSlides}
          disabled={loadingAction !== null}
          className="p-3.5 rounded-xl border border-stone-800 bg-stone-900 hover:border-amber-500/50 hover:bg-amber-500/5 text-left transition-all group flex flex-col justify-between gap-3 disabled:opacity-50"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Presentation className="w-4 h-4" />
            </div>
            <span className="text-[10px] text-stone-500 group-hover:text-amber-400 font-bold">
              SLIDES
            </span>
          </div>
          <div>
            <div className="font-bold text-white text-xs group-hover:text-amber-300">
              Crear Google Slides
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              Presentación ejecutiva del proyecto
            </div>
          </div>
          {loadingAction === 'slides' && (
            <div className="flex items-center gap-1.5 text-amber-400 text-[10px]">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Creando presentación...</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

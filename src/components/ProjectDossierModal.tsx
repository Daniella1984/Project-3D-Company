import React, { useState } from 'react';
import { EstimationResult } from '../types';
import {
  X,
  Printer,
  ShieldCheck,
  Download,
  Box,
  MapPin,
  Calendar,
  FileText,
  CheckCircle2,
  Lock,
  BadgeCheck,
  FileSpreadsheet,
  Presentation,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import {
  exportEstimateToGoogleSheets,
  createGoogleSlidesPresentation,
} from '../services/googleWorkspace';
import { recordWorkspaceExportToFirestore } from '../services/firestoreService';

interface ProjectDossierModalProps {
  result: EstimationResult | null;
  onClose: () => void;
  onOpenCalendarModal?: () => void;
}

export const ProjectDossierModal: React.FC<ProjectDossierModalProps> = ({
  result,
  onClose,
  onOpenCalendarModal,
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [createdUrl, setCreatedUrl] = useState<{ url: string; label: string } | null>(null);

  if (!result) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSheetsExport = async () => {
    if (!result) return;
    const confirmed = window.confirm('¿Deseas exportar este dossier a Google Sheets?');
    if (!confirmed) return;

    setLoadingAction('sheets');
    try {
      const res = await exportEstimateToGoogleSheets(result, result.client.nombre);
      if (res.success && res.url) {
        setCreatedUrl({ url: res.url, label: 'Abrir en Google Sheets' });
        await recordWorkspaceExportToFirestore({
          id: `exp_dossier_sheets_${Date.now()}`,
          type: 'sheets',
          title: `Dossier ${result.referenceCode}`,
          fileUrl: res.url,
          leadReference: result.referenceCode,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (e: any) {
      alert(e.message || 'Error al exportar');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSlidesExport = async () => {
    if (!result) return;
    const confirmed = window.confirm('¿Deseas crear la presentación en Google Slides?');
    if (!confirmed) return;

    setLoadingAction('slides');
    try {
      const res = await createGoogleSlidesPresentation(result, result.client.nombre);
      if (res.success && res.url) {
        setCreatedUrl({ url: res.url, label: 'Abrir en Google Slides' });
        await recordWorkspaceExportToFirestore({
          id: `exp_dossier_slides_${Date.now()}`,
          type: 'slides',
          title: `Dossier Slides ${result.referenceCode}`,
          fileUrl: res.url,
          leadReference: result.referenceCode,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (e: any) {
      alert(e.message || 'Error al crear Slides');
    } finally {
      setLoadingAction(null);
    }
  };

  const isLevel2 = result.activeTier === 'nivel_2_avanzado';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white">
      <div className="w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-stone-100 print:border-none print:shadow-none print:bg-white print:text-stone-900 print:rounded-none">
        
        {/* Modal Controls (Hidden in print) */}
        <div className="px-6 py-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <span className="font-mono text-xs text-stone-300 font-semibold uppercase">
              {isLevel2
                ? 'DOSSIER VISADO · FASE B ESTUDIO TÉCNICO AVANZADO'
                : 'DOSSIER OFICIAL · FASE A ESTIMACIÓN INICIAL GRATUITA'}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Sheets */}
            <button
              onClick={handleSheetsExport}
              disabled={loadingAction !== null}
              className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-medium px-2.5 py-1.5 rounded-lg text-xs transition-colors"
              title="Exportar a Google Sheets"
            >
              {loadingAction === 'sheets' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Google Sheets</span>
            </button>

            {/* Slides */}
            <button
              onClick={handleSlidesExport}
              disabled={loadingAction !== null}
              className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-amber-950/60 text-amber-400 border border-amber-500/30 font-medium px-2.5 py-1.5 rounded-lg text-xs transition-colors"
              title="Generar Google Slides"
            >
              {loadingAction === 'slides' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Presentation className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Google Slides</span>
            </button>

            {/* Calendar */}
            {onOpenCalendarModal && (
              <button
                onClick={onOpenCalendarModal}
                className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-blue-950/60 text-blue-400 border border-blue-500/30 font-medium px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                title="Agendar en Google Calendar"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Agendar Cita</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {createdUrl && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/50 px-6 py-2.5 flex items-center justify-between text-xs font-mono text-emerald-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Documento creado exitosamente en tu Google Drive
            </span>
            <a
              href={createdUrl.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold hover:text-white flex items-center gap-1"
            >
              <span>{createdUrl.label}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 space-y-8 print:p-6 print:space-y-6">
          
          {/* Document Header with Logo & Torrijos Badge */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-stone-800 print:border-stone-300 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl font-mono tracking-tight text-white print:text-stone-900">
                  PROJECT<span className="text-amber-500">3D</span>
                </span>
                <span className="text-xs font-mono uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded print:text-amber-700 print:border-amber-300">
                  Torrijos (Toledo)
                </span>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                  isLevel2
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-stone-800 text-stone-300 border border-stone-700'
                }`}>
                  {isLevel2 ? 'FASE B: ESTUDIO VISADO' : 'FASE A: ESTIMACIÓN GRATUITA'}
                </span>
              </div>
              <p className="text-xs text-stone-400 print:text-stone-600">
                Construcción de Viviendas Adosadas & Reformas Integrales · Vivero de Empresas de Torrijos (Toledo, España)
              </p>
            </div>

            <div className="text-right font-mono text-xs space-y-1">
              <div className="text-amber-400 print:text-amber-700 font-bold">
                REF: {result.referenceCode}
              </div>
              <div className="text-stone-400 print:text-stone-600">Fecha: {result.generatedDate}</div>
              <div className="text-stone-400 print:text-stone-600">Colegiación: COAAT Toledo</div>
            </div>
          </div>

          {/* Client & Project Data Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-stone-950 p-5 rounded-2xl border border-stone-800 print:bg-stone-100 print:border-stone-300">
            <div>
              <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                DATOS DEL CLIENTE / PROMOTOR (RGPD PROTEGIDO)
              </div>
              <div className="font-bold text-sm text-stone-100 print:text-stone-900 mt-1">
                {result.client.nombre} {result.client.apellidos}
              </div>
              <div className="text-xs text-stone-400 print:text-stone-600 mt-0.5">
                Ubicación del proyecto: {result.client.localidad}
              </div>
              <div className="text-xs text-stone-400 print:text-stone-600">
                Contacto: {result.client.telefono} · {result.client.email}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                PARÁMETROS TÉCNICOS & GEOMETRÍA STL
              </div>
              <div className="font-bold text-sm text-amber-400 print:text-amber-700 mt-1">
                {result.parameters.type === 'obra_nueva' ? 'Obra Nueva (Vivienda Adosada)' : 'Reforma Integral'}
              </div>
              <div className="text-xs text-stone-400 print:text-stone-600 mt-0.5">
                Superficie calculada: <strong>{result.parameters.superficieM2} m²</strong> | {result.parameters.plantas} plantas | {result.parameters.habitaciones} hab. | {result.parameters.banos} baños
              </div>
              <div className="text-xs text-stone-400 print:text-stone-600">
                Calidad de acabados: <strong>{result.parameters.calidad.toUpperCase()}</strong>
              </div>
            </div>
          </div>

          {/* Breakdown Table (Full for Level 2, Summary for Level 1) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-stone-300 print:text-stone-900 font-bold uppercase">
              <span>Desglose por Capítulos Constructivos (PEM)</span>
              {!isLevel2 && (
                <span className="text-stone-400 text-[10px] font-normal">
                  (Para mediciones visadas, solicitar Nivel 2)
                </span>
              )}
            </div>

            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-800 print:border-stone-300 font-mono text-[11px] text-stone-400 print:text-stone-600">
                  <th className="py-2">Capítulo / Partida</th>
                  <th className="py-2 hidden sm:table-cell">Descripción Técnica</th>
                  <th className="py-2 text-right">Importe Estimado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80 print:divide-stone-200">
                {result.items.map((it) => (
                  <tr key={it.id}>
                    <td className="py-2.5 font-medium text-stone-200 print:text-stone-900">
                      {it.category}
                      {it.isExtra && <span className="ml-1 text-[10px] text-amber-400 font-mono">*</span>}
                    </td>
                    <td className="py-2.5 text-stone-400 print:text-stone-600 hidden sm:table-cell max-w-xs truncate">
                      {it.description}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-stone-200 print:text-stone-900">
                      {it.amount.toLocaleString()} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Strict 15% Margin Display */}
          <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 print:bg-stone-50 print:border-stone-300 space-y-3 font-mono text-xs">
            <div className="flex justify-between text-stone-400 print:text-stone-600">
              <span>Coste Base de Ejecución Material (Mercado):</span>
              <span className="font-bold">{result.baseCost.toLocaleString()} €</span>
            </div>

            <div className="flex justify-between text-amber-400 print:text-amber-700 font-bold py-1 border-y border-stone-800/80 print:border-stone-200">
              <span>+ Margen de Seguridad Preventivo (15%):</span>
              <span>+{result.contingencyMargin.toLocaleString()} €</span>
            </div>

            <div className="flex justify-between text-stone-300 print:text-stone-700">
              <span>Subtotal con Fondo de Seguridad:</span>
              <span>{result.subtotalWithMargin.toLocaleString()} €</span>
            </div>

            <div className="flex justify-between text-stone-400 print:text-stone-600">
              <span>IVA Estimado Aplicable (10% Autopromoción / Reforma):</span>
              <span>{result.ivaAmount.toLocaleString()} €</span>
            </div>

            <div className="flex justify-between text-base font-black text-emerald-400 print:text-emerald-700 pt-2 border-t border-stone-800 print:border-stone-300">
              <span>TOTAL ESTIMADO INICIAL:</span>
              <span>{result.totalEstimate.toLocaleString()} €</span>
            </div>
          </div>

          {/* Level 2 Payment & Deduction Note if active */}
          {isLevel2 && (
            <div className="bg-emerald-950/20 border border-emerald-500/40 p-4 rounded-xl text-xs font-mono space-y-1">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4" />
                Estudio Técnico Nivel 2 Abonado ({result.level2Study.totalWithIva} € IVA incl.)
              </div>
              <p className="text-stone-300 text-[11px]">
                Cláusula de compensación: Este importe se deducirá al 100% de la primera certificación de obra al formalizar el contrato de construcción con PROJECT 3D en Torrijos.
              </p>
            </div>
          )}

          {/* MANDATORY LEGAL NOTICE */}
          <div className="p-4 bg-amber-950/30 print:bg-amber-50 border border-amber-500/60 print:border-amber-400 rounded-xl space-y-1">
            <div className="font-mono text-[10px] font-bold text-amber-400 print:text-amber-800 uppercase">
              AVISO OBLIGATORIO Y VISIBLE DE NO CONTRACTUALIDAD
            </div>
            <p className="text-[11px] text-amber-200 print:text-amber-900 leading-relaxed font-medium">
              "Atención: Este documento es una Estimación Automática Inicial basada en geometría STL. No constituye un presupuesto contractual. Un técnico especialista de PROJECT 3D validará los datos para emitir su presupuesto definitivo."
            </p>
          </div>

          {/* RGPD & STL Custody Footer Stamp */}
          <div className="pt-4 border-t border-stone-800 print:border-stone-300 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-stone-500 print:text-stone-600 gap-2">
            <div>
              PROJECT 3D · Vivero de Empresas de Torrijos (Toledo) · Tel: 925 77 00 33
            </div>
            <div>
              Cumplimiento RGPD UE 2016/679 · Custodia Cifrada STL
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

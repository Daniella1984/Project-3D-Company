import React, { useState, useRef } from 'react';
import {
  ProjectType,
  QualityLevel,
  ClientData,
  ProjectParameters,
  STLAnalysis,
  EstimationResult,
  ProjectExtras,
  CommercialTier,
  LeadRecord,
} from '../types';
import { QUALITY_CONFIG, EXTRAS_COSTS, calculateProjectEstimate } from '../data/constructionRates';
import { ThreeDStlViewer } from './ThreeDStlViewer';
import { Level2OrderModal } from './Level2OrderModal';
import { GoogleWorkspaceActions } from './GoogleWorkspaceActions';
import { saveLeadToFirestore } from '../services/firestoreService';
import {
  Building2,
  Hammer,
  User,
  Phone,
  Mail,
  MapPin,
  UploadCloud,
  FileCheck2,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Download,
  Send,
  Info,
  Calendar,
  Layers,
  Bed,
  Bath,
  Maximize2,
  Lock,
  Unlock,
  ShieldCheck,
  FileText,
  BadgeCheck,
  Clock,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EstimatorFlowProps {
  initialType?: ProjectType;
  initialStep?: number;
  onClose?: () => void;
  onRequestProfessionalReview: (result: EstimationResult) => void;
  onOpenDossier: (result: EstimationResult) => void;
  onLeadCreated?: (lead: LeadRecord) => void;
  onOpenCalendarModal?: (result: EstimationResult) => void;
}

export const EstimatorFlow: React.FC<EstimatorFlowProps> = ({
  initialType = 'obra_nueva',
  onClose,
  onRequestProfessionalReview,
  onOpenDossier,
  onLeadCreated,
  onOpenCalendarModal,
}) => {
  // BLOQUE 1: IDENTIFICACIÓN DEL CLIENTE Y TIPO DE PROYECTO
  const [projectType, setProjectType] = useState<ProjectType>(initialType);
  const [clientData, setClientData] = useState<ClientData>({
    nombre: '',
    apellidos: '',
    telefono: '',
    email: '',
    localidad: 'Torrijos (Toledo)',
    observaciones: '',
    aceptaPrivacidad: true,
    aceptaConfidencialidadSTL: true,
  });

  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  // BLOQUE 2: PARÁMETROS CONSTRUCTIVOS
  const [superficieM2, setSuperficieM2] = useState<number>(142);
  const [plantas, setPlantas] = useState<number>(2);
  const [habitaciones, setHabitaciones] = useState<number>(3);
  const [banos, setBanos] = useState<number>(2);
  const [calidad, setCalidad] = useState<QualityLevel>('premium');
  const [extras, setExtras] = useState<ProjectExtras>({
    piscina: false,
    garaje: true,
    urbanizacion: false,
    aerotermiaSueloRadiante: true,
    placasSolares: false,
    domotica: false,
  });

  // BLOQUE 3: CARGA DE ARCHIVO STL (MODELO HÍBRIDO)
  const [stlAnalysis, setStlAnalysis] = useState<STLAnalysis | null>({
    fileName: 'Vivienda_Adosada_Torrijos_Malla.stl',
    fileSizeBytes: 2450000,
    trianglesCount: 14280,
    dimensions: { widthM: 7.2, depthM: 11.5, heightM: 6.4 },
    volumeM3: 530,
    estimatedBuiltAreaM2: 142,
    isValidGeometry: true,
    isWatertight: true,
  });

  // BLOQUE 4 & RESULTADOS: DOS FASES COMERCIALES
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [activeTier, setActiveTier] = useState<CommercialTier>('nivel_1_gratuito');
  const [isLevel2ModalOpen, setIsLevel2ModalOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);
  const block4Ref = useRef<HTMLDivElement>(null);

  // Validación de Bloque 1 y 2
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!clientData.nombre.trim()) errors.nombre = 'Introduce tu nombre';
    if (!clientData.telefono.trim()) errors.telefono = 'Introduce un teléfono de contacto';
    if (!clientData.email.trim() || !clientData.email.includes('@')) {
      errors.email = 'Introduce un correo electrónico válido';
    }
    if (!clientData.localidad.trim()) errors.localidad = 'Introduce la localidad de la obra';
    if (!clientData.aceptaPrivacidad) errors.privacidad = 'Debes aceptar la política de protección de datos (RGPD)';
    if (!clientData.aceptaConfidencialidadSTL) errors.confidencialidad = 'Debes aceptar el protocolo de seguridad y confidencialidad STL';
    if (!superficieM2 || superficieM2 < 25) errors.superficie = 'Indica una superficie válida (mínimo 25 m²)';

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Disparador (Trigger) de Cálculo y Automatización Comercial (CRM)
  const handleCalculateEstimate = () => {
    if (!validateForm()) {
      // Scroll to block 1 if error
      block1Ref.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsCalculating(true);

    setTimeout(() => {
      // ESTRATEGIA HÍBRIDA: El cálculo principal se alimenta de superficieM2 del formulario
      const params: ProjectParameters = {
        type: projectType,
        plantas,
        habitaciones,
        banos,
        calidad,
        superficieM2: Math.max(30, superficieM2),
        extras,
        stlAnalysis,
      };

      const calculated = calculateProjectEstimate(params, clientData);
      setResult(calculated);
      setActiveTier('nivel_1_gratuito');
      setIsCalculating(false);

      // AUTOMATIZACIÓN COMERCIAL CRM (Lead, Envío de correo & Aviso prioritario)
      const leadRecord: LeadRecord = {
        id: `lead_${Date.now()}`,
        referenceCode: calculated.referenceCode,
        client: clientData,
        parameters: params,
        estimation: calculated,
        createdAt: new Date().toISOString(),
        status: 'nuevo',
        commercialAssignee: 'Dpto. Técnico Torrijos (Toledo)',
        emailClientSent: true,
        notificationCommercialSent: true,
        slaHoursRemaining: 24,
      };

      // Guardar en almacenamiento local y sincronizar con Firestore
      try {
        const stored = JSON.parse(localStorage.getItem('project3d_leads') || '[]');
        stored.unshift(leadRecord);
        localStorage.setItem('project3d_leads', JSON.stringify(stored));
      } catch (err) {
        // ignore
      }

      // Persistir de forma robusta en la base de datos Firestore
      saveLeadToFirestore(leadRecord).catch((err) => {
        console.warn('[Firestore] Error guardando lead:', err);
      });

      if (onLeadCreated) {
        onLeadCreated(leadRecord);
      }

      // Celebración visual
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#f59e0b', '#10b981', '#3b82f6'],
        });
      } catch (e) {
        // ignore
      }

      // Scroll suave hacia los resultados
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }, 400);
  };

  const handleUnlockLevel2 = () => {
    if (result) {
      setResult({
        ...result,
        activeTier: 'nivel_2_avanzado',
      });
      setActiveTier('nivel_2_avanzado');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-stone-100">
      
      {/* Sticky Fast-Navigation Bar for CRO Single-Page Form */}
      <div className="bg-stone-950 px-6 py-4 border-b border-stone-800 sticky top-20 z-20 backdrop-blur-md bg-stone-950/95">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase text-amber-500 font-bold tracking-wider">
              FORMULARIO EN UNA SOLA PÁGINA (SCROLL FLUIDO CRO)
            </span>
            <span className="text-stone-600 hidden sm:inline">·</span>
            <span className="text-xs text-stone-400 hidden sm:inline">
              4 Bloques Secuenciales
            </span>
          </div>

          {/* Quick jump anchor links */}
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <button
              onClick={() => block1Ref.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 border border-stone-800 transition-colors"
            >
              1. Cliente & Tipo
            </button>
            <button
              onClick={() => block2Ref.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 border border-stone-800 transition-colors"
            >
              2. Parámetros m²
            </button>
            <button
              onClick={() => block3Ref.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 border border-stone-800 transition-colors"
            >
              3. STL Híbrido
            </button>
            <button
              onClick={() => block4Ref.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-stone-950 border border-amber-500/40 transition-colors font-bold"
            >
              4. Calcular +15%
            </button>
          </div>
        </div>
      </div>

      {/* Main Single-Page Sequential Form Body */}
      <div className="p-6 sm:p-10 space-y-14">

        {/* ========================================================= */}
        {/* BLOQUE 1: IDENTIFICACIÓN DEL CLIENTE, TIPO Y RGPD */}
        {/* ========================================================= */}
        <section ref={block1Ref} className="space-y-6 pt-2">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="space-y-1">
              <span className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">1</span>
                BLOQUE 1: IDENTIFICACIÓN DEL CLIENTE & TIPO DE PROYECTO
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Datos del Promotor y Naturaleza de la Obra
              </h3>
            </div>
            <span className="text-[11px] font-mono text-stone-400 bg-stone-950 px-2.5 py-1 rounded border border-stone-800 hidden sm:inline">
              Paso 1 de 4
            </span>
          </div>

          {/* Selector de Tipo de Proyecto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setProjectType('obra_nueva')}
              className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex items-start gap-4 ${
                projectType === 'obra_nueva'
                  ? 'border-amber-500 bg-amber-950/20 shadow-md'
                  : 'border-stone-800 bg-stone-950/60 hover:border-stone-700'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-white text-base">Obra Nueva (Vivienda Adosada)</div>
                <p className="text-xs text-stone-400 mt-1 leading-snug">
                  Cimentación, estructura, cerramiento térmico SATE y acabados llave en mano en Torrijos y comarca.
                </p>
                <div className="text-[10px] font-mono text-amber-400 font-semibold mt-2">
                  PEM Base orientativo: desde 1.180 €/m²
                </div>
              </div>
            </div>

            <div
              onClick={() => setProjectType('reforma_integral')}
              className={`cursor-pointer rounded-2xl p-5 border-2 transition-all flex items-start gap-4 ${
                projectType === 'reforma_integral'
                  ? 'border-amber-500 bg-amber-950/20 shadow-md'
                  : 'border-stone-800 bg-stone-950/60 hover:border-stone-700'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Hammer className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-white text-base">Reforma Integral de Vivienda</div>
                <p className="text-xs text-stone-400 mt-1 leading-snug">
                  Demolición, redistribución de tabiquería, nuevas redes REBT/fontanería, aerotermia y carpinterías.
                </p>
                <div className="text-[10px] font-mono text-amber-400 font-semibold mt-2">
                  PEM Base orientativo: desde 690 €/m²
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Contacto RGPD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-950 p-6 rounded-2xl border border-stone-800">
            <div className="space-y-1">
              <label className="text-xs font-mono text-stone-300 font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-500" />
                Nombre *
              </label>
              <input
                type="text"
                placeholder="Ej. Carlos"
                value={clientData.nombre}
                onChange={(e) => setClientData({ ...clientData, nombre: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none"
              />
              {clientErrors.nombre && (
                <p className="text-[11px] text-red-400">{clientErrors.nombre}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-stone-300 font-semibold">
                Apellidos
              </label>
              <input
                type="text"
                placeholder="Ej. Gómez Ruiz"
                value={clientData.apellidos}
                onChange={(e) => setClientData({ ...clientData, apellidos: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-stone-300 font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                Teléfono de Contacto (+34) *
              </label>
              <input
                type="tel"
                placeholder="Ej. 654 98 76 54"
                value={clientData.telefono}
                onChange={(e) => setClientData({ ...clientData, telefono: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none"
              />
              {clientErrors.telefono && (
                <p className="text-[11px] text-red-400">{clientErrors.telefono}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-stone-300 font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                Correo Electrónico (Copia de la estimación) *
              </label>
              <input
                type="email"
                placeholder="Ej. carlos@gmail.com"
                value={clientData.email}
                onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none"
              />
              {clientErrors.email && (
                <p className="text-[11px] text-red-400">{clientErrors.email}</p>
              )}
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-mono text-stone-300 font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                Localidad de la Parcela o Inmueble *
              </label>
              <input
                type="text"
                placeholder="Ej. Torrijos, Fuensalida, Toledo Capital, Illescas, Talavera, Madrid..."
                value={clientData.localidad}
                onChange={(e) => setClientData({ ...clientData, localidad: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none"
              />
              {clientErrors.localidad && (
                <p className="text-[11px] text-red-400">{clientErrors.localidad}</p>
              )}
            </div>

            {/* Casillas obligatorias RGPD y Confidencialidad STL */}
            <div className="sm:col-span-2 pt-3 border-t border-stone-800/80 space-y-2.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={clientData.aceptaPrivacidad}
                  onChange={(e) =>
                    setClientData({ ...clientData, aceptaPrivacidad: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-amber-500 shrink-0"
                />
                <span className="text-[11px] text-stone-300 leading-relaxed">
                  <strong>Consentimiento obligatorio RGPD:</strong> Autorizo a PROJECT 3D al tratamiento de mis datos de contacto conforme a la normativa española (RGPD UE 2016/679 y LOPDGDD 3/2018) para la gestión técnica de mi estimación.
                </span>
              </label>
              {clientErrors.privacidad && (
                <p className="text-[11px] text-red-400 pl-6">{clientErrors.privacidad}</p>
              )}

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={clientData.aceptaConfidencialidadSTL}
                  onChange={(e) =>
                    setClientData({ ...clientData, aceptaConfidencialidadSTL: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-amber-500 shrink-0"
                />
                <span className="text-[11px] text-stone-300 leading-relaxed">
                  <strong>Protección de propiedad intelectual STL:</strong> Certifico la legitimidad sobre los archivos adjuntos y autorizo su análisis paramétrico bajo custodia cifrada y secreto profesional, sin cesión a terceros.
                </span>
              </label>
              {clientErrors.confidencialidad && (
                <p className="text-[11px] text-red-400 pl-6">{clientErrors.confidencialidad}</p>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* BLOQUE 2: PARÁMETROS CONSTRUCTIVOS (SUPERFICIE, PLANTAS...) */}
        {/* ========================================================= */}
        <section ref={block2Ref} className="space-y-6 pt-4 border-t border-stone-800">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="space-y-1">
              <span className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">2</span>
                BLOQUE 2: PARÁMETROS CONSTRUCTIVOS
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Superficie, Distribución, Calidades y Extras
              </h3>
            </div>
            <span className="text-[11px] font-mono text-stone-400 bg-stone-950 px-2.5 py-1 rounded border border-stone-800 hidden sm:inline">
              Paso 2 de 4
            </span>
          </div>

          {/* Superficie m2 (Cálculo principal de metros según especificación CRO) */}
          <div className="bg-stone-950 p-6 rounded-2xl border-2 border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="space-y-1">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-amber-400" />
                Superficie Construida Total Deseada (m²) *
              </div>
              <p className="text-xs text-stone-400 max-w-lg">
                El cálculo principal se alimenta de este valor para garantizar precisión y evitar desajustes de escala en mallas STL de terceros.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="number"
                min={30}
                max={900}
                value={superficieM2}
                onChange={(e) => setSuperficieM2(Math.max(20, Number(e.target.value)))}
                className="w-32 bg-stone-900 border-2 border-amber-500 text-amber-400 font-mono font-bold text-lg rounded-xl px-4 py-2.5 text-center focus:outline-none"
              />
              <span className="font-mono text-xs text-stone-300 font-semibold">m² constr.</span>
            </div>
          </div>
          {clientErrors.superficie && (
            <p className="text-[11px] text-red-400">{clientErrors.superficie}</p>
          )}

          {/* Plantas, Dormitorios, Baños */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
              <label className="text-xs font-mono text-stone-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-stone-300 font-medium">
                  <Layers className="w-3.5 h-3.5 text-amber-500" />
                  Plantas
                </span>
                <span className="text-amber-400 font-bold">{plantas}</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPlantas(num)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      plantas === num
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                        : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-white'
                    }`}
                  >
                    {num} {num === 1 ? 'planta' : 'plantas'}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
              <label className="text-xs font-mono text-stone-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-stone-300 font-medium">
                  <Bed className="w-3.5 h-3.5 text-amber-500" />
                  Dormitorios
                </span>
                <span className="text-amber-400 font-bold">{habitaciones}</span>
              </label>
              <div className="flex gap-2">
                {[2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setHabitaciones(num)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      habitaciones === num
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                        : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
              <label className="text-xs font-mono text-stone-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-stone-300 font-medium">
                  <Bath className="w-3.5 h-3.5 text-amber-500" />
                  Baños
                </span>
                <span className="text-amber-400 font-bold">{banos}</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setBanos(num)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      banos === num
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                        : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Calidades */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-mono text-stone-300 uppercase tracking-wider font-semibold">
              Memoria de Calidades Constructivas
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.keys(QUALITY_CONFIG) as QualityLevel[]).map((qKey) => {
                const q = QUALITY_CONFIG[qKey];
                const isSelected = calidad === qKey;
                return (
                  <div
                    key={qKey}
                    onClick={() => setCalidad(qKey)}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-950/20 shadow-md'
                        : 'border-stone-800 bg-stone-950/60 hover:border-stone-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-white">{q.name}</h4>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                      </div>
                      <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                        {q.description}
                      </p>
                      <div className="mt-3 space-y-1.5">
                        {q.specs.slice(0, 3).map((spec, sIdx) => (
                          <div key={sIdx} className="text-[10px] text-stone-300 flex items-start gap-1.5">
                            <span className="text-amber-500 font-bold">·</span>
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-stone-800/80 mt-3 text-[10px] font-mono text-amber-400 text-right">
                      Multiplicador CTE: x{q.multiplier}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Extras: Piscina, Garaje, Urbanización, etc. */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-mono text-stone-300 uppercase tracking-wider font-semibold">
              Equipamiento Opcional y Extras
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  key: 'piscina',
                  title: EXTRAS_COSTS.piscina.name,
                  price: EXTRAS_COSTS.piscina.cost,
                  desc: EXTRAS_COSTS.piscina.description,
                },
                {
                  key: 'garaje',
                  title: EXTRAS_COSTS.garaje.name,
                  price: EXTRAS_COSTS.garaje.cost,
                  desc: EXTRAS_COSTS.garaje.description,
                },
                {
                  key: 'urbanizacion',
                  title: EXTRAS_COSTS.urbanizacion.name,
                  price: EXTRAS_COSTS.urbanizacion.cost,
                  desc: EXTRAS_COSTS.urbanizacion.description,
                },
                {
                  key: 'aerotermiaSueloRadiante',
                  title: EXTRAS_COSTS.aerotermiaSueloRadiante.name,
                  price: EXTRAS_COSTS.aerotermiaSueloRadiante.cost,
                  desc: EXTRAS_COSTS.aerotermiaSueloRadiante.description,
                },
                {
                  key: 'placasSolares',
                  title: EXTRAS_COSTS.placasSolares.name,
                  price: EXTRAS_COSTS.placasSolares.cost,
                  desc: EXTRAS_COSTS.placasSolares.description,
                },
                {
                  key: 'domotica',
                  title: EXTRAS_COSTS.domotica.name,
                  price: EXTRAS_COSTS.domotica.cost,
                  desc: EXTRAS_COSTS.domotica.description,
                },
              ].map((item) => {
                const isChecked = extras[item.key as keyof ProjectExtras];
                return (
                  <label
                    key={item.key}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'border-amber-500 bg-amber-950/20 text-white'
                        : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        setExtras({
                          ...extras,
                          [item.key]: e.target.checked,
                        })
                      }
                      className="mt-0.5 w-4 h-4 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-amber-500"
                    />
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold leading-tight">{item.title}</div>
                      <div className="text-[11px] text-stone-400 line-clamp-1">{item.desc}</div>
                      <div className="text-[11px] font-mono text-amber-400 font-semibold">
                        +{item.price.toLocaleString()} €
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* BLOQUE 3: ZONA DE CARGA DE ARCHIVO STL (MODELO HÍBRIDO) */}
        {/* ========================================================= */}
        <section ref={block3Ref} className="space-y-6 pt-4 border-t border-stone-800">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="space-y-1">
              <span className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">3</span>
                BLOQUE 3: CARGA DE ARCHIVOS .STL (MODELO HÍBRIDO & VISOR 3D)
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Soporte Visual 3D y Validación Geométrica Ligera
              </h3>
            </div>
            <span className="text-[11px] font-mono text-stone-400 bg-stone-950 px-2.5 py-1 rounded border border-stone-800 hidden sm:inline">
              Paso 3 de 4
            </span>
          </div>

          {/* Nota técnica de Estrategia Híbrida según especificación */}
          <div className="bg-stone-950 p-4 rounded-2xl border border-amber-500/30 flex items-start gap-3 text-xs">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-mono text-amber-400 font-bold uppercase text-[11px]">
                Estrategia de Análisis del Fichero STL (Modelo Híbrido)
              </div>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                El archivo STL se utiliza estrictamente como <strong>soporte visual y base geométrica complementaria</strong> a través del visor 3D web ligero (Three.js). El cálculo principal de metros cuadrados y costes se alimenta de los parámetros declarados en el Bloque 2 para evitar errores derivados de escalas no normalizadas o mallas no cerradas.
              </p>
            </div>
          </div>

          {/* Three.js Interactive Component */}
          <ThreeDStlViewer
            stlAnalysis={stlAnalysis}
            onAnalysisComplete={(analysis) => {
              setStlAnalysis(analysis);
            }}
            suggestedM2={superficieM2}
          />
        </section>

        {/* ========================================================= */}
        {/* BLOQUE 4: BOTÓN DE CÁLCULO ESTIMACIÓN INICIAL (+15% MARGEN) */}
        {/* ========================================================= */}
        <section ref={block4Ref} className="pt-6 border-t border-stone-800 space-y-4">
          <div className="bg-stone-950 p-6 rounded-2xl border-2 border-amber-500/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-mono text-amber-400 uppercase font-bold tracking-wider">
                BLOQUE 4: ACCIÓN FINAL
              </span>
              <h4 className="text-lg sm:text-xl font-bold text-white">
                Generar Estimación Inicial (Nivel 1 - Gratuita)
              </h4>
              <p className="text-xs text-stone-300 max-w-xl">
                Aplica automáticamente el <strong>margen de seguridad del 15%</strong> preventivo sobre costes medios de mercado y dispara el registro de tu expediente en el CRM de Torrijos.
              </p>
            </div>

            <button
              onClick={handleCalculateEstimate}
              disabled={isCalculating}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-black px-8 py-4 rounded-xl text-sm flex items-center justify-center gap-3 transition-all shadow-xl shadow-amber-500/30 shrink-0"
            >
              {isCalculating ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>Procesando parámetros...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-stone-950" />
                  <span>Calcular Estimación Inicial Gratuita</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </section>

        {/* ========================================================= */}
        {/* RESULTADOS: MODELO DE DOS FASES COMERCIALES (FASE A & B) */}
        {/* ========================================================= */}
        {result && (
          <section ref={resultsRef} className="pt-10 border-t-2 border-amber-500/50 space-y-8 animate-in fade-in duration-300">
            
            {/* Header de resultados */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Estimación Automática Emitida con Éxito
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Presupuesto Global: {result.parameters.type === 'obra_nueva' ? 'Vivienda Adosada' : 'Reforma Integral'}
                </h3>
                <div className="text-xs text-stone-400 mt-1 flex items-center gap-2">
                  <span>Expediente CRM: <strong className="font-mono text-amber-400">{result.referenceCode}</strong></span>
                  <span>·</span>
                  <span>Cliente: <strong className="text-stone-200">{result.client.nombre} ({result.client.localidad})</strong></span>
                </div>
              </div>

              {/* Dossier button */}
              <button
                onClick={() => onOpenDossier(result)}
                className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2 rounded-xl text-xs font-medium border border-stone-700 transition-colors self-start sm:self-auto"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Ver Dossier Imprimible</span>
              </button>
            </div>

            {/* TAB SELECTOR: MODELO DE DOS FASES COMERCIALES */}
            <div className="bg-stone-950 p-1.5 rounded-2xl border border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveTier('nivel_1_gratuito')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTier === 'nivel_1_gratuito'
                    ? 'bg-stone-800 text-amber-400 shadow-md border border-stone-700'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <BadgeCheck className="w-4 h-4 text-amber-400" />
                <span>FASE A: Estimación Inicial Gratuita (Activa)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (result.activeTier !== 'nivel_2_avanzado') {
                    setIsLevel2ModalOpen(true);
                  } else {
                    setActiveTier('nivel_2_avanzado');
                  }
                }}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTier === 'nivel_2_avanzado'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-300 hover:text-amber-400 bg-amber-950/20 border border-amber-500/30'
                }`}
              >
                {result.activeTier === 'nivel_2_avanzado' ? (
                  <>
                    <Unlock className="w-4 h-4 text-stone-950" />
                    <span>FASE B: Estudio Técnico Avanzado (Visado Desbloqueado)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>FASE B: Estudio Técnico Avanzado de Pago Variable ({result.level2Study.totalWithIva} €)</span>
                  </>
                )}
              </button>
            </div>

            {/* AVISO OBLIGATORIO Y VISIBLE DE NO CONTRACTUALIDAD REQUERIDO ESTRICTAMENTE */}
            <div className="bg-amber-950/40 border-2 border-amber-500 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 font-bold">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                    AVISO OBLIGATORIO DE NO CONTRACTUALIDAD
                  </div>
                  <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed">
                    "Atención: Este documento es una Estimación Automática Inicial basada en geometría STL. No constituye un presupuesto contractual. Un técnico especialista de PROJECT 3D validará los datos para emitir su presupuesto definitivo."
                  </p>
                </div>
              </div>
            </div>

            {/* FASE A: RESUMEN GLOBAL GRATUITO CON MARGEN DEL 15% */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-500" />
                  FASE A · Estimación Inicial Gratuita (Margen Preventivo 15% Incluido)
                </h4>
                <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/50 border border-emerald-500/40 px-2 py-0.5 rounded">
                  Gratuito
                </span>
              </div>

              {/* Large Total Highlight Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: Coste Base de Ejecución */}
                <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-1">
                  <div className="text-[11px] font-mono text-stone-400 uppercase">Coste Base Medios Mercado</div>
                  <div className="text-2xl font-bold font-mono text-stone-200">
                    {result.baseCost.toLocaleString()} €
                  </div>
                  <div className="text-[11px] text-stone-500">
                    PEM orientativo sin contingencias
                  </div>
                </div>

                {/* Card 2: Margen de Seguridad del 15% */}
                <div className="bg-amber-950/20 p-5 rounded-2xl border border-amber-500/50 space-y-1">
                  <div className="text-[11px] font-mono text-amber-400 uppercase flex items-center justify-between">
                    <span>Margen de Seguridad (15%)</span>
                    <span className="bg-amber-500 text-stone-950 px-1.5 py-0.2 rounded font-bold text-[10px]">+15%</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-amber-400">
                    +{result.contingencyMargin.toLocaleString()} €
                  </div>
                  <div className="text-[11px] text-amber-200/70">
                    Cojín de seguridad contra fluctuaciones
                  </div>
                </div>

                {/* Card 3: Total Estimado con IVA 10% */}
                <div className="bg-stone-950 p-5 rounded-2xl border-2 border-emerald-500/60 space-y-1">
                  <div className="text-[11px] font-mono text-emerald-400 uppercase">
                    Total Estimado Inicial (con IVA 10%)
                  </div>
                  <div className="text-3xl font-black font-mono text-emerald-400">
                    {result.totalEstimate.toLocaleString()} €
                  </div>
                  <div className="text-[11px] font-mono text-stone-400">
                    {result.costPerM2.toLocaleString()} € / m² ({result.parameters.superficieM2} m²)
                  </div>
                </div>
              </div>
            </div>

            {/* FASE B: ESTUDIO TÉCNICO AVANZADO DE PAGO VARIABLE SEGÚN M2 */}
            {result.activeTier !== 'nivel_2_avanzado' ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-stone-950 border-2 border-amber-500/60 relative overflow-hidden space-y-6 shadow-2xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-800">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold">
                      <Lock className="w-3.5 h-3.5" />
                      FASE B Opcional · Estudio Técnico Avanzado de Pago Variable
                    </div>
                    <h4 className="text-2xl font-extrabold text-white">
                      Desbloquea el Desglose Detallado por Partidas y Mediciones Reales
                    </h4>
                    <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                      La estimación gratuita te ofrece una cifra global. La <strong>FASE B</strong> asigna a un Arquitecto Técnico colegiado para emitir la auditoría de malla STL, desglose exhaustivo de partidas de obra y presupuesto contractual cerrado.
                    </p>
                  </div>

                  <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 text-center lg:text-right shrink-0 space-y-1">
                    <div className="text-[10px] font-mono text-stone-400 uppercase">Coste Variable según m²</div>
                    <div className="text-3xl font-black font-mono text-amber-400">
                      {result.level2Study.totalWithIva} €
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono">
                      (Base 180 € + {result.level2Study.variableM2Fee} € para {result.level2Study.surfaceM2} m²)
                    </div>
                    <div className="text-[10px] text-emerald-400 font-bold pt-1">
                      100% Deducible si construyes con nosotros
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {result.level2Study.deliverables.map((deliv, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2.5 bg-stone-900/60 p-3 rounded-xl border border-stone-800 text-xs text-stone-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-relaxed">{deliv}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-stone-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Visado y supervisión por aparejadores colegiados en Torrijos (Toledo).</span>
                  </div>

                  <button
                    onClick={() => setIsLevel2ModalOpen(true)}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-8 py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/25"
                  >
                    <span>Solicitar Estudio Técnico de FASE B ({result.level2Study.totalWithIva} €)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* FASE B DESBLOQUEADA */
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-emerald-950/30 border-2 border-emerald-500/60 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-stone-950 flex items-center justify-center font-bold">
                      <BadgeCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">FASE B Activada · Estudio Técnico Avanzado Visado</div>
                      <div className="text-xs text-emerald-300">
                        Expediente técnico asignado a la oficina de Torrijos · Tarifa de {result.level2Study.totalWithIva} € deducible 100% en obra.
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/40 font-bold">
                    ENTREGA VISADA &lt; 48H
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-amber-500" />
                      Desglose Pormenorizado por Partidas y Mediciones (CTE)
                    </h4>
                    <span className="text-xs font-mono text-stone-400">
                      Colegio Oficial de Aparejadores
                    </span>
                  </div>

                  <div className="bg-stone-950 rounded-2xl border border-stone-800 divide-y divide-stone-800/80 overflow-hidden">
                    {result.items.map((item) => (
                      <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-900/50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-200">{item.category}</span>
                            {item.isExtra && (
                              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/30">
                                Extra Opcional
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-400 leading-relaxed max-w-2xl">
                            {item.description}
                          </p>
                        </div>

                        <div className="text-right sm:shrink-0">
                          <div className="text-sm font-mono font-bold text-amber-300">
                            {item.amount.toLocaleString()} €
                          </div>
                          {item.percentage > 0 && (
                            <div className="text-[10px] font-mono text-stone-500">
                              {item.percentage}% del PEM base
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="p-4 bg-amber-950/20 flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-2 text-amber-300 font-bold">
                        <span>Subtotal con Margen de Seguridad Preventivo del 15%:</span>
                      </div>
                      <div className="text-sm font-bold text-amber-400">
                        {result.subtotalWithMargin.toLocaleString()} €
                      </div>
                    </div>

                    <div className="p-4 bg-stone-950 flex items-center justify-between font-mono text-xs text-stone-400">
                      <div>IVA Reducido Aplicable (10% Autopromoción / Reforma habitual):</div>
                      <div className="text-stone-300 font-semibold">{result.ivaAmount.toLocaleString()} €</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Herramientas de Productividad Google Workspace (Sheets, Calendar, Slides) */}
            <GoogleWorkspaceActions
              estimation={result}
              onOpenCalendarModal={() => {
                if (onOpenCalendarModal) {
                  onOpenCalendarModal(result);
                } else {
                  onRequestProfessionalReview(result);
                }
              }}
              userEmail={result.client.email}
            />

            {/* CTA Final: Solicitar Revisión y Presupuesto Cerrado */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/40 border-2 border-amber-500/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="space-y-2 text-center sm:text-left">
                <div className="text-xs font-mono text-amber-400 uppercase font-bold tracking-wider">
                  Siguiente Paso Sin Compromiso
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white">
                  ¿Quieres convertir esta estimación en presupuesto contractual cerrado?
                </h4>
                <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
                  Un arquitecto técnico de PROJECT 3D revisará tu parcela o inmueble en Torrijos, Toledo o Madrid para cotejar mediciones y emitir el documento contractual definitivo.
                </p>
              </div>

              <button
                onClick={() => onRequestProfessionalReview(result)}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-8 py-4 rounded-xl text-sm flex items-center justify-center gap-3 transition-all shadow-xl shadow-amber-500/30 shrink-0"
              >
                <Calendar className="w-5 h-5 text-stone-950" />
                <span>Solicitar Revisión Profesional y Presupuesto</span>
              </button>
            </div>

          </section>
        )}

      </div>

      {/* Level 2 Order Modal */}
      {result && (
        <Level2OrderModal
          isOpen={isLevel2ModalOpen}
          onClose={() => setIsLevel2ModalOpen(false)}
          result={result}
          onSuccessUnlock={handleUnlockLevel2}
        />
      )}

    </div>
  );
};

export type ProjectType = 'obra_nueva' | 'reforma_integral';

export type QualityLevel = 'estandar' | 'premium' | 'lujo';

export type CommercialTier = 'nivel_1_gratuito' | 'nivel_2_avanzado';

export interface ProjectExtras {
  piscina: boolean;
  garaje: boolean;
  urbanizacion: boolean;
  aerotermiaSueloRadiante: boolean;
  placasSolares: boolean;
  domotica: boolean;
}

export interface ClientData {
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  localidad: string;
  observaciones: string;
  aceptaPrivacidad: boolean; // Opt-in RGPD obligatorio
  aceptaConfidencialidadSTL: boolean; // Opt-in Confidencialidad y custodia segura de STL
  aceptaComunicaciones?: boolean;
}

export interface STLAnalysis {
  fileName: string;
  fileSizeBytes: number;
  trianglesCount: number;
  dimensions: {
    widthM: number;
    depthM: number;
    heightM: number;
  };
  volumeM3: number;
  estimatedBuiltAreaM2: number;
  isValidGeometry: boolean;
  isWatertight: boolean;
}

export interface ProjectParameters {
  type: ProjectType;
  plantas: number;
  habitaciones: number;
  banos: number;
  calidad: QualityLevel;
  superficieM2: number;
  extras: ProjectExtras;
  stlAnalysis: STLAnalysis | null;
}

export interface CostBreakdownItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  percentage: number;
  isExtra?: boolean;
}

export interface Level2StudyDetails {
  baseFee: number;
  surfaceM2: number;
  variableM2Fee: number;
  ratePerAdditionalM2: number;
  totalBeforeIva: number;
  iva21: number;
  totalWithIva: number;
  estimatedDeliveryHours: number;
  deliverables: string[];
  deductible100Percent: boolean;
}

export interface EstimationResult {
  baseCost: number;
  contingencyMargin: number; // 15%
  contingencyPercentage: 15;
  subtotalWithMargin: number;
  ivaAmount: number; // 10%
  totalEstimate: number;
  costPerM2: number;
  items: CostBreakdownItem[];
  parameters: ProjectParameters;
  client: ClientData;
  generatedDate: string;
  referenceCode: string;
  activeTier: CommercialTier;
  level2Study: Level2StudyDetails;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
  isWarning?: boolean;
}

export type LeadStatus = 'nuevo' | 'en_revision' | 'contactado' | 'visita_fijada';

export interface LeadRecord {
  id: string;
  referenceCode: string;
  client: ClientData;
  parameters: ProjectParameters;
  estimation: EstimationResult;
  createdAt: string;
  status: LeadStatus;
  commercialAssignee: string;
  emailClientSent: boolean;
  notificationCommercialSent: boolean;
  slaHoursRemaining: number;
}


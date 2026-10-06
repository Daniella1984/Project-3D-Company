import { CostBreakdownItem, EstimationResult, Level2StudyDetails, ProjectParameters, QualityLevel } from '../types';

export const QUALITY_CONFIG: Record<
  QualityLevel,
  {
    name: string;
    description: string;
    multiplier: number;
    specs: string[];
  }
> = {
  estandar: {
    name: 'Estándar Confort',
    description: 'Materiales nobles y solventes con certificación CTE y aislamiento acústico/térmico contrastado.',
    multiplier: 1.0,
    specs: [
      'Gres cerámico esmaltado de primera calidad',
      'Carpintería de aluminio/PVC con rotura de puente térmico y doble vidrio 4/16/4',
      'Pintura plástica lisa mate lavable',
      'Sanitarios Roca serie Victoria o Gap suspendidos',
      'Preinstalación de climatización por conductos o radiadores de baja temperatura',
    ],
  },
  premium: {
    name: 'Gama Alta / Alta Eficiencia',
    description: 'Nuestra opción más demandada: acabados de alta gama, eficiencia energética A y detalles a medida.',
    multiplier: 1.25,
    specs: [
      'Pavimento porcelánico rectificado de gran formato o tarima multicapa AC5',
      'Carpintería Cortizo o Schüco con triple acristalamiento bajo emisivo y control solar',
      'Aerotermia Daikin o Vaillant con suelo radiante/refrescante',
      'Griferías termostáticas empotradas Grohe o Hansgrohe',
      'Iluminación LED indirecta arquitectónica en foseados y molduras',
    ],
  },
  lujo: {
    name: 'Exclusiva / Passivhaus',
    description: 'Máximo estándar arquitectónico: construcción bioclimática, domótica integral y materiales de vanguardia.',
    multiplier: 1.55,
    specs: [
      'Piedra natural, microcemento continuo o tarima maciza de roble francés',
      'Muro cortina y ventanales minimalistas de suelo a techo con perfilería oculta',
      'Ventilación mecánica de doble flujo con recuperación de calor (Zehnder)',
      'Domótica integral controlada por smartphone y voz',
      'Mobiliario a medida en madera noble y encimeras de piedra sinterizada Dekton/Neolith',
    ],
  },
};

export const EXTRAS_COSTS = {
  piscina: {
    name: 'Piscina de obra con cloración salina',
    description: 'Vaso de hormigón gunitado 7x3m, coronación porcelánica y clorador salino',
    cost: 15400,
  },
  garaje: {
    name: 'Garaje cerrado / Porche estructural',
    description: 'Estructura cubierta con puerta seccional motorizada y punto de recarga VE',
    cost: 12800,
  },
  urbanizacion: {
    name: 'Urbanización exterior y acondicionamiento de parcela',
    description: 'Solera perimetral de hormigón impreso/porcelánico exterior, vallado perimetral y tomas de jardín',
    cost: 7600,
  },
  aerotermiaSueloRadiante: {
    name: 'Climatización Aerotermia + Suelo Radiante/Refrescante',
    description: 'Bomba de calor Inverter de alta eficiencia y colectores con termostatos independientes',
    cost: 8900,
  },
  placasSolares: {
    name: 'Placas Solares Fotovoltaicas (4.2 kWp)',
    description: 'Paneles monocristalinos de alta eficiencia con inversor híbrido y monitorización app',
    cost: 5800,
  },
  domotica: {
    name: 'Sistema Domótico Integral de Vivienda',
    description: 'Control de climatización, persianas motorizadas, accesos y escenas lumínicas',
    cost: 4200,
  },
};

/**
 * Calcula la tarifa del Nivel 2 (Estudio Técnico Avanzado) de coste variable según m²
 */
export function calculateLevel2StudyFee(surfaceM2: number): Level2StudyDetails {
  const surface = Math.max(30, Math.round(surfaceM2 || 120));
  const baseFee = 180; // Apertura de expediente técnico e inspección urbanística en Torrijos
  const thresholdM2 = 90;
  const ratePerAdditionalM2 = 1.8; // Tarifa variable por m² adicional

  const variableM2Fee = surface > thresholdM2 ? Math.round((surface - thresholdM2) * ratePerAdditionalM2) : 0;
  const totalBeforeIva = baseFee + variableM2Fee;
  const iva21 = Math.round(totalBeforeIva * 0.21);
  const totalWithIva = totalBeforeIva + iva21;

  return {
    baseFee,
    surfaceM2: surface,
    variableM2Fee,
    ratePerAdditionalM2,
    totalBeforeIva,
    iva21,
    totalWithIva,
    estimatedDeliveryHours: 48,
    deductible100Percent: true,
    deliverables: [
      'Desglose exhaustivo por capítulos constructivos visado por Arquitecto Técnico.',
      'Auditoría y validación geométrica de archivo STL / plano 3D con detección de colisiones.',
      'Memoria de cumplimiento del Código Técnico de la Edificación (CTE) y PGOU Torrijos.',
      'Visita técnica presencial in-situ prioritaria en parcela o inmueble existente.',
      '100% Deducible en el contrato final de obra al construir con PROJECT 3D.',
    ],
  };
}

/**
 * Calcula la estimación técnica aplicando estrictamente el 15% de margen de seguridad
 */
export function calculateProjectEstimate(params: ProjectParameters, clientData: any): EstimationResult {
  const isObraNueva = params.type === 'obra_nueva';
  const surface = Math.max(30, params.superficieM2 || 120);
  const quality = QUALITY_CONFIG[params.calidad] || QUALITY_CONFIG.estandar;
  const qualityMult = quality.multiplier;

  // Costes base medios de mercado en España (zona centro: Toledo / Madrid)
  // Obra nueva adosada base: ~1.180 €/m²
  // Reforma integral base: ~680 €/m²
  const baseRatePerM2 = isObraNueva ? 1180 : 690;
  const adjustedBaseRate = baseRatePerM2 * qualityMult;
  const constructionBase = surface * adjustedBaseRate;

  // Desglose por partidas técnicas según estándar de edificación
  const items: CostBreakdownItem[] = [];

  if (isObraNueva) {
    items.push({
      id: 'cimentacion',
      category: 'Cimentación y Movimiento de Tierras',
      description: 'Excavación, zapatas, losa armada, viga de atado y solera ventilada con red de saneamiento enterrado.',
      amount: Math.round(constructionBase * 0.13),
      percentage: 13,
    });
    items.push({
      id: 'estructura',
      category: 'Estructura, Fachadas y Cubierta',
      description: 'Estructura de hormigón armado/acero, cerramiento exterior cerámico con aislamiento SATE y cubierta invertida/teja.',
      amount: Math.round(constructionBase * 0.32),
      percentage: 32,
    });
    items.push({
      id: 'instalaciones',
      category: 'Instalaciones Técnicas (Fontanería, Electricidad y Clima)',
      description: 'Cuadro eléctrico general REBT, fontanería multicapa, evacuación insonorizada y preinstalación de climatización.',
      amount: Math.round(constructionBase * 0.21),
      percentage: 21,
    });
    items.push({
      id: 'revestimientos',
      category: 'Revestimientos, Tabiquería y Pavimentos',
      description: 'Tabiquería seca tipo pladur con lana de roca, alicatados y pavimentos porcelánicos según calidad ' + quality.name + '.',
      amount: Math.round(constructionBase * 0.16),
      percentage: 16,
    });
    items.push({
      id: 'carpinteria',
      category: 'Carpintería Exterior e Interior',
      description: 'Ventanales de PVC/aluminio con RPT, puerta de acceso blindada y puertas de paso macizas lacadas.',
      amount: Math.round(constructionBase * 0.12),
      percentage: 12,
    });
    items.push({
      id: 'acabados',
      category: 'Sanitarios, Griferías y Pintura',
      description: 'Aparatos sanitarios suspendidos, platos de ducha de resina, grifería técnica y pintura plástica lisa.',
      amount: Math.round(constructionBase * 0.06),
      percentage: 6,
    });
  } else {
    // Reforma Integral
    items.push({
      id: 'demoliciones',
      category: 'Demoliciones y Gestión de Residuos',
      description: 'Retirada de tabiquerías existentes, picado de alicatados, desescombro en contenedor homologado y tasas de vertedero.',
      amount: Math.round(constructionBase * 0.12),
      percentage: 12,
    });
    items.push({
      id: 'reestructuracion',
      category: 'Albañilería y Redistribución de Espacios',
      description: 'Nueva distribución en tabiquería de placa de yeso laminado con aislamiento acústico, recrecido de suelos y falsos techos.',
      amount: Math.round(constructionBase * 0.24),
      percentage: 24,
    });
    items.push({
      id: 'instalaciones_reforma',
      category: 'Renovación Total de Instalaciones',
      description: 'Nueva red eléctrica bajo normativa REBT con tomas y conmutadores modernos, fontanería completa y red de desagües.',
      amount: Math.round(constructionBase * 0.25),
      percentage: 25,
    });
    items.push({
      id: 'pavimentos_reforma',
      category: 'Pavimentos, Baños y Cocina',
      description: 'Suministro y colocación de suelo en toda la vivienda, impermeabilización de zonas húmedas y alicatado de diseño.',
      amount: Math.round(constructionBase * 0.20),
      percentage: 20,
    });
    items.push({
      id: 'carpinteria_reforma',
      category: 'Carpintería y Cerramientos',
      description: 'Sustitución de ventanas por perfiles de alta eficiencia térmica y acústica, y puertas interiores de diseño.',
      amount: Math.round(constructionBase * 0.13),
      percentage: 13,
    });
    items.push({
      id: 'pintura_remates',
      category: 'Pintura, Iluminación y Puesta en Servicio',
      description: 'Tratamiento de paramentos, pintura plástica lisa al látex, mecanismos y focos LED empotrados.',
      amount: Math.round(constructionBase * 0.06),
      percentage: 6,
    });
  }

  // Sumar extras opcionales
  let extrasTotal = 0;
  if (params.extras.piscina) {
    extrasTotal += EXTRAS_COSTS.piscina.cost;
    items.push({
      id: 'extra_piscina',
      category: 'Extra Opcional: Piscina',
      description: EXTRAS_COSTS.piscina.description,
      amount: EXTRAS_COSTS.piscina.cost,
      percentage: 0,
      isExtra: true,
    });
  }
  if (params.extras.garaje) {
    extrasTotal += EXTRAS_COSTS.garaje.cost;
    items.push({
      id: 'extra_garaje',
      category: 'Extra Opcional: Garaje / Pérgola',
      description: EXTRAS_COSTS.garaje.description,
      amount: EXTRAS_COSTS.garaje.cost,
      percentage: 0,
      isExtra: true,
    });
  }
  if (params.extras.urbanizacion) {
    extrasTotal += EXTRAS_COSTS.urbanizacion.cost;
    items.push({
      id: 'extra_urbanizacion',
      category: 'Extra: Urbanización Exterior',
      description: EXTRAS_COSTS.urbanizacion.description,
      amount: EXTRAS_COSTS.urbanizacion.cost,
      percentage: 0,
      isExtra: true,
    });
  }
  if (params.extras.aerotermiaSueloRadiante) {
    extrasTotal += EXTRAS_COSTS.aerotermiaSueloRadiante.cost;
    items.push({
      id: 'extra_aerotermia',
      category: 'Extra: Aerotermia + Suelo Radiante',
      description: EXTRAS_COSTS.aerotermiaSueloRadiante.description,
      amount: EXTRAS_COSTS.aerotermiaSueloRadiante.cost,
      percentage: 0,
      isExtra: true,
    });
  }
  if (params.extras.placasSolares) {
    extrasTotal += EXTRAS_COSTS.placasSolares.cost;
    items.push({
      id: 'extra_solar',
      category: 'Extra: Placas Solares Fotovoltaicas',
      description: EXTRAS_COSTS.placasSolares.description,
      amount: EXTRAS_COSTS.placasSolares.cost,
      percentage: 0,
      isExtra: true,
    });
  }
  if (params.extras.domotica) {
    extrasTotal += EXTRAS_COSTS.domotica.cost;
    items.push({
      id: 'extra_domotica',
      category: 'Extra: Domótica Integral',
      description: EXTRAS_COSTS.domotica.description,
      amount: EXTRAS_COSTS.domotica.cost,
      percentage: 0,
      isExtra: true,
    });
  }

  // Coste base total
  const baseCost = constructionBase + extrasTotal;

  // APLICACIÓN ESTRICTA DEL MARGEN DE SEGURIDAD DEL 15%
  const contingencyPercentage = 15;
  const contingencyMargin = Math.round(baseCost * (contingencyPercentage / 100));
  const subtotalWithMargin = baseCost + contingencyMargin;

  // IVA reducido 10% para autopromoción de vivienda habitual y reformas en España
  const ivaAmount = Math.round(subtotalWithMargin * 0.10);
  const totalEstimate = subtotalWithMargin + ivaAmount;
  const costPerM2 = Math.round(subtotalWithMargin / surface);

  // Recalcular porcentajes sobre el baseCost
  items.forEach((item) => {
    item.percentage = Number(((item.amount / baseCost) * 100).toFixed(1));
  });

  const refDate = new Date();
  const year = refDate.getFullYear();
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const prefix = isObraNueva ? 'P3D-AD' : 'P3D-REF';
  const referenceCode = `${prefix}-${year}-${randomCode}`;

  const level2Study = calculateLevel2StudyFee(surface);

  return {
    baseCost: Math.round(baseCost),
    contingencyMargin,
    contingencyPercentage,
    subtotalWithMargin: Math.round(subtotalWithMargin),
    ivaAmount,
    totalEstimate: Math.round(totalEstimate),
    costPerM2,
    items,
    parameters: params,
    client: clientData,
    generatedDate: refDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    referenceCode,
    activeTier: 'nivel_1_gratuito',
    level2Study,
  };
}

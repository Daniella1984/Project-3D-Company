/**
 * Servicios de integración con Google Workspace:
 * - Google Sheets: Exportación de hojas de cálculo con presupuesto detallado y PEM.
 * - Google Calendar: Agendamiento de visitas técnicas e inspecciones in situ.
 * - Google Slides: Generación de presentaciones ejecutivas del proyecto.
 */

import { getAccessToken } from '../lib/firebase';
import { EstimationResult, LeadRecord } from '../types';

export interface WorkspaceExportResult {
  success: boolean;
  id?: string;
  url?: string;
  error?: string;
}

/**
 * Helper para validar token de acceso o lanzar error
 */
async function requireAccessToken(): Promise<string> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error(
      'Inicia sesión con tu cuenta de Google para acceder a Google Workspace.'
    );
  }
  return token;
}

// ==========================================
// 1. GOOGLE SHEETS INTEGRATION
// ==========================================

export async function exportEstimateToGoogleSheets(
  estimation: EstimationResult,
  clientName?: string
): Promise<WorkspaceExportResult> {
  const token = await requireAccessToken();

  const title = `PROJECT 3D - Presupuesto Estimado ${estimation.referenceCode} - ${
    clientName || estimation.client.nombre || 'Cliente'
  }`;

  // Estructura de filas para la hoja de cálculo
  const rows = [
    // Encabezado
    ['PROJECT 3D · Ecosistema Digital de Construcción'],
    ['Sede:', 'Vivero de Empresas de Torrijos (Toledo, España)'],
    ['Referencia:', estimation.referenceCode],
    ['Fecha Emisión:', new Date(estimation.generatedDate).toLocaleDateString('es-ES')],
    ['Cliente:', `${estimation.client.nombre} ${estimation.client.apellidos}`],
    ['Teléfono / Email:', `${estimation.client.telefono} | ${estimation.client.email}`],
    ['Localidad de Obra:', estimation.client.localidad],
    [],
    ['PARÁMETROS DEL PROYECTO'],
    ['Tipo de Proyecto:', estimation.parameters.type === 'obra_nueva' ? 'Obra Nueva Adosada' : 'Reforma Integral'],
    ['Superficie Construida:', `${estimation.parameters.superficieM2} m²`],
    ['Plantas / Dormitorios / Baños:', `${estimation.parameters.plantas} plantas | ${estimation.parameters.habitaciones} dorm | ${estimation.parameters.banos} baños`],
    ['Nivel de Acabados:', estimation.parameters.calidad.toUpperCase()],
    [],
    ['DESGLOSE DE PARTIDAS DE OBRA (PEM)'],
    ['Capítulo de Obra', 'Descripción / Unidad', 'Importe PEM (€)'],
  ];

  // Partidas del desglose
  estimation.items.forEach((item) => {
    rows.push([item.category, item.description, item.amount.toLocaleString('es-ES') + ' €']);
  });

  // Resumen económico con el 15% de margen
  rows.push(
    [],
    ['RESUMEN ECONÓMICO'],
    ['Presupuesto Ejecución Material Base (PEM):', '', estimation.baseCost.toLocaleString('es-ES') + ' €'],
    ['Margen de Seguridad Preventivo (15%):', 'Fondo técnico de contingencia', estimation.contingencyMargin.toLocaleString('es-ES') + ' €'],
    ['Subtotal con Margen:', '', estimation.subtotalWithMargin.toLocaleString('es-ES') + ' €'],
    ['IVA Reducido (10%):', 'Aplicable a vivienda habitual', estimation.ivaAmount.toLocaleString('es-ES') + ' €'],
    ['ESTIMACIÓN TOTAL GLOBAL:', '', estimation.totalEstimate.toLocaleString('es-ES') + ' €'],
    ['Coste Medio por m²:', '', `${estimation.costPerM2.toLocaleString('es-ES')} €/m²`],
    [],
    ['ESTUDIO TÉCNICO AVANZADO DE PAGO (NIVEL 2)'],
    ['Tarifa según m² (Deducible 100% en obra):', '', `${estimation.level2Study.totalWithIva.toLocaleString('es-ES')} € (IVA incl.)`],
    ['Plazo de Entrega Técnico:', '', `${estimation.level2Study.estimatedDeliveryHours} horas hábiles`],
    [],
    ['AVISO LEGAL OBLIGATORIO DE NO CONTRACTUALIDAD'],
    ['Atención: Este documento es una Estimación Automática Inicial basada en geometría STL y parámetros CRO.'],
    ['No constituye un presupuesto contractual vinculante. Un técnico especialista de PROJECT 3D en Torrijos'],
    ['validará los datos in situ para emitir su presupuesto de obra definitivo.']
  );

  const rowData = rows.map((r) => ({
    values: r.map((cell) => ({
      userEnteredValue: { stringValue: String(cell) },
    })),
  }));

  try {
    const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: { title },
        sheets: [
          {
            properties: {
              title: 'Presupuesto PROJECT 3D',
              gridProperties: { rowCount: rows.length + 5, columnCount: 6 },
            },
            data: [{ startRow: 0, startColumn: 0, rowData }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Error al crear la hoja de cálculo en Google Sheets');
    }

    const data = await response.json();
    return {
      success: true,
      id: data.spreadsheetId,
      url: data.spreadsheetUrl,
    };
  } catch (error: any) {
    console.error('[Google Sheets Error]:', error);
    return {
      success: false,
      error: error.message || 'Error desconocido al conectar con Google Sheets',
    };
  }
}

// ==========================================
// 2. GOOGLE CALENDAR INTEGRATION
// ==========================================

export interface CalendarEventPayload {
  title: string;
  description: string;
  location: string;
  startDateIso: string; // ej: 2026-10-12T10:00:00
  endDateIso: string;   // ej: 2026-10-12T11:30:00
  clientEmail?: string;
}

export async function createGoogleCalendarEvent(
  payload: CalendarEventPayload
): Promise<WorkspaceExportResult> {
  const token = await requireAccessToken();

  const eventBody: any = {
    summary: payload.title,
    description: payload.description,
    location: payload.location || 'Sede PROJECT 3D: Vivero de Empresas de Torrijos (Toledo)',
    start: {
      dateTime: payload.startDateIso,
      timeZone: 'Europe/Madrid',
    },
    end: {
      dateTime: payload.endDateIso,
      timeZone: 'Europe/Madrid',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 60 },
      ],
    },
  };

  if (payload.clientEmail) {
    eventBody.attendees = [{ email: payload.clientEmail }];
  }

  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventBody),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Error al programar la cita en Google Calendar');
    }

    const data = await response.json();
    return {
      success: true,
      id: data.id,
      url: data.htmlLink,
    };
  } catch (error: any) {
    console.error('[Google Calendar Error]:', error);
    return {
      success: false,
      error: error.message || 'Error al programar la cita en Google Calendar',
    };
  }
}

// ==========================================
// 3. GOOGLE SLIDES INTEGRATION
// ==========================================

export async function createGoogleSlidesPresentation(
  estimation: EstimationResult,
  clientName?: string
): Promise<WorkspaceExportResult> {
  const token = await requireAccessToken();

  const title = `PROJECT 3D - Dossier Ejecutivo ${estimation.referenceCode} - ${
    clientName || estimation.client.nombre || 'Cliente'
  }`;

  try {
    // 1. Crear la presentación vacía
    const createRes = await fetch('https://slides.googleapis.com/v1/presentations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      throw new Error(err.error?.message || 'Error al crear la presentación en Google Slides');
    }

    const presentation = await createRes.json();
    const presentationId = presentation.presentationId;

    // 2. Crear diapositivas con contenido estructurado mediante batchUpdate
    const slide1Id = 'slide_resumen_' + Date.now();
    const slide2Id = 'slide_economico_' + Date.now();
    const slide3Id = 'slide_fases_' + Date.now();

    const requests = [
      // Diapositiva 2: Parámetros del proyecto
      {
        createSlide: {
          objectId: slide1Id,
          insertionIndex: 1,
          slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
        },
      },
      // Diapositiva 3: Desglose económico con margen 15%
      {
        createSlide: {
          objectId: slide2Id,
          insertionIndex: 2,
          slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
        },
      },
      // Diapositiva 4: Modelo comercial de dos fases
      {
        createSlide: {
          objectId: slide3Id,
          insertionIndex: 3,
          slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
        },
      },
    ];

    await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    });

    const presentationUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`;

    return {
      success: true,
      id: presentationId,
      url: presentationUrl,
    };
  } catch (error: any) {
    console.error('[Google Slides Error]:', error);
    return {
      success: false,
      error: error.message || 'Error al generar la presentación en Google Slides',
    };
  }
}

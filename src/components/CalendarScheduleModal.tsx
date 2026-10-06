import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Building,
} from 'lucide-react';
import { EstimationResult } from '../types';
import { createGoogleCalendarEvent } from '../services/googleWorkspace';
import { saveTechnicalVisitToFirestore } from '../services/firestoreService';

interface CalendarScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  estimation: EstimationResult | null;
  onSuccess?: (eventUrl: string) => void;
}

export const CalendarScheduleModal: React.FC<CalendarScheduleModalProps> = ({
  isOpen,
  onClose,
  estimation,
  onSuccess,
}) => {
  const [date, setDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 3);
    return nextWeek.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('10:00');
  const [locationType, setLocationType] = useState<'sede' | 'parcela'>('parcela');
  const [address, setAddress] = useState(
    estimation?.client.localidad || 'Torrijos (Toledo)'
  );
  const [notes, setNotes] = useState(
    'Revisión técnica inicial de geometría STL y comprobación in situ de acometidas.'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduledUrl, setScheduledUrl] = useState<string | null>(null);

  if (!isOpen || !estimation) return null;

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Destructive / mutating operation confirmation as required by Workspace guidelines
    const confirmed = window.confirm(
      `¿Deseas programar una visita técnica en tu Google Calendar para el ${date} a las ${time}?`
    );
    if (!confirmed) {
      setIsLoading(false);
      return;
    }

    try {
      const startIso = `${date}T${time}:00`;
      const endHour = String(Number(time.split(':')[0]) + 1).padStart(2, '0');
      const endIso = `${date}T${endHour}:${time.split(':')[1]}:00`;

      const resolvedLocation =
        locationType === 'sede'
          ? 'Sede Central: Vivero de Empresas de Torrijos, Calle de las Hilanderas, Torrijos (Toledo)'
          : `Parcela / Inmueble del Cliente: ${address}`;

      const res = await createGoogleCalendarEvent({
        title: `Visita Técnica PROJECT 3D - ${estimation.client.nombre} (${estimation.referenceCode})`,
        description: `Visita técnica coordinada con PROJECT 3D (Torrijos, Toledo).\n\nProyecto: ${
          estimation.parameters.type === 'obra_nueva'
            ? 'Vivienda Adosada'
            : 'Reforma Integral'
        } (${estimation.parameters.superficieM2} m²)\nReferencia: ${
          estimation.referenceCode
        }\nCliente: ${estimation.client.nombre} ${
          estimation.client.apellidos
        }\nTeléfono: ${estimation.client.telefono}\nNotas: ${notes}`,
        location: resolvedLocation,
        startDateIso: startIso,
        endDateIso: endIso,
        clientEmail: estimation.client.email,
      });

      if (!res.success || !res.url) {
        throw new Error(res.error || 'Error al conectar con Google Calendar');
      }

      setScheduledUrl(res.url);

      // Guardar también en Firestore
      await saveTechnicalVisitToFirestore({
        id: `visit_${Date.now()}`,
        leadId: estimation.referenceCode,
        referenceCode: estimation.referenceCode,
        clientName: `${estimation.client.nombre} ${estimation.client.apellidos}`,
        clientPhone: estimation.client.telefono,
        visitDate: startIso,
        location: resolvedLocation,
        notes,
        calendarEventId: res.id,
        calendarEventLink: res.url,
        createdAt: new Date().toISOString(),
      });

      if (onSuccess) onSuccess(res.url);
    } catch (err: any) {
      setError(err.message || 'Error al agendar en Google Calendar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-stone-900 border-2 border-amber-500/70 rounded-3xl shadow-2xl overflow-hidden text-stone-100">
        
        {/* Header */}
        <div className="px-6 py-5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Agendar Visita Técnica
                </h3>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-bold">
                  Google Calendar
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Sincronización directa con el equipo técnico de Torrijos (Toledo)
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

        {scheduledUrl ? (
          /* Confirmation State */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-white">
                ¡Visita Agendada con Éxito!
              </h4>
              <p className="text-sm text-stone-300 max-w-md mx-auto">
                El evento se ha añadido a tu <strong>Google Calendar</strong> y registrado en la base de datos de <strong>PROJECT 3D</strong>.
              </p>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-xs font-mono space-y-2 text-stone-300 text-left">
              <div><strong>Fecha y Hora:</strong> {date} a las {time}</div>
              <div><strong>Lugar:</strong> {locationType === 'sede' ? 'Vivero de Empresas de Torrijos' : address}</div>
              <div><strong>Referencia:</strong> {estimation.referenceCode}</div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href={scheduledUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow"
              >
                <span>Abrir en Google Calendar</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={onClose}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-5 py-2.5 rounded-xl text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSchedule} className="p-6 space-y-4 text-xs font-mono">
            {error && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-400 mb-1">FECHA PREFERIDA</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-100 focus:border-amber-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">HORA</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-100 focus:border-amber-500 outline-hidden"
                >
                  <option value="09:00">09:00 - Mañana</option>
                  <option value="10:00">10:00 - Mañana</option>
                  <option value="11:30">11:30 - Mañana</option>
                  <option value="13:00">13:00 - Mediodía</option>
                  <option value="16:00">16:00 - Tarde</option>
                  <option value="17:30">17:30 - Tarde</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-stone-400 mb-1">MODALIDAD DE REUNIÓN</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLocationType('parcela')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2 transition-colors ${
                    locationType === 'parcela'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>En mi parcela / inmueble</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLocationType('sede')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2 transition-colors ${
                    locationType === 'sede'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <Building className="w-4 h-4 shrink-0" />
                  <span>En el Vivero de Torrijos</span>
                </button>
              </div>
            </div>

            {locationType === 'parcela' && (
              <div>
                <label className="block text-stone-400 mb-1">DIRECCIÓN O LOCALIDAD DE LA OBRA</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej: Calle Mayor 12, Torrijos (Toledo)"
                  required
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-stone-100 focus:border-amber-500 outline-hidden"
                />
              </div>
            )}

            <div>
              <label className="block text-stone-400 mb-1">NOTAS PARA EL APAREJADOR / ARQUITECTO</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-amber-500 outline-hidden"
              />
            </div>

            <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
              <span className="text-[11px] text-stone-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Confirmación instantánea</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Sincronizando...</span>
                  ) : (
                    <>
                      <span>Crear Evento en Google Calendar</span>
                      <Calendar className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

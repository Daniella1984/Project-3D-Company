import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ShieldAlert,
  MapPin,
  Phone,
  ArrowRight,
  Bot,
  User,
  CheckCircle2,
  Lock,
  Layers,
  FileText,
} from 'lucide-react';

interface ChatbotWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenEstimator: () => void;
  onRequestContactCall?: (data: { nombre: string; telefono: string }) => void;
  onOpenVideoModal?: () => void;
}

const MANDATORY_SAFETY_RESPONSE =
  'Para darte una respuesta precisa y segura, necesitamos que un profesional de PROJECT 3D revise tu proyecto.';

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  isOpen,
  onToggle,
  onOpenEstimator,
  onRequestContactCall,
  onOpenVideoModal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'agent',
      text: '¡Hola! Soy el Agente de PROJECT 3D, tu anfitrión técnico desde nuestra sede en el Vivero de Empresas de Torrijos (Toledo, España). ¿En qué podemos ayudarte hoy con tu vivienda adosada o reforma integral?',
      timestamp: 'Ahora',
      quickActions: [
        { label: '¿Cómo funciona FASE A Gratis vs FASE B Pago?', action: 'dos_fases' },
        { label: 'Ver video 3D de casa adosada', action: 'ver_video' },
        { label: '¿Cómo preparo y subo mi archivo STL?', action: 'subir_stl' },
        { label: '¿Por qué aplicáis un 15% de margen?', action: 'margen_15' },
        { label: '¿Me dais un precio cerrado directo ya?', action: 'precio_cerrado' },
      ],
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadMiniForm, setShowLeadMiniForm] = useState(false);
  const [miniName, setMiniName] = useState('');
  const [miniPhone, setMiniPhone] = useState('');
  const [miniRgpd, setMiniRgpd] = useState(true);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Detector estricto de solicitud de precio cerrado, definitivo o vinculante
  const isRequestingFixedContractPrice = (text: string): boolean => {
    const lower = text.toLowerCase();
    const triggers = [
      'precio cerrado',
      'contrato directo',
      'precio final ya',
      'precio vinculante',
      'cuanto me cobras cerrado',
      'presupuesto vinculante',
      'precio exacto sin visita',
      'dame el precio definitivo ya',
      'cerrar precio',
      'firmar contrato directo',
      'precio fijo',
      'coste cerrado',
      'compromiso de precio cerrado',
      'dime el precio final exacto',
    ];
    return triggers.some((t) => lower.includes(t));
  };

  // Detector de consultas técnicas complejas (cálculo de forjados, geotécnicos, recalces, etc.)
  const isComplexTechnicalQuery = (text: string): boolean => {
    const lower = text.toLowerCase();
    const complexTriggers = [
      'estudio geotecnico',
      'viga maestra',
      'recalce de cimentacion',
      'patologia estructural',
      'capacidad portante',
      'muro de contencion',
      'forjado unidireccional flecha',
      'armadura de losa',
      'vicios ocultos',
    ];
    return complexTriggers.some((t) => lower.includes(t));
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Ahora',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let isWarning = false;
      let quickActions: { label: string; action: string }[] | undefined;

      // REGLA DE ORO ESTRICTA: NUNCA PRECIO CERRADO POR CHAT
      if (isRequestingFixedContractPrice(query)) {
        replyText = `${MANDATORY_SAFETY_RESPONSE}\n\nEn construcción y reformas residenciales cada parcela e inmueble presenta particularidades determinantes (geotecnia, acometidas, estado de forjados y planeamiento municipal de Torrijos o comarca) que hacen temerario fijar un precio contractual por chat sin inspección física colegiada.\n\nTe invitamos a calcular primero tu Estimación Gratuita de Nivel 1 y, si lo deseas, concertar la visita técnica presencial de un aparejador de PROJECT 3D sin coste.`;
        isWarning = true;
        quickActions = [
          { label: 'Calcular Nivel 1 Gratuito ahora', action: 'abrir_estimador' },
          { label: 'Solicitar visita técnica in situ', action: 'solicitar_visita' },
        ];
      } else if (isComplexTechnicalQuery(query)) {
        replyText = `${MANDATORY_SAFETY_RESPONSE}\n\nLas cuestiones relativas a cálculo de estructuras, patologías o geotécnicos requieren el examen pericial de nuestros arquitectos técnicos en Torrijos. Por favor, facilítanos tus datos y te contactará el responsable de proyectos para estudiar la documentación técnica.`;
        isWarning = true;
        setShowLeadMiniForm(true);
      } else if (query.includes('dos_fases') || query.toLowerCase().includes('dos fases') || query.toLowerCase().includes('nivel 1') || query.toLowerCase().includes('nivel 2')) {
        replyText =
          'En PROJECT 3D operamos con un Modelo Comercial Transparente de Dos Fases:\n\n• Nivel 1 (Estimación Inicial Gratuita): Sube tu archivo STL o introduce tus m² y recibe al instante un presupuesto orientativo global aplicando nuestro margen de seguridad del 15% para que tengas una referencia real de mercado.\n\n• Nivel 2 (Estudio Técnico Avanzado de Pago): Para promotores que quieren el desglose milimétrico por capítulos (cimentación, estructura, instalaciones REBT, aerotermia, carpinterías) visado por técnicos colegiados. Tiene un coste variable según los m² del proyecto (base de 180 € + 1.80 €/m² adicional), 100% deducible si contratas la obra con nosotros.';
        quickActions = [
          { label: 'Iniciar Nivel 1 Gratuito', action: 'abrir_estimador' },
          { label: '¿Cómo preparo el STL?', action: 'subir_stl' },
        ];
      } else if (query.includes('subir_stl') || query.toLowerCase().includes('stl') || query.toLowerCase().includes('archivo 3d') || query.toLowerCase().includes('preparo mi')) {
        replyText =
          '¡Preparar tu STL es muy sencillo! Sigue estos sencillos consejos:\n\n1. Software compatible: Puedes exportar en formato .STL u .OBJ desde Revit, AutoCAD, SketchUp, ArchiCAD, Blender o un escáner 3D de obra.\n2. Escala recomendada: Exporta en escala métrica (milímetros o metros).\n3. Malla cerrada (Watertight): Asegúrate de que los volúmenes exteriores formen una malla sólida.\n\nSi no tienes archivo STL todavía, ¡no te preocupes! Puedes indicar los metros cuadrados (m²) manualmente en nuestro estimador o enviarnos un plano en PDF para que te lo modelemos en Torrijos.';
        quickActions = [
          { label: 'Ir al visor STL del estimador', action: 'abrir_estimador_stl' },
          { label: 'No tengo STL, usar metros', action: 'sin_stl' },
        ];
      } else if (query.includes('margen_15') || query.toLowerCase().includes('15%') || query.toLowerCase().includes('seguridad')) {
        replyText =
          'El margen del 15% es nuestro sello de honestidad radical. En el sector suele presentarse un precio inicial artificialmente bajo que después en obra sube un 25-40% por "imprevistos".\n\nEn PROJECT 3D dotamos a cada proyecto de un fondo de contingencia técnico del 15% para cubrir fluctuaciones de materiales y cimentación. Si la obra transcurre sin contingencias, ese ahorro revierte íntegramente al cliente.';
        quickActions = [
          { label: 'Calcular mi proyecto con margen 15%', action: 'abrir_estimador' },
        ];
      } else if (query.includes('sin_stl') || query.toLowerCase().includes('no tengo stl')) {
        replyText =
          'No es ningún problema. Nuestro estimador dispone de un campo manual para fijar directamente la superficie en metros cuadrados (m²), número de plantas y calidades. Además, en nuestra oficina de Torrijos podemos digitalizar tus planos en papel o PDF sin coste añadido.';
        quickActions = [
          { label: 'Entrar al estimador manual', action: 'abrir_estimador' },
        ];
      } else if (query.includes('solicitar_visita') || query.toLowerCase().includes('visita') || query.toLowerCase().includes('llamadme') || query.toLowerCase().includes('contacto')) {
        replyText =
          'Estaremos encantados de atenderte en persona o coordinar una visita técnica a tu parcela o inmueble en Torrijos, Toledo o Madrid. Déjanos tu teléfono a continuación y te llamará un arquitecto técnico hoy mismo:';
        setShowLeadMiniForm(true);
      } else {
        replyText =
          'Comprendo perfectamente tu consulta. En PROJECT 3D combinamos tecnología de modelado 3D con más de 20 años de experiencia constructora en la zona de Torrijos y Toledo. Te acompañamos desde la primera estimación gratuita hasta la entrega de llaves.';
        quickActions = [
          { label: 'Calcular Estimación Gratuita Nivel 1', action: 'abrir_estimador' },
          { label: 'Conocer el Estudio de Nivel 2', action: 'dos_fases' },
          { label: 'Solicitar llamada de un técnico', action: 'solicitar_visita' },
        ];
      }

      const agentMsg: ChatMessage = {
        id: `agent_${Date.now()}`,
        sender: 'agent',
        text: replyText,
        timestamp: 'Ahora',
        isWarning,
        quickActions,
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'precio_cerrado') {
      handleSendMessage('¿Podéis darme un precio cerrado y contrato directo ya mismo?');
    } else if (action === 'dos_fases') {
      handleSendMessage('¿Cómo funciona el modelo de dos fases comerciales (Gratis vs Pago)?');
    } else if (action === 'ver_video') {
      if (onOpenVideoModal) {
        onOpenVideoModal();
      } else {
        handleSendMessage('Quiero ver el video de la casa 3D');
      }
    } else if (action === 'subir_stl') {
      handleSendMessage('¿Cómo preparo y subo mi archivo STL?');
    } else if (action === 'margen_15') {
      handleSendMessage('¿Por qué aplicáis un 15% de margen de seguridad?');
    } else if (action === 'abrir_estimador' || action === 'abrir_estimador_stl') {
      onOpenEstimator();
    } else if (action === 'solicitar_visita') {
      setShowLeadMiniForm(true);
    } else if (action === 'sin_stl') {
      handleSendMessage('No dispongo de archivo STL de momento');
    }
  };

  const handleMiniLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!miniPhone.trim()) return;

    if (onRequestContactCall) {
      onRequestContactCall({ nombre: miniName || 'Cliente Chat', telefono: miniPhone });
    }

    setLeadSubmitted(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `agent_lead_${Date.now()}`,
        sender: 'agent',
        text: `¡Muchas gracias ${miniName ? miniName : ''}! Teléfono registrado (${miniPhone}) bajo protocolo RGPD. Un técnico colegiado de nuestra oficina en el Vivero de Empresas de Torrijos te llamará en menos de 24 horas laborables.`,
        timestamp: 'Ahora',
      },
    ]);
  };

  return (
    <>
      {/* Floating launcher trigger button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-stone-900 text-stone-200 px-3.5 py-2 rounded-xl border border-stone-800 shadow-xl text-xs font-medium animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Asistente Técnico PROJECT 3D</span>
          </div>

          <button
            onClick={onToggle}
            className="w-14 h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shadow-2xl shadow-amber-500/40 transition-transform hover:scale-105 active:scale-95 group relative"
            aria-label="Abrir Asistente PROJECT 3D"
          >
            <Bot className="w-7 h-7 text-stone-950 transition-transform group-hover:rotate-6" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-stone-900 rounded-full" />
          </button>
        </div>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[620px] h-[580px] bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Chat Header */}
          <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold relative">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-stone-950 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">Agente PROJECT 3D</h4>
                  <span className="text-[9px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-semibold">
                    Torrijos
                  </span>
                </div>
                <div className="text-[11px] text-stone-400 flex items-center gap-1">
                  <span>En línea</span>
                  <span>·</span>
                  <span>Vivero de Empresas (Toledo)</span>
                </div>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              aria-label="Cerrar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-900/90 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-xs'
                      : msg.isWarning
                      ? 'bg-amber-950/70 text-amber-100 border border-amber-500 rounded-tl-xs shadow-md'
                      : 'bg-stone-950 text-stone-200 border border-stone-800 rounded-tl-xs'
                  }`}
                >
                  {msg.isWarning && (
                    <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-[10px] mb-2 uppercase">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      Regla de Oro: Seguridad Técnica
                    </div>
                  )}
                  {msg.text}
                </div>

                {/* Quick actions buttons */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                    {msg.quickActions.map((qa, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleQuickAction(qa.action)}
                        className="text-[11px] bg-stone-950 hover:bg-stone-800 text-amber-400 hover:text-amber-300 border border-stone-800 hover:border-amber-500/40 px-2.5 py-1.5 rounded-lg transition-colors text-left"
                      >
                        {qa.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-stone-400 bg-stone-950 px-3 py-2 rounded-xl border border-stone-800 self-start">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
                </div>
                <span className="text-[10px] font-mono text-stone-400">Consultando con oficina técnica...</span>
              </div>
            )}

            {/* Mini Lead Capture Form with RGPD checkbox */}
            {showLeadMiniForm && !leadSubmitted && (
              <form
                onSubmit={handleMiniLeadSubmit}
                className="bg-stone-950 p-3.5 rounded-2xl border border-amber-500/50 space-y-2.5 mt-2"
              >
                <div className="text-[11px] font-mono text-amber-400 font-semibold flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Solicitud de llamada de Arquitecto Técnico (Torrijos):
                </div>
                <input
                  type="text"
                  placeholder="Tu Nombre"
                  value={miniName}
                  onChange={(e) => setMiniName(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-100 placeholder:text-stone-500"
                />
                <input
                  type="tel"
                  placeholder="Teléfono móvil (+34) *"
                  value={miniPhone}
                  onChange={(e) => setMiniPhone(e.target.value)}
                  required
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-100 placeholder:text-stone-500"
                />
                <label className="flex items-start gap-2 text-[10px] text-stone-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={miniRgpd}
                    onChange={(e) => setMiniRgpd(e.target.checked)}
                    required
                    className="mt-0.5 w-3.5 h-3.5 rounded border-stone-700 bg-stone-900 text-amber-500"
                  />
                  <span>Acepto la política RGPD para contacto técnico de PROJECT 3D.</span>
                </label>
                <button
                  type="submit"
                  disabled={!miniRgpd}
                  className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold py-2 rounded-lg text-xs transition-colors"
                >
                  Solicitar llamada profesional
                </button>
              </form>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="px-3 py-2 bg-stone-950/80 border-t border-stone-800 flex items-center justify-between text-[11px] font-mono text-stone-400">
            <button
              onClick={onOpenEstimator}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Abrir Estimador (Nivel 1 & 2)</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-stone-600">|</span>
            <span className="text-stone-400">Torrijos (Toledo)</span>
          </div>

          {/* Message Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-stone-950 border-t border-stone-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Consulta sobre Nivel 1, Nivel 2 o tu archivo STL..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-stone-950 flex items-center justify-center transition-colors shrink-0 font-bold"
              aria-label="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};

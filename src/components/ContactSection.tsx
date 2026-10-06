import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Building, ShieldCheck } from 'lucide-react';

interface ContactSectionProps {
  onContactSubmitted: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onContactSubmitted }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    tipoProyecto: 'Vivienda Adosada',
    mensaje: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.telefono.trim()) return;
    setSubmitted(true);
    onContactSubmitted();
  };

  return (
    <section id="contacto" className="py-20 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-mono text-amber-500 uppercase tracking-widest flex items-center gap-2">
            <Building className="w-4 h-4" />
            <span>Atención Directa & Sede</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Visítanos en el Vivero de Empresas de Torrijos (Toledo)
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            Nuestro equipo técnico está a tu disposición para revisar planos en persona, examinar archivos STL y orientarte sobre los permisos de obra en Castilla-La Mancha y Madrid.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Info & Location Card */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-stone-400 uppercase font-semibold">
                      Dirección Física
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      Vivero de Empresas de Torrijos
                    </div>
                    <div className="text-xs text-stone-400">
                      Ctra. de Toledo / Pol. Valdelacasa, 45500 Torrijos (Toledo, España)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-stone-400 uppercase font-semibold">
                      Teléfono Técnico Directo
                    </div>
                    <a
                      href="tel:+34925770033"
                      className="text-sm font-bold text-amber-400 hover:underline mt-0.5 block font-mono"
                    >
                      +34 925 77 00 33
                    </a>
                    <div className="text-xs text-stone-500">
                      Lunes a Viernes: 08:30 - 19:30 h
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-stone-400 uppercase font-semibold">
                      Correo Electrónico
                    </div>
                    <a
                      href="mailto:oficina@project3d.es"
                      className="text-sm font-bold text-stone-200 hover:text-white mt-0.5 block font-mono"
                    >
                      oficina@project3d.es
                    </a>
                    <div className="text-xs text-stone-500">
                      Recepción de archivos STL y memorias
                    </div>
                  </div>
                </div>
              </div>

              {/* Area of intervention */}
              <div className="pt-4 border-t border-stone-800 text-xs text-stone-400 space-y-1.5">
                <div className="font-mono text-stone-300 font-semibold uppercase">
                  Área de Actuación Directa:
                </div>
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-amber-400">
                  <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800">Torrijos</span>
                  <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800">Toledo Capital</span>
                  <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800">Fuensalida</span>
                  <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800">Illescas</span>
                  <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800">Talavera</span>
                  <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800">Madrid Sur</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-stone-950 p-8 rounded-3xl border border-stone-800">
              <h3 className="text-xl font-bold text-white mb-2">
                Envíanos tu consulta sobre parcelas, adosados o reformas
              </h3>
              <p className="text-stone-400 text-xs mb-6">
                Te responderá directamente un técnico asignado en menos de 24 horas laborables.
              </p>

              {submitted ? (
                <div className="p-6 bg-emerald-950/30 border border-emerald-500/50 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <div className="font-bold text-white text-base">¡Mensaje Enviado con Éxito!</div>
                  <p className="text-xs text-stone-300">
                    Gracias por contactar con PROJECT 3D en Torrijos. Te llamaremos en breve al teléfono indicado.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-stone-300">Nombre completo *</label>
                      <input
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Ej. Roberto Sánchez"
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-stone-300">Teléfono móvil *</label>
                      <input
                        type="tel"
                        required
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        placeholder="Ej. 600 12 34 56"
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-stone-300">Correo Electrónico</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Ej. roberto@gmail.com"
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-stone-300">Tipo de Proyecto</label>
                      <select
                        value={formData.tipoProyecto}
                        onChange={(e) => setFormData({ ...formData, tipoProyecto: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-stone-100 focus:outline-none"
                      >
                        <option value="Vivienda Adosada">Obra Nueva (Vivienda Adosada)</option>
                        <option value="Reforma Integral">Reforma Integral de Vivienda</option>
                        <option value="Consulta STL">Análisis de Archivo 3D / STL</option>
                        <option value="Visita Parcela">Visita Técnica en Parcela</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-stone-300">Detalles o consulta específica</label>
                    <textarea
                      rows={3}
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      placeholder="Indica la ubicación de tu parcela o vivienda, metros aproximados y cualquier duda..."
                      className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none resize-none"
                    />
                  </div>

                  {/* RGPD Explicit Opt-In */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-stone-400">
                      <input
                        type="checkbox"
                        required
                        defaultChecked
                        className="mt-0.5 w-4 h-4 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-amber-500 shrink-0"
                      />
                      <span>
                        Acepto la <strong className="text-stone-300">política de privacidad (RGPD)</strong> y el protocolo de custodia confidencial para la atención técnica de mi consulta por PROJECT 3D en Torrijos (Toledo).
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Consulta a la Oficina de Torrijos</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

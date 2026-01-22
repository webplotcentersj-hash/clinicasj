"use client";

import React, { useEffect, useRef, useState } from "react";

// Tipos para Speech Recognition API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}
import {
  Activity,
  ArrowRight,
  Bot,
  Calendar,
  FileText,
  Heart,
  MapPin,
  Menu,
  MessageSquare,
  Mic,
  Navigation,
  PlayCircle,
  Newspaper,
  Phone,
  Send,
  Stethoscope,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

function TurnosModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [turnosDisponibles, setTurnosDisponibles] = useState<Array<{ hora: string; disponible: boolean }>>([]);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<{
    nombre: string;
    apellido: string;
    especialidad: string;
    foto: string;
    matricula: string;
  } | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
    especialidad: "",
    fechaPreferida: "",
    franja: "indistinto" as "mañana" | "tarde" | "indistinto",
    comentario: "",
  });

  // Simular doctores por especialidad
  const getDoctorForSpecialty = (especialidad: string) => {
    const doctors: Record<string, { nombre: string; apellido: string; especialidad: string; foto: string; matricula: string }> = {
      "Cardiología": {
        nombre: "Carlos",
        apellido: "Rodríguez",
        especialidad: "Cardiología",
        foto: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
        matricula: "MP 12345",
      },
      "Pediatría": {
        nombre: "María",
        apellido: "González",
        especialidad: "Pediatría",
        foto: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
        matricula: "MP 23456",
      },
      "Traumatología": {
        nombre: "Juan",
        apellido: "Martínez",
        especialidad: "Traumatología",
        foto: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop",
        matricula: "MP 34567",
      },
      "Ginecología": {
        nombre: "Ana",
        apellido: "López",
        especialidad: "Ginecología",
        foto: "https://images.unsplash.com/photo-1594824476966-48cb8cbc905b?w=400&h=400&fit=crop",
        matricula: "MP 45678",
      },
    };
  return (
      doctors[especialidad] || {
        nombre: "Dr.",
        apellido: "Profesional",
        especialidad: especialidad,
        foto: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop",
        matricula: "MP 00000",
      }
    );
  };

  // Generar turnos disponibles de ejemplo cuando se selecciona especialidad y fecha
  useEffect(() => {
    if (form.especialidad && form.fechaPreferida) {
      const turnos = [
        { hora: "08:00", disponible: true },
        { hora: "08:30", disponible: true },
        { hora: "09:00", disponible: false },
        { hora: "09:30", disponible: true },
        { hora: "10:00", disponible: true },
        { hora: "10:30", disponible: false },
        { hora: "11:00", disponible: true },
        { hora: "11:30", disponible: true },
        { hora: "14:00", disponible: true },
        { hora: "14:30", disponible: false },
        { hora: "15:00", disponible: true },
        { hora: "15:30", disponible: true },
        { hora: "16:00", disponible: true },
        { hora: "16:30", disponible: false },
        { hora: "17:00", disponible: true },
        { hora: "17:30", disponible: true },
      ];
      setTurnosDisponibles(turnos);
    } else {
      setTurnosDisponibles([]);
    }
  }, [form.especialidad, form.fechaPreferida]);

  useEffect(() => {
    if (!isOpen) return;
    setStatus("idle");
    setError(null);
  }, [isOpen]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setStatus("error");
        setError(body?.error ?? "No se pudo enviar el turno. Revisá los datos.");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setError("Error de red. Probá de nuevo.");
    }
  };

  const onChange =
    (key: keyof typeof form) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>,
    ) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal del Doctor */}
      {showDoctorModal && selectedDoctor && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDoctorModal(false)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="relative h-48 bg-gradient-to-br from-[#447FC1] to-[#9FCD5A]">
              <button
                onClick={() => setShowDoctorModal(false)}
                className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/30"
                type="button"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedDoctor.foto} alt={`${selectedDoctor.nombre} ${selectedDoctor.apellido}`} className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
            <div className="mt-16 space-y-4 p-6 pb-8 text-center">
              <div>
                <h3 className="text-2xl font-extrabold text-[#727376]">
                  {selectedDoctor.nombre} {selectedDoctor.apellido}
                </h3>
                <p className="mt-1 text-sm font-semibold text-[#447FC1]">{selectedDoctor.especialidad}</p>
                <p className="mt-1 text-xs text-gray-500">{selectedDoctor.matricula}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-600">
                  Profesional disponible para atención en <strong>{form.especialidad}</strong>
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowDoctorModal(false);
                    // Aquí podrías pre-seleccionar el turno si quisieras
                  }}
                  className="w-full rounded-full bg-[#9FCD5A] px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#8ec049] hover:shadow-green-400/50"
                  type="button"
                >
                  Confirmar turno con este profesional
                </button>
                <button
                  onClick={() => setShowDoctorModal(false)}
                  className="w-full rounded-full border-2 border-[#447FC1] bg-white px-6 py-3 text-base font-bold text-[#447FC1] transition-all hover:bg-[#447FC1] hover:text-white"
                  type="button"
                >
                  Ver otros horarios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Turnos */}
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="relative border-b border-gray-100 bg-white p-6">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200"
            type="button"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
          <div className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ssj-logo-header.png"
              alt="Sanatorio San Juan Logo"
              className="h-12 w-auto object-contain"
            />
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-[#447FC1]">Turnos</p>
              <h3 className="mt-1 text-lg font-extrabold text-[#727376]">Solicitar turno</h3>
            </div>
          </div>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-6">
          {status === "success" ? (
            <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#9FCD5A]/15 text-[#9FCD5A]">
                <Calendar size={28} />
              </div>
              <h4 className="text-2xl font-extrabold text-[#727376]">¡Solicitud enviada!</h4>
              <p className="mt-2 text-gray-500">
                Recibimos tu pedido. Un equipo se va a contactar para confirmar día y horario.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={onClose}
                  className="w-full rounded-full bg-[#9FCD5A] px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#8ec049] hover:shadow-green-400/50 sm:w-auto"
                  type="button"
                >
                  Listo
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-[#727376]">Nombre</label>
                  <input
                    value={form.nombre}
                    onChange={onChange("nombre")}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#447FC1] focus:ring-4 focus:ring-[#447FC1]/15"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-[#727376]">Apellido</label>
                  <input
                    value={form.apellido}
                    onChange={onChange("apellido")}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#447FC1] focus:ring-4 focus:ring-[#447FC1]/15"
                    placeholder="Tu apellido"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-[#727376]">Teléfono</label>
                  <input
                    value={form.telefono}
                    onChange={onChange("telefono")}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#447FC1] focus:ring-4 focus:ring-[#447FC1]/15"
                    placeholder="Ej: 264..."
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-[#727376]">Email (opcional)</label>
                  <input
                    value={form.email}
                    onChange={onChange("email")}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#447FC1] focus:ring-4 focus:ring-[#447FC1]/15"
                    placeholder="tu@email.com"
                    type="email"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-[#727376]">DNI</label>
                  <input
                    value={form.dni}
                    onChange={onChange("dni")}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#447FC1] focus:ring-4 focus:ring-[#447FC1]/15"
                    placeholder="Sin puntos"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-[#727376]">Especialidad</label>
                  <select
                    value={form.especialidad}
                    onChange={onChange("especialidad")}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#447FC1] focus:ring-4 focus:ring-[#447FC1]/15"
                    required
                  >
                    <option value="">Seleccionar especialidad</option>
                    {ESPECIALIDADES.map((esp) => (
                      <option key={esp} value={esp}>
                        {esp}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-[#727376]">Fecha preferida</label>
                  <input
                    value={form.fechaPreferida}
                    onChange={onChange("fechaPreferida")}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#447FC1] focus:ring-4 focus:ring-[#447FC1]/15"
                    type="date"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-[#727376]">Franja</label>
                  <select
                    value={form.franja}
                    onChange={onChange("franja")}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#447FC1] focus:ring-4 focus:ring-[#447FC1]/15"
                  >
                    <option value="indistinto">Indistinto</option>
                    <option value="mañana">Mañana</option>
                    <option value="tarde">Tarde</option>
                  </select>
                </div>
              </div>

              {/* Turnos disponibles */}
              {turnosDisponibles.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                  <p className="mb-4 text-sm font-bold text-[#727376]">Turnos disponibles para {form.especialidad}</p>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                    {turnosDisponibles.map((turno, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (turno.disponible) {
                            const doctor = getDoctorForSpecialty(form.especialidad);
                            setSelectedDoctor(doctor);
                            setShowDoctorModal(true);
                          }
                        }}
                        disabled={!turno.disponible}
                        className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                          turno.disponible
                            ? "bg-white text-[#447FC1] shadow-sm hover:bg-[#447FC1] hover:text-white hover:shadow-md"
                            : "cursor-not-allowed bg-gray-200 text-gray-400 line-through"
                        }`}
                      >
                        {turno.hora}
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-gray-500">
                    Seleccioná un horario disponible o continuá con tu fecha preferida
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-bold text-[#727376]">Comentario (opcional)</label>
                <textarea
                  value={form.comentario}
                  onChange={onChange("comentario")}
                  className="mt-2 min-h-[110px] w-full resize-y rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#447FC1] focus:ring-4 focus:ring-[#447FC1]/15"
                  placeholder="Motivo de consulta, preferencia de profesional, etc."
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={onClose}
                  className="rounded-full border-2 border-[#447FC1] bg-white px-8 py-4 text-lg font-bold text-[#447FC1] transition-all hover:-translate-y-1 hover:bg-[#447FC1] hover:text-white"
                  type="button"
                  disabled={status === "submitting"}
                >
                  Cancelar
                </button>
                <button
                  className="rounded-full bg-[#9FCD5A] px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#8ec049] hover:shadow-green-400/50 disabled:cursor-not-allowed disabled:opacity-70"
                  type="submit"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Enviando..." : "Enviar solicitud"}
                </button>
              </div>
            </form>
          )}
          </div>
          </div>
        </div>
      )}
    </>
  );
}

const COLORS = {
  green: "#9FCD5A",
  blue: "#447FC1",
  gray: "#727376",
  white: "#ffffff",
} as const;

const ESPECIALIDADES = [
  "Ecografía General",
  "Neurocirugía",
  "Gastroenterología",
  "Urología",
  "Nefrología",
  "Diabetología",
  "Nutrición",
  "Cardiología",
  "Eco Doppler Color",
  "Fisio Kinesiología",
  "Cirugía General",
  "Obesidad",
  "Educación Física Adaptada a la Salud",
  "Pediatría",
  "Clínica Médica",
  "Medicina del Trabajo",
  "Traumatología",
  "Ginecología",
  "Psicología",
] as const;

const ESPECIALIDADES_DETALLE: Record<(typeof ESPECIALIDADES)[number], string> = {
  "Ecografía General": "Diagnóstico por imágenes no invasivo para evaluar órganos y tejidos.",
  Neurocirugía: "Atención especializada de patologías del sistema nervioso central y periférico.",
  Gastroenterología: "Diagnóstico y tratamiento de enfermedades del aparato digestivo.",
  Urología: "Prevención, diagnóstico y tratamiento del aparato urinario y reproductor masculino.",
  Nefrología: "Cuidado integral de la salud renal y control de enfermedades crónicas.",
  Diabetología: "Seguimiento y control de diabetes con enfoque integral y preventivo.",
  Nutrición: "Planes personalizados para salud, rendimiento y patologías específicas.",
  Cardiología: "Evaluación cardiovascular, prevención y tratamientos de alta complejidad.",
  "Eco Doppler Color": "Estudio vascular y cardíaco con tecnología Doppler para mayor precisión.",
  "Fisio Kinesiología": "Rehabilitación y recuperación funcional con profesionales especializados.",
  "Cirugía General": "Cirugías programadas y de urgencia con equipo quirúrgico experimentado.",
  Obesidad: "Abordaje interdisciplinario para el tratamiento integral de la obesidad.",
  "Educación Física Adaptada a la Salud": "Actividad física guiada, segura y personalizada según condición.",
  Pediatría: "Atención médica integral para niños y adolescentes.",
  "Clínica Médica": "Consultas y seguimiento general con enfoque preventivo y clínico.",
  "Medicina del Trabajo": "Controles laborales, aptitud y prevención en salud ocupacional.",
  Traumatología: "Diagnóstico y tratamiento de lesiones óseas, musculares y articulares.",
  Ginecología: "Salud integral de la mujer: controles, prevención y tratamientos.",
  Psicología: "Acompañamiento profesional para bienestar emocional y salud mental.",
};

function EspecialidadesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  if (!isOpen) return null;

  const normalized = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const q = normalized(query.trim());
  const items = ESPECIALIDADES.filter((e) => (q ? normalized(e).includes(q) : true));

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="relative border-b border-gray-100 bg-white p-6">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200"
            type="button"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center gap-3 text-center">
            <span className="rounded-full bg-[#447FC1]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#447FC1]">
              Especialidades
            </span>
            <h3 className="text-2xl font-extrabold text-[#727376] md:text-3xl">
              Encontrá la especialidad que necesitás
            </h3>
            <div className="mt-2 w-full max-w-md">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar (ej: cardio, pediatría, eco...)"
                className="w-full rounded-full border border-gray-200 bg-white px-5 py-3 text-sm outline-none focus:border-[#447FC1] focus:ring-4 focus:ring-[#447FC1]/15"
              />
            </div>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((esp) => (
              <div
                key={esp}
                className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#9FCD5A]/15 blur-2xl transition-opacity group-hover:opacity-80" />
                <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-[#447FC1]/15 blur-2xl transition-opacity group-hover:opacity-80" />

                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#447FC1] text-white shadow-sm">
                    <Stethoscope size={22} />
                  </div>
                  <div>
                    <h4 className="text-lg font-extrabold text-[#727376] group-hover:text-[#447FC1]">{esp}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{ESPECIALIDADES_DETALLE[esp]}</p>
                  </div>
                </div>

                <div className="relative mt-5 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#9FCD5A]">Disponible</span>
                  <a
                    href="#contacto"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#447FC1] transition-all hover:gap-3 hover:underline"
                  >
                    Consultar <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg font-bold text-[#727376]">No encontramos coincidencias.</p>
              <p className="mt-2 text-sm text-gray-500">Probá con otro término (ej: “eco”, “clínica”, “gine”).</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Base de conocimiento mejorada con respuestas más amigables y profesionales
const KNOWLEDGE_BASE = [
  {
    keywords: ["hola", "buen dia", "buenas", "inicio", "empezar"],
    response:
      "¡Hola! 👋 Es un placer saludarte. Soy el asistente virtual del Sanatorio San Juan y estoy aquí para ayudarte con toda la información que necesites. Puedo asistirte con turnos, horarios, especialidades, obras sociales y mucho más. ¿En qué puedo ayudarte hoy?",
  },
  {
    keywords: ["turno", "cita", "reservar", "sacar", "doctor", "agendar"],
    response:
      "¡Por supuesto! Te comento las opciones para solicitar tu turno: \n\n1. **Portal del Paciente** - La forma más rápida y sencilla (botón verde en la parte superior de la página). \n2. **Call Center** - Llámanos al **0800-SANJUAN** (7265) y nuestro equipo te ayudará con gusto. \n3. **WhatsApp** - Escríbenos al **264-1234567** para gestionar tu turno. \n\n¿Te gustaría que te guíe en alguna de estas opciones?",
  },
  {
    keywords: [
      "especialidad",
      "medico",
      "cardiologia",
      "pediatria",
      "clinica",
      "servicios",
      "traumatologia",
      "especialidades",
    ],
    response:
      "Excelente pregunta. En el Sanatorio San Juan contamos con más de **50 especialidades médicas** para brindarte la mejor atención. Entre ellas destacamos: Cardiología, Pediatría, Obstetricia, Traumatología, Neurología, Cirugía General, Ginecología, Urología, Gastroenterología y muchas más. \n\nAdemás, disponemos de un servicio de **Diagnóstico por Imágenes** de alta complejidad con tecnología de última generación. ¿Hay alguna especialidad en particular que te interese?",
  },
  {
    keywords: ["ubicacion", "donde", "llegar", "direccion", "calle", "mapa", "dirección"],
    response:
      "Con mucho gusto te indico nuestra ubicación. Nuestra **Sede Central** se encuentra en **Gral. Juan Lavalle 735, J5400 San Juan**. \n\nPara tu comodidad, contamos con **estacionamiento exclusivo** para pacientes por calle lateral. Si necesitas ver el mapa o indicaciones detalladas, puedes usar el botón **'Cómo Llegar'** en la portada de nuestra página web. ¿Te gustaría que te proporcione más información sobre cómo llegar?",
  },
  {
    keywords: ["guardia", "urgencia", "emergencia", "dolor", "urgencias"],
    response:
      "Nuestra **Guardia Médica funciona las 24 horas**, los 365 días del año, para estar siempre disponibles cuando nos necesites. Atendemos tanto urgencias de **Adultos** como **Pediátricas** con un equipo médico altamente capacitado. \n\n⚠️ **Importante:** Si estás experimentando una emergencia de riesgo de vida, por favor llama inmediatamente al **107** o acude directamente a nuestra guardia. Tu salud es nuestra prioridad.",
  },
  {
    keywords: ["obra social", "prepaga", "cobertura", "osde", "swiss", "provincia", "pami", "obra"],
    response:
      "Trabajamos con las principales obras sociales y prepagas del país para facilitar tu acceso a nuestros servicios. Entre ellas se encuentran: Obra Social Provincia, OSDE, Swiss Medical, Galeno, Sancor Salud, PAMI y muchas otras. \n\nPara consultar si tu obra social o prepaga tiene cobertura con nosotros, o para obtener información específica sobre tu plan, te recomiendo contactar a nuestro departamento de administración al **0264-4222222**. Ellos te brindarán toda la información detallada. ¿Te gustaría que te ayude con algo más?",
  },
  {
    keywords: ["horario", "atencion", "abierto", "hora", "horarios"],
    response:
      "Te comparto nuestros horarios de atención para que puedas planificar tu visita: \n\n• **Guardia:** 24 horas, todos los días \n• **Laboratorio:** Lunes a Viernes de 7:00 a 20:00 hs \n• **Consultorios Externos:** Lunes a Viernes de 8:00 a 21:00 hs \n• **Visitas a Internación:** Todos los días de 11:00 a 13:00 hs y de 17:00 a 19:00 hs \n\n¿Necesitas información sobre algún servicio en particular?",
  },
  {
    keywords: ["laboratorio", "analisis", "sangre", "resultados", "estudios"],
    response:
      "Nuestro laboratorio atiende por orden de llegada de **7:00 a 10:00 hs** para las extracciones. La buena noticia es que puedes descargar tus resultados directamente desde nuestra página web en la sección **'Resultados Online'**, sin necesidad de venir personalmente a buscarlos. \n\nEsto te ahorra tiempo y te permite acceder a tus estudios desde la comodidad de tu hogar. ¿Hay algo más en lo que pueda ayudarte?",
  },
  {
    keywords: ["telefono", "contacto", "llamar", "numero", "whatsapp", "teléfono"],
    response:
      "Estamos aquí para ayudarte. Puedes contactarnos a través de cualquiera de estos canales: \n\n• **Teléfono gratuito:** 0800-SANJUAN (7265) \n• **WhatsApp para Turnos:** 264-1234567 \n• **Conmutador:** 0264-4222222 \n• **Email:** info@sanatoriosanjuan.com \n\nNuestro equipo está disponible para responder todas tus consultas. ¿En qué más puedo asistirte?",
  },
  {
    keywords: ["tecnologia", "tomografo", "equipo", "resonancia", "tecnología", "equipos"],
    response:
      "Nos enorgullece contar con tecnología médica de vanguardia. Contamos con el **tomógrafo Philips Brilliance de 64 cortes**, único en la región, que nos permite realizar diagnósticos cardíacos y cerebrales de altísima precisión en cuestión de segundos. \n\nAdemás, disponemos de **Resonancia Magnética** y **Ecografía 4D** para brindarte los mejores estudios diagnósticos. Nuestro compromiso es ofrecerte la mejor tecnología al servicio de tu salud. ¿Te gustaría conocer más sobre alguno de estos estudios?",
  },
] as const;

function findBestResponse(input: string) {
  const normalizedInput = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const match = KNOWLEDGE_BASE.find((item) =>
    item.keywords.some((keyword) => normalizedInput.includes(keyword)),
  );

  if (match) return match.response;

  return "Entiendo que consultas sobre algo específico. Aunque soy el asistente virtual y sé mucho sobre el sanatorio, esa pregunta puntual prefiero derivarla a un humano. ¿Te gustaría llamar a nuestra central de informes al 0800-SANJUAN?";
}

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Inicio", href: "#inicio" },
    { label: "Institucional", href: "#institucional" },
    { label: "Especialidades", href: "#especialidades" },
    { label: "Pacientes", href: "#pacientes" },
    { label: "Contacto", href: "#contacto" },
  ] as const;

  return (
    <header
      className={`fixed z-50 w-full transition-all duration-500 ease-in-out ${
        isScrolled ? "bg-white/95 py-3 shadow-lg backdrop-blur-md" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center transition-all duration-500">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ssj-logo-header.png"
            alt="Sanatorio San Juan Logo"
            className={`object-contain transition-all duration-500 ${isScrolled ? "h-12 sm:h-14 md:h-16 lg:h-18" : "h-14 sm:h-16 md:h-20 lg:h-24"}`}
          />
        </div>

        <nav className="hidden items-center space-x-4 md:space-x-6 lg:space-x-8 xl:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`group relative text-xs md:text-sm lg:text-base font-bold uppercase tracking-wide transition-colors ${
                isScrolled ? "text-[#727376] hover:text-[#447FC1]" : "text-white hover:text-[#9FCD5A] drop-shadow-md"
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${
                  isScrolled ? "bg-[#447FC1]" : "bg-[#9FCD5A]"
                }`}
              />
            </a>
          ))}
          <button
            className="flex items-center gap-2 rounded-full px-4 py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-3.5 text-sm md:text-base font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-green-500/30"
            style={{ backgroundColor: COLORS.green }}
            type="button"
          >
            <Calendar size={16} className="md:size-5" />
            <span className="hidden lg:inline">Portal Paciente</span>
            <span className="lg:hidden">Portal</span>
          </button>
        </nav>

        <button
          className="rounded-lg bg-white/20 p-2 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen((v) => !v)}
          type="button"
        >
          {mobileMenuOpen ? (
            <X size={32} color={isScrolled ? COLORS.blue : "white"} />
          ) : (
            <Menu size={32} color={isScrolled ? COLORS.blue : "white"} />
          )}
        </button>
        </div>

      {mobileMenuOpen && (
        <div className="absolute left-0 top-full flex w-full flex-col items-center space-y-6 border-t border-gray-100 bg-white/98 py-8 shadow-2xl backdrop-blur-xl md:hidden">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xl font-bold text-[#727376] hover:text-[#447FC1]"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <button
            className="w-4/5 rounded-full px-10 py-4 text-lg font-bold text-white shadow-lg"
            style={{ backgroundColor: COLORS.green }}
            type="button"
          >
            Portal Paciente
          </button>
        </div>
      )}
    </header>
  );
}

function LocationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="group relative h-36 overflow-hidden bg-gray-100">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-80 transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#447FC1]/90 to-[#447FC1]/20 mix-blend-multiply" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/40"
            type="button"
          >
            <X size={20} />
          </button>

          <div className="absolute bottom-5 left-6 z-10 text-white">
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded bg-[#9FCD5A] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Sede Central
              </span>
            </div>
            <h3 className="text-2xl font-bold drop-shadow-md">¿Cómo Llegar?</h3>
          </div>
        </div>

        <div className="space-y-6 bg-white p-8">
          <div className="flex items-start gap-5">
            <div className="shrink-0 rounded-2xl bg-[#9FCD5A]/10 p-4 text-[#9FCD5A]">
              <MapPin size={32} />
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-[#447FC1]">Ubicación</p>
              <p className="text-xl font-bold leading-tight text-[#727376]">Gral. Juan Lavalle 735</p>
              <p className="mt-1 text-sm text-gray-400">J5400 San Juan, Argentina</p>
            </div>
          </div>

          {/* Mapa embebido */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
            <iframe
              src="https://www.google.com/maps?q=Gral.+Juan+Lavalle+735,+J5400+San+Juan,+Argentina&output=embed"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
              title="Ubicacion Sanatorio San Juan - Gral. Juan Lavalle 735"
            />
        </div>

          <div className="space-y-3 border-t border-gray-100 pt-6">
          <a
              href="https://www.google.com/maps/search/?api=1&query=Gral.+Juan+Lavalle+735,+J5400+San+Juan,+Argentina"
            target="_blank"
            rel="noopener noreferrer"
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#447FC1] py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#3668a0] hover:shadow-[#447FC1]/30"
            >
              <Navigation className="transition-transform group-hover:rotate-12" size={20} />
              Abrir en Google Maps
            </a>
            <button
              onClick={onClose}
              className="w-full py-3 text-sm font-medium text-gray-400 transition-colors hover:text-[#727376]"
              type="button"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showTurnosModal, setShowTurnosModal] = useState(false);

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden" id="inicio">
      <LocationModal isOpen={showLocationModal} onClose={() => setShowLocationModal(false)} />
      <TurnosModal isOpen={showTurnosModal} onClose={() => setShowTurnosModal(false)} />

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-[#447FC1]/90 via-[#447FC1]/70 to-[#9FCD5A]/50 mix-blend-multiply" />
        <div className="absolute inset-0 z-10 bg-black/40" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="h-full w-full scale-105 object-cover"
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000"
          alt="Sanatorio San Juan Moderno"
        />
      </div>

      <div className="container relative z-20 mx-auto flex flex-col items-center px-4 pt-16 text-center sm:px-6 sm:pt-20 md:items-start md:text-left lg:px-8 lg:pt-24">

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md sm:mb-6 sm:px-4 sm:py-2 sm:text-sm lg:px-5 lg:py-2.5 lg:text-base">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#9FCD5A]" />
          Líderes en Innovación Médica
        </div>

        <h1 className="mb-4 text-4xl font-extrabold leading-[1.1] text-white drop-shadow-xl sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
          Tu Salud <br />
          <span className="bg-gradient-to-r from-white via-[#9FCD5A] to-white bg-clip-text text-transparent drop-shadow-lg">
            Nuestra Prioridad
          </span>
        </h1>

        <p className="mb-8 max-w-2xl text-base font-light leading-relaxed text-gray-50 drop-shadow-md sm:mb-10 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
          Tecnología de última generación y calidez humana se unen para brindarte la mejor atención médica de la región.
        </p>

        <div className="flex w-full flex-col items-center gap-3 sm:gap-4 md:w-auto md:flex-row lg:gap-5">
          <button
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#9FCD5A] px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#8ec049] hover:shadow-green-400/50 sm:gap-3 sm:px-8 sm:py-4 sm:text-lg md:w-auto lg:px-10 lg:py-5 lg:text-xl"
            type="button"
            onClick={() => setShowTurnosModal(true)}
          >
            <Calendar className="transition-transform group-hover:rotate-12" size={18} />
            Solicitar Turno
          </button>

          <button
            onClick={() => setShowLocationModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-base font-bold text-white shadow-lg backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white hover:text-[#447FC1] sm:gap-3 sm:px-8 sm:py-4 sm:text-lg md:w-auto lg:px-10 lg:py-5 lg:text-xl"
            type="button"
          >
            <MapPin size={18} />
            Cómo Llegar
          </button>

          <a
            href="#especialidades"
            className="flex w-full items-center justify-center gap-2 text-base font-semibold text-white transition-colors hover:text-[#9FCD5A] sm:text-lg md:w-auto lg:text-xl"
          >
            Especialidades <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

function QuickLinks() {
  const cards = [
    {
      title: "Staff Médico",
      icon: Users,
      bgColor: "bg-[#447FC1]",
      hoverColor: "hover:bg-[#35669e]",
      desc: "Conocé a nuestros profesionales",
    },
    {
      title: "Obras Sociales",
      icon: FileText,
      bgColor: "bg-[#9FCD5A]",
      hoverColor: "hover:bg-[#8ec049]",
      desc: "Coberturas y convenios",
    },
    {
      title: "Novedades",
      icon: Newspaper,
      bgColor: "bg-[#727376]",
      hoverColor: "hover:bg-[#5e5f61]",
      desc: "Últimas noticias del sanatorio",
    },
  ] as const;

  return (
    <section className="relative z-30 -mt-16 pb-12 sm:-mt-20 sm:pb-16 md:-mt-24 md:pb-20 lg:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 lg:gap-8">
          {cards.map((card) => (
            <a
              key={card.title}
              href="#"
              className={`group relative flex h-40 flex-col justify-center overflow-hidden rounded-2xl px-6 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl sm:h-48 sm:px-8 md:h-52 lg:h-56 lg:px-10 ${card.bgColor} ${card.hoverColor}`}
            >
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 p-4 opacity-10 transition-transform duration-500 group-hover:scale-150">
                <card.icon size={100} className="text-white sm:size-[120px] lg:size-[140px]" />
              </div>

              <div className="relative z-10 text-white">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 shadow-inner backdrop-blur-sm sm:mb-4 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
                  <card.icon size={24} className="text-white sm:size-7 lg:size-8" />
                </div>
                <h3 className="mb-1 flex items-center gap-2 text-xl font-bold sm:text-2xl lg:text-3xl">{card.title}</h3>
                <p className="mb-2 text-xs font-medium text-white/90 sm:mb-3 sm:text-sm lg:text-base">{card.desc}</p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80 transition-all group-hover:gap-3 group-hover:opacity-100 lg:text-sm">
                  Ingresar <ArrowRight size={14} className="lg:size-4" />
                </div>
              </div>
            </a>
          ))}
        </div>
    </div>
    </section>
  );
}

function Institucional() {
  const [showInstitucionalVideo, setShowInstitucionalVideo] = useState(false);

  return (
    <section id="institucional" className="bg-white py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {showInstitucionalVideo && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowInstitucionalVideo(false)}
            />
            <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-black shadow-2xl">
              <button
                onClick={() => setShowInstitucionalVideo(false)}
                className="absolute right-4 top-4 z-10 rounded-full bg-white/15 p-2 text-white backdrop-blur-md transition-colors hover:bg-white/25"
                type="button"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
              <div className="relative aspect-video w-full">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube.com/embed/ovv5dDsEoC4?autoplay=1&mute=1"
                  title="Sanatorio San Juan - Centro quirúrgico y cuidados intensivos"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-7xl">
          <span className="rounded-full bg-[#447FC1]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#447FC1] sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 lg:text-sm">
            Institucional
          </span>
          <div className="mt-6 grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div>
              <h2 className="text-3xl font-extrabold text-[#727376] sm:text-4xl md:text-5xl lg:text-6xl">
                Centro quirúrgico y <span className="text-[#9FCD5A]">cuidados intensivos</span>
              </h2>
              <p className="mt-3 text-xs font-bold uppercase tracking-widest text-[#447FC1] sm:mt-4 sm:text-sm lg:text-base">Sobre el SSJ</p>
              <p className="mt-3 text-base leading-relaxed text-gray-600 sm:mt-4 sm:text-lg lg:text-xl">
                Somos una empresa de salud dedicada al cuidado de pacientes adultos con enfermedades agudas y crónicas,
                que requieran atención médica especializada, tanto clínica como quirúrgica.
              </p>
              <p className="mt-3 text-base leading-relaxed text-gray-600 sm:mt-4 sm:text-lg lg:text-xl">
                Sanatorio San Juan cuenta con guardia de urgencias 24 hs, atención ambulatoria, internación clínica,
                internación quirúrgica y terapia intensiva.
              </p>
              <p className="mt-3 text-base leading-relaxed text-gray-600 sm:mt-4 sm:text-lg lg:text-xl">
                Disponemos de un amplio equipo de médicos especialistas y profesionales altamente capacitados.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row lg:gap-4">
                <button
                  type="button"
                  onClick={() => setShowInstitucionalVideo(true)}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#447FC1] px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#3668a0] hover:shadow-[#447FC1]/30 sm:gap-3 sm:px-8 sm:py-4 sm:text-lg lg:px-10 lg:py-5 lg:text-xl"
                >
                  Ver video
                  <PlayCircle size={18} className="transition-transform group-hover:scale-110 sm:size-5" />
                </button>
                <a
                  href="#contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#9FCD5A] bg-white px-6 py-3 text-base font-bold text-[#727376] shadow-lg transition-all hover:-translate-y-1 hover:bg-[#9FCD5A]/10 sm:gap-3 sm:px-8 sm:py-4 sm:text-lg lg:px-10 lg:py-5 lg:text-xl"
                >
                  Consultar
                  <ArrowRight size={18} className="sm:size-5" />
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://ss-cnt-001c.esmsv.com/r/content/host2/9a3ded02845d9dd13edf0351290a936b//editor/Diseosinttulo69-(1911).webp"
                alt="Sanatorio San Juan - Centro quirúrgico y cuidados intensivos"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  icon: Icon,
  title,
  desc,
  color = "blue",
}: {
  icon: typeof Heart;
  title: string;
  desc: string;
  color?: "blue" | "green";
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl sm:p-8 lg:p-10">
      <div
        className={`absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-bl-full bg-gradient-to-br ${
          color === "green" ? "from-[#9FCD5A]/20" : "from-[#447FC1]/20"
        } to-transparent transition-transform duration-500 group-hover:scale-150`}
      />

      <div
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm transition-transform duration-300 group-hover:rotate-6 sm:mb-6 sm:h-16 sm:w-16 lg:h-20 lg:w-20 ${
          color === "green" ? "bg-[#9FCD5A]" : "bg-[#447FC1]"
        }`}
      >
        <Icon size={28} className="sm:size-8 lg:size-10" />
      </div>

      <h3 className="mb-2 text-xl font-bold text-[#727376] transition-colors group-hover:text-[#447FC1] sm:mb-3 sm:text-2xl lg:text-3xl">
        {title}
      </h3>
      <p className="mb-6 text-sm leading-relaxed text-gray-500 sm:mb-8 sm:text-base lg:text-lg">{desc}</p>

      <a
        href="#"
        className={`inline-flex items-center text-xs font-bold uppercase tracking-wider transition-all hover:underline group-hover:gap-2 sm:text-sm lg:text-base ${
          color === "green" ? "text-[#9FCD5A]" : "text-[#447FC1]"
        }`}
      >
        Saber más <ArrowRight size={14} className="ml-2 sm:size-4 lg:size-5" />
      </a>
    </div>
  );
}

function Services() {
  const [showEspecialidadesModal, setShowEspecialidadesModal] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gray-50 pb-16 pt-16 sm:pb-20 sm:pt-20 md:pb-24 md:pt-24 lg:pb-32 lg:pt-32" id="especialidades">
      <EspecialidadesModal
        isOpen={showEspecialidadesModal}
        onClose={() => setShowEspecialidadesModal(false)}
      />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden opacity-30">
        <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-[#447FC1]/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-[#9FCD5A]/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16 md:mb-20 lg:mb-24">
          <span className="rounded-full bg-[#447FC1]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#447FC1] sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 lg:text-sm">
            Nuestros Servicios
          </span>
          <h2 className="mb-4 mt-3 text-3xl font-extrabold text-[#727376] sm:mb-6 sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl">
            Excelencia Médica <span className="text-[#9FCD5A]">Integral</span>
          </h2>
          <div className="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-[#447FC1] to-[#9FCD5A] lg:w-32" />

          <div className="mx-auto mt-6 flex w-full flex-col items-center justify-center gap-3 sm:mt-8 sm:gap-4 md:w-auto md:flex-row lg:gap-5">
            <button
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#9FCD5A] px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#8ec049] hover:shadow-green-400/50 sm:gap-3 sm:px-8 sm:py-4 sm:text-lg md:w-auto lg:px-10 lg:py-5 lg:text-xl"
              type="button"
              onClick={() => setShowEspecialidadesModal(true)}
            >
              <Calendar className="transition-transform group-hover:rotate-12" size={18} />
              Ver todas las especialidades
            </button>
            <a
              href="#contacto"
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#447FC1] bg-white px-6 py-3 text-base font-bold text-[#447FC1] shadow-lg transition-all hover:-translate-y-1 hover:bg-[#447FC1] hover:text-white sm:gap-3 sm:px-8 sm:py-4 sm:text-lg md:w-auto lg:px-10 lg:py-5 lg:text-xl"
            >
              Consultar por WhatsApp
              <MessageSquare size={18} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 md:gap-10 lg:gap-12">
          <ServiceCard
            icon={Heart}
            title="Cardiología"
            desc="Centro cardiovascular de alta complejidad con hemodinamia y unidad coronaria."
            color="blue"
          />
          <ServiceCard
            icon={Activity}
            title="Diagnóstico 3D"
            desc="Equipamiento de última generación para diagnósticos precisos, rápidos y seguros."
            color="green"
          />
          <ServiceCard
            icon={Stethoscope}
            title="Clínica Médica"
            desc="Atención integral para el cuidado de tu salud con profesionales de primer nivel."
            color="blue"
          />
        </div>
      </div>
    </section>
  );
}

function Technology() {
  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10 sm:gap-12 md:flex-row md:gap-16 lg:gap-20">
          <div className="group relative w-full md:w-1/2">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-r from-[#447FC1] to-[#9FCD5A] opacity-30 blur-lg transition duration-1000 group-hover:opacity-50" />
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
              <div className="relative aspect-video w-full">
                <video
                  src="/innovation-video.mp4"
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#447FC1]/80 to-transparent opacity-60" />
              </div>
            </div>
          </div>

          <div className="w-full space-y-6 sm:space-y-8 md:w-1/2 lg:space-y-10">
            <h2 className="text-3xl font-extrabold leading-tight text-[#727376] sm:text-4xl md:text-5xl lg:text-6xl">
              Innovación <br />
              <span className="text-[#447FC1]">que Salva Vidas</span>
            </h2>
            <p className="text-base leading-relaxed text-gray-500 sm:text-lg lg:text-xl">
              En el Sanatorio San Juan, la tecnología no es un lujo, es una herramienta vital. Invertimos constantemente
              para ofrecerte la seguridad de un diagnóstico acertado.
            </p>

            <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 sm:gap-6 sm:pt-4 lg:gap-8">
              {[
                { title: "Alta Resolución", desc: "Imágenes nítidas para diagnósticos precisos." },
                { title: "Rapidez", desc: "Estudios en segundos, menor ansiedad." },
                { title: "Seguridad", desc: "Menor radiación para el paciente." },
                { title: "Digital", desc: "Resultados disponibles en la nube." },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 sm:gap-4">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#9FCD5A] lg:mt-1.5 lg:h-2.5 lg:w-2.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#447FC1] sm:text-base lg:text-lg">{item.title}</h4>
                    <p className="text-xs text-gray-500 sm:text-sm lg:text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="mt-6 rounded-full border-2 border-[#727376] px-6 py-2.5 text-sm font-bold text-[#727376] transition-all hover:bg-[#727376] hover:text-white hover:shadow-lg sm:mt-8 sm:px-8 sm:py-3 sm:text-base lg:px-10 lg:py-4 lg:text-lg"
              type="button"
            >
              Conocer Equipamiento
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function GeminiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [messages, setMessages] = useState<{ id: number; text: string; sender: "bot" | "user" }[]>([
    {
      id: 1,
      text: "¡Hola! Soy el asistente inteligente del Sanatorio San Juan. Puedo informarte sobre turnos, especialidades, obras sociales y más. ¿En qué te ayudo?",
      sender: "bot",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

  // Inicializar reconocimiento de voz
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "es-AR"; // Español argentino
      
      recognition.onstart = () => {
        setIsListening(true);
        setRecognitionError(null);
      };
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setInputText((prev) => prev + (prev ? " " : "") + transcript);
        setIsListening(false);
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Error de reconocimiento:", event.error);
        setIsListening(false);
        
        switch (event.error) {
          case "no-speech":
            setRecognitionError("No se detectó voz. Intenta nuevamente.");
            break;
          case "audio-capture":
            setRecognitionError("No se pudo acceder al micrófono. Verifica los permisos.");
            break;
          case "not-allowed":
            setRecognitionError("Permiso de micrófono denegado. Actívalo en la configuración del navegador.");
            break;
          default:
            setRecognitionError("Error al reconocer voz. Intenta nuevamente.");
        }
        
        setTimeout(() => setRecognitionError(null), 5000);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      setRecognitionError("El reconocimiento de voz no está disponible en tu navegador. Usa Chrome o Edge.");
      setTimeout(() => setRecognitionError(null), 5000);
      return;
    }
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Error al iniciar reconocimiento:", error);
      setRecognitionError("Error al iniciar el micrófono. Intenta nuevamente.");
      setTimeout(() => setRecognitionError(null), 5000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find((voice) => voice.lang.includes("es"));
    if (spanishVoice) utterance.voice = spanishVoice;
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), text: inputText, sender: "user" as const };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      // Construir historial de conversación para Gemini
      const conversationHistory = messages
        .filter((msg) => msg.sender !== "user" || msg.id !== userMsg.id)
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        }));

      // Intentar usar Gemini API
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
        console.error("Error en respuesta de API:", errorData);
        throw new Error(errorData.error || "Error al comunicarse con el servidor");
      }

      const data = await response.json();

      if (data.success && data.message) {
        const botMsg = { id: Date.now() + 1, text: data.message, sender: "bot" as const };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
        if (autoSpeak) speakText(data.message);
      } else {
        // Fallback a base de conocimiento
        throw new Error(data.error || "Gemini no disponible");
      }
    } catch (error: any) {
      // Fallback a base de conocimiento si Gemini falla
      console.error("Error al usar Gemini, usando base de conocimiento como fallback:", error);
      const botResponseText = findBestResponse(currentInput);
      const botMsg = { id: Date.now() + 1, text: botResponseText, sender: "bot" as const };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      if (autoSpeak) speakText(botResponseText);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-2xl ring-4 ring-white/50 transition-transform hover:scale-110"
        style={{ background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.green})` }}
        type="button"
      >
        {isOpen ? <X size={32} color="white" /> : <Bot size={32} color="white" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-8 z-50 flex h-[550px] w-80 flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl md:h-[600px] md:w-96 lg:bottom-8 lg:right-12 lg:h-[700px] lg:w-[500px] xl:w-[600px]">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#447FC1] to-[#6FA8DC] p-4 text-white lg:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm lg:h-12 lg:w-12">
                <Bot size={24} className="text-white lg:size-7" />
              </div>
              <div>
                <span className="block text-lg font-bold lg:text-xl">Asistente Virtual</span>
                <span className="text-xs text-white/80 lg:text-sm">Sanatorio San Juan</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <button
                onClick={() => setAutoSpeak((v) => !v)}
                className={`mb-1 rounded p-1 transition-colors lg:p-2 ${autoSpeak ? "bg-white/20 text-white" : "text-white/60 hover:text-white"}`}
                title={autoSpeak ? "Desactivar respuesta de voz automática" : "Activar respuesta de voz automática"}
                type="button"
              >
                {autoSpeak ? <Volume2 size={16} className="lg:size-5" /> : <VolumeX size={16} className="lg:size-5" />}
              </button>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#9FCD5A] lg:h-2.5 lg:w-2.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 lg:text-xs">Online</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
            <div className="space-y-4 lg:space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`group relative max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm lg:max-w-[75%] lg:p-4 lg:text-base lg:leading-relaxed ${
                      msg.sender === "user"
                        ? "rounded-tr-none bg-[#447FC1] text-white"
                        : "rounded-tl-none border border-gray-100 bg-white text-gray-700"
                    }`}
                  >
                    {msg.text.split("\n").map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-2 lg:mt-3" : ""}>
                        {line.split("**").map((part, j) =>
                          j % 2 === 1 ? <strong key={j}>{part}</strong> : part,
                        )}
                      </p>
                    ))}

                    {msg.sender === "bot" && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="absolute -right-10 top-2 rounded-full bg-white p-2 text-gray-500 opacity-0 shadow-md transition-all hover:text-[#9FCD5A] group-hover:opacity-100 lg:-right-12 lg:p-2.5"
                        title="Volver a escuchar"
                        type="button"
                      >
                        <Volume2 size={18} className="lg:size-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-none border border-gray-100 bg-white p-4 shadow-sm lg:gap-2 lg:p-5">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-[#447FC1] lg:h-2.5 lg:w-2.5" style={{ animationDelay: "0s" }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-[#9FCD5A] lg:h-2.5 lg:w-2.5" style={{ animationDelay: "0.2s" }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-[#447FC1] lg:h-2.5 lg:w-2.5" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-gray-100 bg-white p-3 lg:p-5">
            {recognitionError && (
              <div className="mb-2 rounded-lg bg-red-50 p-2 text-xs text-red-600 lg:p-3 lg:text-sm">
                {recognitionError}
              </div>
            )}
            <div className="flex items-center gap-2 rounded-full border border-transparent bg-gray-100 px-2 py-2 pl-4 transition-all focus-within:border-[#447FC1] focus-within:bg-white lg:gap-3 lg:px-3 lg:py-3 lg:pl-5">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={isListening ? "Escuchando..." : "Pregunta sobre turnos, guardia..."}
                className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400 lg:text-base"
                disabled={isListening}
              />
              <button
                onClick={isListening ? stopListening : startListening}
                className={`rounded-full p-2 transition-all lg:p-2.5 ${
                  isListening
                    ? "bg-red-100 text-red-600 animate-pulse"
                    : "text-gray-400 hover:bg-gray-100 hover:text-[#447FC1]"
                }`}
                type="button"
                title={isListening ? "Detener grabación" : "Hablar con el micrófono"}
              >
                <Mic size={18} className={`lg:size-5 ${isListening ? "animate-pulse" : ""}`} />
              </button>
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isListening}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9FCD5A] text-white transition-all hover:bg-[#8ec049] hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed lg:h-12 lg:w-12"
                type="button"
              >
                <Send size={16} className="lg:size-5" />
              </button>
            </div>
            {isListening && (
              <div className="mt-2 flex items-center justify-center gap-2 lg:mt-3">
                <div className="h-2 w-2 animate-pulse rounded-full bg-red-500 lg:h-2.5 lg:w-2.5" />
                <span className="text-xs text-red-600 lg:text-sm">Grabando... Habla ahora</span>
              </div>
            )}
            <div className="mt-2 text-center lg:mt-3">
              <span className="text-[10px] text-gray-400 lg:text-xs">Powered by Plot Center Technology</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GalleryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "/galeria-01.jpg",
    "/galeria-02.jpg",
    "/galeria-03.jpg",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="relative w-full overflow-hidden bg-gray-900">
      <div className="relative h-[400px] w-full sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px]">
        {images.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Galería ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        ))}

        {/* Indicadores */}
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-[#9FCD5A]"
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              type="button"
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#727376] py-12 text-white sm:py-16 lg:py-20" id="contacto">
      <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-[#447FC1] to-[#9FCD5A]" />
      <div className="container relative z-10 mx-auto grid grid-cols-1 gap-8 px-4 sm:gap-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:px-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="inline-block rounded-xl bg-white/10 p-3 backdrop-blur-sm sm:p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ssj-logo.webp" alt="Sanatorio San Juan" className="h-10 object-contain brightness-0 invert sm:h-12 lg:h-14" />
          </div>
          <p className="text-xs leading-relaxed text-gray-300 sm:text-sm lg:text-base">
            Más de medio siglo cuidando lo más valioso. <br /> Tecnología, profesionalismo y humanidad.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-base font-bold text-[#9FCD5A] sm:mb-6 sm:text-lg lg:text-xl">Contacto</h4>
          <ul className="space-y-3 text-xs text-gray-300 sm:space-y-4 sm:text-sm lg:text-base">
            <li className="flex cursor-pointer items-start gap-2 transition-colors hover:text-white sm:gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-[#9FCD5A] sm:size-5" />
              <span>
                Gral. Juan Lavalle 735,
                <br />
                J5400 San Juan, Argentina
              </span>
            </li>
            <li className="flex cursor-pointer items-center gap-2 transition-colors hover:text-white sm:gap-3">
              <Phone size={18} className="shrink-0 text-[#9FCD5A] sm:size-5" />
              <span>0800-SANJUAN (7265)</span>
            </li>
            <li className="flex cursor-pointer items-center gap-2 transition-colors hover:text-white sm:gap-3">
              <MessageSquare size={18} className="shrink-0 text-[#9FCD5A] sm:size-5" />
              <span>info@sanatoriosanjuan.com</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-base font-bold text-[#9FCD5A] sm:mb-6 sm:text-lg lg:text-xl">Enlaces</h4>
          <ul className="space-y-2 text-xs text-gray-300 sm:space-y-3 sm:text-sm lg:text-base">
            {["Portal del Paciente", "Staff Médico", "Obras Sociales", "Novedades", "Trabajá con Nosotros"].map((item) => (
              <li key={item}>
                <a href="#" className="flex items-center gap-2 transition-all hover:pl-2 hover:text-[#9FCD5A]">
                  <span className="h-1 w-1 rounded-full bg-[#447FC1]" /> {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-base font-bold text-[#9FCD5A] sm:mb-6 sm:text-lg lg:text-xl">Horarios</h4>
          <div className="space-y-2 rounded-xl border border-white/5 bg-white/5 p-3 backdrop-blur-sm sm:space-y-3 sm:p-4">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-white">Guardia</span>
              <span className="rounded bg-[#9FCD5A] px-2 py-1 text-xs font-bold text-white">24 HS</span>
            </div>
            <div className="my-1.5 h-px bg-white/10 sm:my-2" />
            <div className="flex justify-between text-xs text-gray-300 sm:text-sm">
              <span>Laboratorio</span> <span>7:00 - 20:00</span>
            </div>
            <div className="flex justify-between text-xs text-gray-300 sm:text-sm">
              <span>Consultorios</span> <span>8:00 - 21:00</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-white/10 pt-6 text-center sm:mt-16 sm:pt-8">
        <p className="text-xs text-gray-400 sm:text-sm">© {new Date().getFullYear()} Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <div className="font-sans antialiased selection:bg-[#9FCD5A] selection:text-white">
      <Header />
      <Hero />
      <QuickLinks />
      <Institucional />
      <Services />
      <Technology />
      <GalleryCarousel />
      <Footer />
      <GeminiAssistant />
    </div>
  );
}



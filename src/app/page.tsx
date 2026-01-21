"use client";

import React, { useEffect, useRef, useState } from "react";
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
              <h3 className="mt-1 text-2xl font-extrabold text-[#727376]">Solicitar turno</h3>
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

const KNOWLEDGE_BASE = [
  {
    keywords: ["hola", "buen dia", "buenas", "inicio", "empezar"],
    response:
      "¡Hola! Soy el asistente virtual inteligente del Sanatorio San Juan. Puedo ayudarte con turnos, horarios, especialidades, obras sociales y mucho más. ¿Qué necesitas saber?",
  },
  {
    keywords: ["turno", "cita", "reservar", "sacar", "doctor"],
    response:
      "Para solicitar un turno tienes 3 opciones rápidas: \n1. A través de nuestro **Portal del Paciente** (botón verde arriba). \n2. Llamando a nuestro Call Center al **0800-SANJUAN**. \n3. Por WhatsApp al 264-1234567. \n¿Te gustaría que te envíe el link directo al portal?",
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
    ],
    response:
      "Contamos con más de 50 especialidades médicas, incluyendo Cardiología, Pediatría, Obstetricia, Traumatología, Neurología y Cirugía General. Además, tenemos un servicio de Diagnóstico por Imágenes de alta complejidad.",
  },
  {
    keywords: ["ubicacion", "donde", "llegar", "direccion", "calle", "mapa"],
    response:
      "Nuestra Sede Central está en **Gral. Juan Lavalle 735, J5400 San Juan**. Contamos con estacionamiento exclusivo para pacientes por calle lateral. Puedes usar el botón 'Cómo Llegar' en la portada para ver el mapa.",
  },
  {
    keywords: ["guardia", "urgencia", "emergencia", "dolor"],
    response:
      "⚠️ Nuestra **Guardia funciona las 24 horas**, los 365 días del año. Atendemos urgencias de Adultos y Pediátricas. Si tienes una emergencia de riesgo de vida, por favor llama inmediatamente al 107 o acude directamente.",
  },
  {
    keywords: ["obra social", "prepaga", "cobertura", "osde", "swiss", "provincia", "pami"],
    response:
      "Trabajamos con las principales obras sociales y prepagas del país, incluyendo Obra Social Provincia, OSDE, Swiss Medical, Galeno, Sancor Salud, entre otras. Para consultar una cobertura específica, te recomiendo llamar a administración al 0264-4222222.",
  },
  {
    keywords: ["horario", "atencion", "abierto", "hora"],
    response:
      "Te detallo nuestros horarios: \n• **Guardia:** 24 hs. \n• **Laboratorio:** Lunes a Viernes de 7:00 a 20:00 hs. \n• **Consultorios Externos:** Lunes a Viernes de 8:00 a 21:00 hs. \n• **Visitas a Internación:** Todos los días de 11:00 a 13:00 y de 17:00 a 19:00 hs.",
  },
  {
    keywords: ["laboratorio", "analisis", "sangre", "resultados"],
    response:
      "El laboratorio atiende por orden de llegada de 7:00 a 10:00 hs para extracciones. Los resultados los puedes descargar directamente desde nuestra web en la sección 'Resultados Online' sin necesidad de venir a buscarlos.",
  },
  {
    keywords: ["telefono", "contacto", "llamar", "numero", "whatsapp"],
    response:
      "Nuestros canales de contacto son: \n• Teléfono: 0800-SANJUAN (7265) \n• WhatsApp Turnos: 264-1234567 \n• Conmutador: 0264-4222222 \n• Email: info@sanatoriosanjuan.com",
  },
  {
    keywords: ["tecnologia", "tomografo", "equipo", "resonancia"],
    response:
      "Estamos orgullosos de contar con el tomógrafo **Philips Brilliance de 64 cortes**, único en la región, que permite diagnósticos cardíacos y cerebrales de altísima precisión en segundos. También contamos con Resonancia Magnética y Ecografía 4D.",
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
      <div className="container mx-auto flex items-center justify-between px-6">
        <div className="flex items-center justify-center transition-all duration-500">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ssj-logo-header.png"
            alt="Sanatorio San Juan Logo"
            className={`object-contain transition-all duration-500 ${isScrolled ? "h-8 md:h-10" : "h-10 md:h-12"}`}
          />
        </div>

        <nav className="hidden items-center space-x-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`group relative text-sm font-bold uppercase tracking-wide transition-colors ${
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
            className="flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-green-500/30"
            style={{ backgroundColor: COLORS.green }}
            type="button"
          >
            <Calendar size={18} />
            Portal Paciente
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

      <div className="container relative z-20 mx-auto flex flex-col items-center px-6 pt-20 text-center md:items-start md:text-left">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-md">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#9FCD5A]" />
          Líderes en Innovación Médica
        </div>

        <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] text-white drop-shadow-xl md:text-7xl">
          Tu Salud <br />
          <span className="bg-gradient-to-r from-white via-[#9FCD5A] to-white bg-clip-text text-transparent drop-shadow-lg">
            Nuestra Prioridad
          </span>
        </h1>

        <p className="mb-10 max-w-2xl text-xl font-light leading-relaxed text-gray-50 drop-shadow-md md:text-2xl">
          Tecnología de última generación y calidez humana se unen para brindarte la mejor atención médica de la región.
        </p>

        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
          <button
            className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#9FCD5A] px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#8ec049] hover:shadow-green-400/50 md:w-auto"
            type="button"
            onClick={() => setShowTurnosModal(true)}
          >
            <Calendar className="transition-transform group-hover:rotate-12" />
            Solicitar Turno
          </button>

          <button
            onClick={() => setShowLocationModal(true)}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-lg font-bold text-white shadow-lg backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white hover:text-[#447FC1] md:w-auto"
            type="button"
          >
            <MapPin />
            Cómo Llegar
          </button>

          <a
            href="#especialidades"
            className="flex w-full items-center justify-center gap-2 text-lg font-semibold text-white transition-colors hover:text-[#9FCD5A] md:w-auto"
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
    <section className="relative z-30 -mt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <a
              key={card.title}
              href="#"
              className={`group relative flex h-48 flex-col justify-center overflow-hidden rounded-2xl px-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${card.bgColor} ${card.hoverColor}`}
            >
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 p-4 opacity-10 transition-transform duration-500 group-hover:scale-150">
                <card.icon size={120} className="text-white" />
              </div>

              <div className="relative z-10 text-white">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 shadow-inner backdrop-blur-sm">
                  <card.icon size={28} className="text-white" />
                </div>
                <h3 className="mb-1 flex items-center gap-2 text-2xl font-bold">{card.title}</h3>
                <p className="mb-3 text-sm font-medium text-white/90">{card.desc}</p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80 transition-all group-hover:gap-3 group-hover:opacity-100">
                  Ingresar <ArrowRight size={14} />
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
  return (
    <section id="institucional" className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-[#447FC1]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#447FC1]">
            Institucional
          </span>
          <h2 className="mt-4 text-4xl font-extrabold text-[#727376] md:text-5xl">
            Conocé el <span className="text-[#9FCD5A]">SSJ</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-500">
            Base lista para sumar historia, directivos, noticias y trabajá con nosotros, manteniendo el diseño y la
            navegación del sitio.
          </p>
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
    <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div
        className={`absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-bl-full bg-gradient-to-br ${
          color === "green" ? "from-[#9FCD5A]/20" : "from-[#447FC1]/20"
        } to-transparent transition-transform duration-500 group-hover:scale-150`}
      />

      <div
        className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-sm transition-transform duration-300 group-hover:rotate-6 ${
          color === "green" ? "bg-[#9FCD5A]" : "bg-[#447FC1]"
        }`}
      >
        <Icon size={32} />
      </div>

      <h3 className="mb-3 text-2xl font-bold text-[#727376] transition-colors group-hover:text-[#447FC1]">
        {title}
      </h3>
      <p className="mb-8 leading-relaxed text-gray-500">{desc}</p>

      <a
        href="#"
        className={`inline-flex items-center text-sm font-bold uppercase tracking-wider transition-all hover:underline group-hover:gap-2 ${
          color === "green" ? "text-[#9FCD5A]" : "text-[#447FC1]"
        }`}
      >
        Saber más <ArrowRight size={16} className="ml-2" />
      </a>
    </div>
  );
}

function Services() {
  return (
    <section className="relative overflow-hidden bg-gray-50 pb-24 pt-24" id="especialidades">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden opacity-30">
        <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-[#447FC1]/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-[#9FCD5A]/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mb-20 text-center">
          <span className="rounded-full bg-[#447FC1]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#447FC1]">
            Nuestros Servicios
          </span>
          <h2 className="mb-6 mt-4 text-4xl font-extrabold text-[#727376] md:text-5xl">
            Excelencia Médica <span className="text-[#9FCD5A]">Integral</span>
          </h2>
          <div className="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-[#447FC1] to-[#9FCD5A]" />

          <div className="mx-auto mt-8 flex w-full flex-col items-center justify-center gap-4 md:w-auto md:flex-row">
            <button
              className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#9FCD5A] px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#8ec049] hover:shadow-green-400/50 md:w-auto"
              type="button"
            >
              <Calendar className="transition-transform group-hover:rotate-12" />
              Ver todas las especialidades
            </button>
            <a
              href="#contacto"
              className="flex w-full items-center justify-center gap-3 rounded-full border-2 border-[#447FC1] bg-white px-8 py-4 text-lg font-bold text-[#447FC1] shadow-lg transition-all hover:-translate-y-1 hover:bg-[#447FC1] hover:text-white md:w-auto"
            >
              Consultar por WhatsApp
              <MessageSquare size={18} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
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

function Patients() {
  return (
    <section id="pacientes" className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="mb-14 text-center">
          <span className="rounded-full bg-[#9FCD5A]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#727376]">
            Pacientes
          </span>
          <h2 className="mt-4 text-4xl font-extrabold text-[#727376] md:text-5xl">
            Información <span className="text-[#447FC1]">útil</span> y accesos rápidos
          </h2>
          <div className="mx-auto mt-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-[#447FC1] to-[#9FCD5A]" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
            <h3 className="text-xl font-bold text-[#727376]">Turnos</h3>
            <p className="mt-2 text-gray-500">Solicitá turnos y recibí confirmación (WhatsApp/Email a integrar).</p>
            <a href="#contacto" className="mt-6 inline-flex items-center font-bold text-[#447FC1] hover:underline">
              Ver opciones <ArrowRight size={16} className="ml-2" />
            </a>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
            <h3 className="text-xl font-bold text-[#727376]">Horarios</h3>
            <p className="mt-2 text-gray-500">Guardia 24hs, laboratorio y consultorios externos.</p>
            <a href="#contacto" className="mt-6 inline-flex items-center font-bold text-[#9FCD5A] hover:underline">
              Consultar <ArrowRight size={16} className="ml-2" />
            </a>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
            <h3 className="text-xl font-bold text-[#727376]">Obras Sociales</h3>
            <p className="mt-2 text-gray-500">Coberturas y convenios con prepagas/obras sociales.</p>
            <a href="#contacto" className="mt-6 inline-flex items-center font-bold text-[#447FC1] hover:underline">
              Ver listado <ArrowRight size={16} className="ml-2" />
          </a>
        </div>
        </div>
      </div>
    </section>
  );
}

function Technology() {
  return (
    <section className="overflow-hidden bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-16 md:flex-row">
          <div className="group relative md:w-1/2">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-r from-[#447FC1] to-[#9FCD5A] opacity-30 blur-lg transition duration-1000 group-hover:opacity-50" />
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80"
                alt="Tecnología Médica"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#447FC1]/80 to-transparent opacity-60" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="mb-1 text-lg font-bold">Tecnología Philips</p>
                <p className="text-sm opacity-80">Brilliance 64 Cortes</p>
              </div>
            </div>
          </div>

          <div className="space-y-8 md:w-1/2">
            <h2 className="text-4xl font-extrabold leading-tight text-[#727376] md:text-6xl">
              Innovación <br />
              <span className="text-[#447FC1]">que Salva Vidas</span>
            </h2>
            <p className="text-lg leading-relaxed text-gray-500">
              En el Sanatorio San Juan, la tecnología no es un lujo, es una herramienta vital. Invertimos constantemente
              para ofrecerte la seguridad de un diagnóstico acertado.
            </p>

            <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2">
              {[
                { title: "Alta Resolución", desc: "Imágenes nítidas para diagnósticos precisos." },
                { title: "Rapidez", desc: "Estudios en segundos, menor ansiedad." },
                { title: "Seguridad", desc: "Menor radiación para el paciente." },
                { title: "Digital", desc: "Resultados disponibles en la nube." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#9FCD5A]" />
                  <div>
                    <h4 className="font-bold text-[#447FC1]">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="mt-8 rounded-full border-2 border-[#727376] px-8 py-3 font-bold text-[#727376] transition-all hover:bg-[#727376] hover:text-white hover:shadow-lg"
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

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

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), text: inputText, sender: "user" as const };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponseText = findBestResponse(userMsg.text);
      const botMsg = { id: Date.now() + 1, text: botResponseText, sender: "bot" as const };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      if (autoSpeak) speakText(botResponseText);
    }, 1200);
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
        <div className="fixed bottom-28 right-8 z-50 flex h-[550px] w-80 flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl md:w-96">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#447FC1] to-[#6FA8DC] p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Bot size={24} className="text-white" />
              </div>
              <div>
                <span className="block text-lg font-bold">Asistente Virtual</span>
                <span className="text-xs text-white/80">Sanatorio San Juan</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <button
                onClick={() => setAutoSpeak((v) => !v)}
                className={`mb-1 rounded p-1 transition-colors ${autoSpeak ? "bg-white/20 text-white" : "text-white/60 hover:text-white"}`}
                title={autoSpeak ? "Desactivar respuesta de voz automática" : "Activar respuesta de voz automática"}
                type="button"
              >
                {autoSpeak ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#9FCD5A]" />
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Online</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50 p-5">
            <div className="space-y-5">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`group relative max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "rounded-tr-none bg-[#447FC1] text-white"
                        : "rounded-tl-none border border-gray-100 bg-white text-gray-700"
                    }`}
                  >
                    {msg.text.split("\n").map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-2" : ""}>
                        {line.split("**").map((part, j) =>
                          j % 2 === 1 ? <strong key={j}>{part}</strong> : part,
                        )}
                      </p>
                    ))}

                    {msg.sender === "bot" && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="absolute -right-10 top-2 rounded-full bg-white p-2 text-gray-500 opacity-0 shadow-md transition-all hover:text-[#9FCD5A] group-hover:opacity-100"
                        title="Volver a escuchar"
                        type="button"
                      >
                        <Volume2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-none border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-[#447FC1]" style={{ animationDelay: "0s" }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-[#9FCD5A]" style={{ animationDelay: "0.2s" }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-[#447FC1]" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-gray-100 bg-white p-4">
            <div className="flex items-center gap-2 rounded-full border border-transparent bg-gray-100 px-2 py-2 pl-4 transition-all focus-within:border-[#447FC1] focus-within:bg-white">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Pregunta sobre turnos, guardia..."
                className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
              />
              <button className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#447FC1]" type="button">
                <Mic size={18} />
              </button>
              <button
                onClick={handleSend}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9FCD5A] text-white transition-all hover:bg-[#8ec049] hover:shadow-lg active:scale-95"
                type="button"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="mt-2 text-center">
              <span className="text-[10px] text-gray-400">Powered by Plot Center Technology</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#727376] py-16 text-white" id="contacto">
      <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-[#447FC1] to-[#9FCD5A]" />
      <div className="container relative z-10 mx-auto grid grid-cols-1 gap-12 px-6 md:grid-cols-4">
        <div className="space-y-6">
          <div className="inline-block rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ssj-logo.webp" alt="Sanatorio San Juan" className="h-12 object-contain brightness-0 invert" />
          </div>
          <p className="text-sm leading-relaxed text-gray-300">
            Más de medio siglo cuidando lo más valioso. <br /> Tecnología, profesionalismo y humanidad.
          </p>
        </div>
        <div>
          <h4 className="mb-6 text-lg font-bold text-[#9FCD5A]">Contacto</h4>
          <ul className="space-y-4 text-sm text-gray-300">
            <li className="flex cursor-pointer items-start gap-3 transition-colors hover:text-white">
              <MapPin size={20} className="mt-0.5 text-[#9FCD5A]" />
              <span>
                Gral. Juan Lavalle 735,
                <br />
                J5400 San Juan, Argentina
              </span>
            </li>
            <li className="flex cursor-pointer items-center gap-3 transition-colors hover:text-white">
              <Phone size={20} className="text-[#9FCD5A]" />
              <span>0800-SANJUAN (7265)</span>
            </li>
            <li className="flex cursor-pointer items-center gap-3 transition-colors hover:text-white">
              <MessageSquare size={20} className="text-[#9FCD5A]" />
              <span>info@sanatoriosanjuan.com</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-6 text-lg font-bold text-[#9FCD5A]">Enlaces</h4>
          <ul className="space-y-3 text-sm text-gray-300">
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
          <h4 className="mb-6 text-lg font-bold text-[#9FCD5A]">Horarios</h4>
          <div className="space-y-3 rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-white">Guardia</span>
              <span className="rounded bg-[#9FCD5A] px-2 py-1 text-xs font-bold text-white">24 HS</span>
            </div>
            <div className="my-2 h-px bg-white/10" />
            <div className="flex justify-between text-sm text-gray-300">
              <span>Laboratorio</span> <span>7:00 - 20:00</span>
            </div>
            <div className="flex justify-between text-sm text-gray-300">
              <span>Consultorios</span> <span>8:00 - 21:00</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 border-t border-white/10 pt-8 text-center">
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} Todos los derechos reservados.</p>
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
      <Patients />
      <Technology />
      <Footer />
      <GeminiAssistant />
    </div>
  );
}



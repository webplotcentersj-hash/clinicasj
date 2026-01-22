"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  FileText,
  LogOut,
  User,
  Stethoscope,
  Download,
  ChevronRight,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Datos de ejemplo para el portal
const MOCK_PATIENT = {
  nombre: "María",
  apellido: "González",
  dni: "12345678",
  telefono: "264-1234567",
  email: "maria.gonzalez@email.com",
  obraSocial: "OSDE",
  numeroAfiliado: "123456789",
};

const MOCK_TURNOS = [
  {
    id: 1,
    fecha: "2024-02-15",
    hora: "10:00",
    especialidad: "Cardiología",
    medico: "Dr. Carlos Rodríguez",
    estado: "confirmado",
    tipo: "Consulta",
  },
  {
    id: 2,
    fecha: "2024-02-20",
    hora: "14:30",
    especialidad: "Pediatría",
    medico: "Dra. María González",
    estado: "pendiente",
    tipo: "Control",
  },
  {
    id: 3,
    fecha: "2024-01-10",
    hora: "09:00",
    especialidad: "Traumatología",
    medico: "Dr. Juan Martínez",
    estado: "completado",
    tipo: "Consulta",
  },
];

const MOCK_RESULTADOS = [
  {
    id: 1,
    fecha: "2024-01-15",
    tipo: "Análisis de Sangre",
    descripcion: "Hemograma completo",
    estado: "disponible",
    archivo: "resultado_001.pdf",
  },
  {
    id: 2,
    fecha: "2024-01-20",
    tipo: "Radiografía",
    descripcion: "Radiografía de tórax",
    estado: "disponible",
    archivo: "resultado_002.pdf",
  },
];

function LoginForm({ onLogin, isLoading }: { onLogin: (dni: string, password: string) => void; isLoading: boolean }) {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!dni || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    const dniClean = dni.trim();
    const passwordClean = password.trim();
    
    // Para demo: acepta cualquier DNI de 7+ dígitos y contraseña de 3+ caracteres
    // O las credenciales específicas de ejemplo
    if (dniClean.length >= 7 && passwordClean.length >= 3) {
      onLogin(dniClean, passwordClean);
    } else {
      setError("DNI debe tener al menos 7 dígitos y contraseña al menos 3 caracteres");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#447FC1] via-[#447FC1] to-[#9FCD5A] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <User size={32} className="text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white">Portal del Paciente</h1>
          <p className="text-white/80">Ingresá con tu DNI y contraseña</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}

            <div>
              <label htmlFor="dni" className="mb-2 block text-sm font-bold text-gray-700">
                DNI
              </label>
              <input
                id="dni"
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="12345678"
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-gray-700 transition-all focus:border-[#447FC1] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-bold text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresá tu contraseña"
                className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-gray-700 transition-all focus:border-[#447FC1] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#9FCD5A] px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-[#8ec049] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Ingresando..." : "Ingresar"}
            </button>

            <div className="pt-4 text-center">
              <a href="#" className="text-sm text-[#447FC1] hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 p-4 text-xs text-gray-600">
              <p className="font-bold mb-2">Modo Demo:</p>
              <p>Ingresá cualquier DNI (7+ dígitos) y contraseña (3+ caracteres)</p>
              <p className="mt-2">Ejemplo: DNI: 12345678, Contraseña: demo123</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"turnos" | "resultados" | "perfil">("turnos");

  const proximosTurnos = MOCK_TURNOS.filter((t) => t.estado === "confirmado" || t.estado === "pendiente");
  const historialTurnos = MOCK_TURNOS.filter((t) => t.estado === "completado");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#447FC1] text-white">
                <User size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">
                  {MOCK_PATIENT.nombre} {MOCK_PATIENT.apellido}
                </h1>
                <p className="text-sm text-gray-500">Portal del Paciente</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {[
              { id: "turnos" as const, label: "Mis Turnos", icon: Calendar },
              { id: "resultados" as const, label: "Resultados", icon: FileText },
              { id: "perfil" as const, label: "Mi Perfil", icon: User },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-bold transition-colors ${
                  activeTab === tab.id
                    ? "border-[#9FCD5A] text-[#447FC1]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "turnos" && (
          <div className="space-y-6">
            {/* Próximos Turnos */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">Próximos Turnos</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {proximosTurnos.map((turno) => (
                  <div
                    key={turno.id}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#447FC1]/10">
                          <Stethoscope size={24} className="text-[#447FC1]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{turno.especialidad}</h3>
                          <p className="text-sm text-gray-500">{turno.medico}</p>
                        </div>
                      </div>
                      {turno.estado === "confirmado" ? (
                        <CheckCircle size={20} className="text-green-500" />
                      ) : (
                        <AlertCircle size={20} className="text-yellow-500" />
                      )}
                    </div>
                    <div className="space-y-2 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>{new Date(turno.fecha).toLocaleDateString("es-AR")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} />
                        <span>{turno.hora}</span>
                      </div>
                      <div className="mt-3">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                            turno.estado === "confirmado"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {turno.estado === "confirmado" ? "Confirmado" : "Pendiente"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historial */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">Historial de Turnos</h2>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="divide-y divide-gray-100">
                  {historialTurnos.map((turno) => (
                    <div key={turno.id} className="p-4 hover:bg-gray-50 sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                            <Stethoscope size={20} className="text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">{turno.especialidad}</h3>
                            <p className="text-sm text-gray-500">{turno.medico}</p>
                            <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                              <span>{new Date(turno.fecha).toLocaleDateString("es-AR")}</span>
                              <span>{turno.hora}</span>
                              <span>{turno.tipo}</span>
                            </div>
                          </div>
                        </div>
                        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                          Completado
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Botón Solicitar Turno */}
            <div className="flex justify-center">
              <a
                href="/#inicio"
                className="flex items-center gap-2 rounded-full bg-[#9FCD5A] px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-[#8ec049] hover:shadow-xl"
              >
                <Calendar size={20} />
                Solicitar Nuevo Turno
              </a>
            </div>
          </div>
        )}

        {activeTab === "resultados" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Resultados de Estudios</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MOCK_RESULTADOS.map((resultado) => (
                <div
                  key={resultado.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#9FCD5A]/10">
                        <FileText size={24} className="text-[#9FCD5A]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{resultado.tipo}</h3>
                        <p className="text-sm text-gray-500">{resultado.descripcion}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>{new Date(resultado.fecha).toLocaleDateString("es-AR")}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        Disponible
                      </span>
                      <button className="flex items-center gap-2 rounded-lg bg-[#447FC1] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#3668a0]">
                        <Download size={16} />
                        Descargar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "perfil" && (
          <div className="max-w-2xl">
            <h2 className="mb-6 text-xl font-bold text-gray-800">Mi Perfil</h2>
            <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Nombre</label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800">
                    {MOCK_PATIENT.nombre}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Apellido</label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800">
                    {MOCK_PATIENT.apellido}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">DNI</label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800">
                    {MOCK_PATIENT.dni}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Teléfono</label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800">
                    {MOCK_PATIENT.telefono}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Email</label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800">
                    {MOCK_PATIENT.email}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Obra Social</label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800">
                    {MOCK_PATIENT.obraSocial}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-gray-700">Número de Afiliado</label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800">
                    {MOCK_PATIENT.numeroAfiliado}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <button className="w-full rounded-lg bg-[#447FC1] px-6 py-3 font-bold text-white transition-all hover:bg-[#3668a0] sm:w-auto">
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function PortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (dni: string, password: string) => {
    setIsLoading(true);
    // Simulación de delay de autenticación
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} isLoading={isLoading} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}


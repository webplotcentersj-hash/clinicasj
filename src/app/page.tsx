import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#727376]/20 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-3">
            <img
              src="/ssj-logo.webp"
              alt="Sanatorio San Juan"
              className="h-10 w-auto"
            />
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a className="text-[#727376] transition-colors hover:text-[#447FC1]" href="#pacientes">
              Pacientes
            </a>
            <a className="text-[#727376] transition-colors hover:text-[#447FC1]" href="#ubicaciones">
              Ubicaciones
            </a>
            <a className="text-[#727376] transition-colors hover:text-[#447FC1]" href="#contacto">
              Contacto
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#turnos"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#9FCD5A] px-6 text-sm font-semibold text-[#1a1a1a] shadow-md transition-all hover:bg-[#8fc04a] hover:shadow-lg"
            >
              Turnos online
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#f8f9fa] to-[#e8f4fd]">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-[#9FCD5A]/10 blur-3xl" />
            <div className="absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-[#447FC1]/10 blur-3xl" />
          </div>
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-2 md:py-28 lg:items-center">
            <div className="flex flex-col">
              <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#9FCD5A]/10 px-4 py-1.5 text-xs font-semibold text-[#1a1a1a]">
                <span className="h-2 w-2 rounded-full bg-[#9FCD5A]"></span>
                Confort • Tecnología • Servicios 24hs
              </div>
              <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight text-[#1a1a1a] md:text-6xl lg:text-7xl">
                Atención integral con{" "}
                <span className="text-[#447FC1]">tecnología</span> y{" "}
                <span className="text-[#9FCD5A]">calidad humana</span>
              </h1>
              <p className="mt-6 text-lg leading-7 text-[#727376] md:text-xl">
                Especialidades, internación y servicios 24hs. Guardia pediátrica y
                consultorios de demanda espontánea, con cobertura de obras sociales.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#turnos"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#9FCD5A] px-8 text-base font-semibold text-[#1a1a1a] shadow-lg transition-all hover:bg-[#8fc04a] hover:shadow-xl"
                >
                  Sacar turno
                </a>
                <a
                  href="#pediatria"
                  className="inline-flex h-12 items-center justify-center rounded-full border-2 border-[#447FC1] bg-white px-8 text-base font-semibold text-[#447FC1] transition-all hover:bg-[#447FC1] hover:text-white"
                >
                  Guardia pediátrica
                </a>
              </div>

              {/* Stats Cards */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                <div className="rounded-2xl border border-[#727376]/20 bg-white p-5 shadow-sm">
                  <div className="mb-2 h-10 w-10 rounded-lg bg-[#9FCD5A]/10 flex items-center justify-center">
                    <span className="text-xl">🛏️</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">Confort</p>
                  <p className="mt-1 text-xs text-[#727376]">
                    Estadía placentera
                  </p>
                </div>
                <div className="rounded-2xl border border-[#727376]/20 bg-white p-5 shadow-sm">
                  <div className="mb-2 h-10 w-10 rounded-lg bg-[#447FC1]/10 flex items-center justify-center">
                    <span className="text-xl">💻</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">Tecnología</p>
                  <p className="mt-1 text-xs text-[#727376]">
                    Diagnóstico rápido
                  </p>
                </div>
                <div className="rounded-2xl border border-[#727376]/20 bg-white p-5 shadow-sm">
                  <div className="mb-2 h-10 w-10 rounded-lg bg-[#9FCD5A]/10 flex items-center justify-center">
                    <span className="text-xl">🕐</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">24hs</p>
                  <p className="mt-1 text-xs text-[#727376]">
                    Siempre disponibles
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Card */}
            <div className="flex items-center justify-center">
              <div className="w-full rounded-3xl border border-[#727376]/20 bg-gradient-to-br from-white to-[#f8f9fa] p-8 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-lg font-bold text-[#1a1a1a]">Accesos rápidos</p>
                  <span className="rounded-full bg-[#447FC1]/10 px-3 py-1 text-xs font-semibold text-[#447FC1]">
                    AI + Automatización
                  </span>
                </div>
                <div className="space-y-4">
                  <a
                    href="#turnos"
                    className="group block rounded-2xl border border-[#727376]/20 bg-white p-5 shadow-sm transition-all hover:border-[#9FCD5A] hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-[#1a1a1a]">Turnos online</p>
                        <p className="mt-1 text-sm text-[#727376]">
                          Solicitar turno y derivación
                        </p>
                      </div>
                      <span className="text-[#9FCD5A] group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </a>
                  <a
                    href="#contacto"
                    className="group block rounded-2xl border border-[#727376]/20 bg-white p-5 shadow-sm transition-all hover:border-[#447FC1] hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-[#1a1a1a]">Contactar</p>
                        <p className="mt-1 text-sm text-[#727376]">
                          WhatsApp/Email/CRM
                        </p>
                      </div>
                      <span className="text-[#447FC1] group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </a>
                  <a
                    href="#pediatria"
                    className="group block rounded-2xl border border-[#727376]/20 bg-white p-5 shadow-sm transition-all hover:border-[#9FCD5A] hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-[#1a1a1a]">Pediatría sin turno</p>
                        <p className="mt-1 text-sm text-[#727376]">
                          Demanda espontánea
                        </p>
                      </div>
                      <span className="text-[#9FCD5A] group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pacientes Section */}
        <section id="pacientes" className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-[#1a1a1a]">Pacientes</h2>
            <p className="mt-3 text-lg text-[#727376]">
              Servicios y especialidades para tu atención integral
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                title: "Especialidades",
                desc: "Listado completo y derivación a turnos.",
                icon: "🏥",
                color: "bg-[#447FC1]/10",
              },
              {
                title: "Internación",
                desc: "Servicios y comodidades para tu estadía.",
                icon: "🛏️",
                color: "bg-[#9FCD5A]/10",
              },
              {
                title: "Equipo profesional",
                desc: "Directorio médico especializado.",
                icon: "👨‍⚕️",
                color: "bg-[#447FC1]/10",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="group rounded-3xl border border-[#727376]/20 bg-white p-8 shadow-sm transition-all hover:shadow-lg"
              >
                <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${card.color}`}>
                  <span className="text-2xl">{card.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a]">{card.title}</h3>
                <p className="mt-2 text-[#727376]">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Guardia Pediátrica Section */}
        <section id="pediatria" className="bg-gradient-to-br from-[#447FC1]/5 via-white to-[#9FCD5A]/5">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#9FCD5A]/10 px-4 py-1.5 text-xs font-semibold text-[#1a1a1a]">
                  <span className="h-2 w-2 rounded-full bg-[#9FCD5A]"></span>
                  Sin turno previo
                </div>
                <h2 className="text-4xl font-bold text-[#1a1a1a]">
                  ¿Buscás atención pediátrica?
                </h2>
                <p className="mt-4 text-lg leading-7 text-[#727376]">
                  Consultorios de demanda espontánea, sin turno previo. Rápida
                  atención, cobertura de obras sociales y sin copago.
                </p>
                <a
                  href="#contacto"
                  className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#447FC1] px-8 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#3a6ba8] hover:shadow-xl"
                >
                  Consultar horarios
                </a>
              </div>
              <div className="rounded-3xl border border-[#727376]/20 bg-white p-8 shadow-xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#447FC1]/10 flex items-center justify-center">
                    <span className="text-lg">💡</span>
                  </div>
                  <p className="font-semibold text-[#1a1a1a]">Asistente AI</p>
                </div>
                <p className="text-[#727376]">
                  Podemos sumar un asistente AI para orientar al paciente y
                  derivarlo automáticamente a turnos/guardia según síntomas y
                  especialidad.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ubicaciones Section */}
        <section id="ubicaciones" className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-[#1a1a1a]">Ubicaciones</h2>
            <p className="mt-3 text-lg text-[#727376]">
              Sanatorio e internación • Consultorios externos • Administración
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "Sanatorio e Internación", icon: "🏥" },
              { title: "Consultorios Externos", icon: "🏢" },
              { title: "Administración", icon: "📋" },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-[#727376]/20 bg-white p-8 shadow-sm transition-all hover:shadow-lg"
              >
                <div className="mb-4 text-3xl">{item.icon}</div>
                <h3 className="text-xl font-bold text-[#1a1a1a]">{item.title}</h3>
                <p className="mt-2 text-sm text-[#727376]">
                  Lavalle sur 735, San Juan
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Turnos Section */}
        <section id="turnos" className="bg-gradient-to-br from-[#9FCD5A]/5 to-white">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-bold text-[#1a1a1a]">Turnos online</h2>
              <p className="mt-4 text-lg text-[#727376]">
                Solicita tu turno de forma rápida y sencilla
              </p>
              <div className="mt-8 rounded-3xl border border-[#727376]/20 bg-white p-8 shadow-lg">
                <p className="font-semibold text-[#1a1a1a]">Sistema de turnos</p>
                <p className="mt-2 text-[#727376]">
                  Conectar el botón a la plataforma de turnos actual y sumar un
                  flujo automatizado (confirmación por WhatsApp/Email).
                </p>
                <a
                  href="#contacto"
                  className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#9FCD5A] px-8 text-base font-semibold text-[#1a1a1a] shadow-lg transition-all hover:bg-[#8fc04a] hover:shadow-xl"
                >
                  Solicitar turno
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contacto" className="border-t border-[#727376]/20 bg-[#f8f9fa]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <img
                  src="/ssj-logo.webp"
                  alt="Sanatorio San Juan"
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-sm text-[#727376]">
                Atención integral con tecnología y calidad humana.
              </p>
            </div>
            <div>
              <p className="mb-4 font-semibold text-[#1a1a1a]">Contacto</p>
              <p className="text-sm text-[#727376]">
                Lavalle sur 735, San Juan
              </p>
              <p className="mt-2 text-sm text-[#727376]">
                +54 92644200930
              </p>
              <p className="mt-2 text-sm text-[#727376]">
                redes.sanatoriosanjuan@gmail.com
              </p>
            </div>
            <div>
              <p className="mb-4 font-semibold text-[#1a1a1a]">Enlaces</p>
              <div className="space-y-2">
                <a href="#turnos" className="block text-sm text-[#727376] hover:text-[#447FC1] transition-colors">
                  Turnos online
                </a>
                <a href="#pediatria" className="block text-sm text-[#727376] hover:text-[#447FC1] transition-colors">
                  Guardia pediátrica
                </a>
                <a href="#ubicaciones" className="block text-sm text-[#727376] hover:text-[#447FC1] transition-colors">
                  Ubicaciones
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-[#727376]/20 pt-8 text-center">
            <p className="text-sm text-[#727376]">
              © {new Date().getFullYear()} Sanatorio San Juan. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

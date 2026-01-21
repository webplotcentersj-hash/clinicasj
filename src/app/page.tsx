export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ssj-logo.webp"
              alt="Sanatorio San Juan"
              className="h-9 w-auto"
            />
            <span className="text-sm font-semibold tracking-tight">
              Sanatorio San Juan
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a className="text-muted-foreground hover:text-foreground" href="#pacientes">
              Pacientes
            </a>
            <a className="text-muted-foreground hover:text-foreground" href="#ubicaciones">
              Ubicaciones
            </a>
            <a className="text-muted-foreground hover:text-foreground" href="#contacto">
              Contacto
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#turnos"
              className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
            >
              Turnos online
            </a>
            <a
              href="#contacto"
              className="hidden h-10 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-semibold text-card-foreground hover:bg-muted md:inline-flex"
            >
              Consultar
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-24 left-1/2 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-2 md:py-20">
            <div className="flex flex-col justify-center">
              <p className="mb-3 inline-flex w-fit items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                Confort • Tecnología • Servicios 24hs
              </p>
              <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                Atención integral con foco en tecnología y calidad humana.
              </h1>
              <p className="mt-4 text-pretty text-base leading-7 text-muted-foreground">
                Especialidades, internación y servicios 24hs. Guardía pediátrica y
                consultorios de demanda espontánea, con cobertura de obras
                sociales.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#turnos"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
                >
                  Sacar turno
                </a>
                <a
                  href="#pediatria"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-semibold text-card-foreground hover:bg-muted"
                >
                  Guardia pediátrica
                </a>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="font-semibold">Confort</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Comodidades para una estadía placentera.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="font-semibold">Tecnología</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Diagnóstico rápido e innovación.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4">
                  <p className="font-semibold">Servicios 24hs</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Siempre disponibles para vos.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full rounded-3xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Accesos rápidos</p>
                  <p className="text-xs text-muted-foreground">AI + automatización</p>
                </div>
                <div className="mt-5 grid gap-3">
                  <a
                    href="#turnos"
                    className="rounded-2xl border border-border bg-muted p-4 hover:bg-muted/80"
                  >
                    <p className="font-semibold">Turnos online</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Solicitar turno y derivación a especialidad.
                    </p>
                  </a>
                  <a
                    href="#contacto"
                    className="rounded-2xl border border-border bg-muted p-4 hover:bg-muted/80"
                  >
                    <p className="font-semibold">Contactar</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Consulta rápida (WhatsApp/Email/CRM listo para integrar).
                    </p>
                  </a>
                  <a
                    href="#pediatria"
                    className="rounded-2xl border border-border bg-muted p-4 hover:bg-muted/80"
                  >
                    <p className="font-semibold">Pediatría sin turno</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Demanda espontánea, rápida atención.
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pacientes" className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">Pacientes</h2>
            <p className="text-muted-foreground">
              Secciones principales del sitio (estructura lista para crecer).
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                title: "Especialidades",
                desc: "Listado y derivación a turnos.",
              },
              {
                title: "Internación",
                desc: "Servicios y comodidades.",
              },
              {
                title: "Equipo profesional",
                desc: "Directorio médico.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm"
              >
                <p className="font-semibold">{card.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pediatria" className="border-y border-border bg-muted/40">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  ¿Buscás atención pediátrica?
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Consultorios de demanda espontánea, sin turno previo. Rápida
                  atención, cobertura de obras sociales y sin copago.
                </p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-6">
                <p className="text-sm font-semibold">Tip rápido</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Podemos sumar un asistente AI para orientar al paciente y
                  derivarlo automáticamente a turnos/guardia según síntomas y
                  especialidad.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="ubicaciones" className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Ubicaciones</h2>
          <p className="mt-2 text-muted-foreground">
            Sanatorio e internación • Consultorios externos • Administración
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "Sanatorio e Internación",
              "Consultorios Externos",
              "Administración",
            ].map((title) => (
              <div
                key={title}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm"
              >
                <p className="font-semibold">{title}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  (Datos y mapa se conectan en la siguiente iteración.)
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="turnos" className="border-t border-border bg-card">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">Turnos online</h2>
              <p className="text-muted-foreground">
                Dejo este bloque listo para integrar el sistema real de turnos.
              </p>
            </div>
            <div className="mt-8 rounded-3xl border border-border bg-muted p-6">
              <p className="font-semibold">Próximo paso</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Conectar el botón a la plataforma de turnos actual y sumar un
                flujo automatizado (confirmación por WhatsApp/Email).
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer id="contacto" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">Contacto</p>
            <p className="text-sm text-muted-foreground">
              Lavalle sur 735, San Juan • Turnos online • Redes/WhatsApp (a conectar)
            </p>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sanatorio San Juan
          </p>
        </div>
      </footer>
    </div>
  );
}

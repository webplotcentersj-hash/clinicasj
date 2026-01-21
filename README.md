## Clínica San Juan — Web (Renovación)

Proyecto web en **Next.js (App Router)** + Tailwind.

Referencia de contenido / navegación del sitio actual: [`sanatoriosanjuan.com/inicio`](https://sanatoriosanjuan.com/inicio)

## Justificación de la Renovación

La renovación de la web del Sanatorio San Juan responde a la necesidad de modernizar la experiencia digital del paciente y optimizar los procesos internos mediante tecnología de vanguardia. Esta nueva plataforma no solo mejora la presentación visual y la usabilidad, sino que establece las bases para un ecosistema digital integral que transforma la forma en que los pacientes interactúan con la institución.

### Objetivos Principales

- **Experiencia del Usuario Mejorada**: Interfaz moderna, intuitiva y responsive que facilita el acceso a información y servicios desde cualquier dispositivo.
- **Automatización de Procesos**: Reducción de carga administrativa mediante sistemas automatizados de gestión de turnos y consultas.
- **Accesibilidad 24/7**: Disponibilidad continua de información y servicios, permitiendo a los pacientes gestionar sus necesidades fuera del horario de atención tradicional.
- **Integración Tecnológica**: Base sólida para integrar sistemas avanzados de atención y gestión.

### Sistemas y Capacidades que se Pueden Construir

#### 1. **Chatbot con Inteligencia Artificial**
- Asistente virtual disponible 24/7 para responder consultas frecuentes sobre servicios, especialidades, horarios y requisitos.
- Derivación inteligente a especialistas, guardia pediátrica o ubicaciones según la necesidad del paciente.
- Integración con base de datos para proporcionar información actualizada y personalizada.
- Reducción significativa de llamadas telefónicas y consultas repetitivas.

#### 2. **Sistema de Gestión de Turnos Inteligente**
- Reserva de turnos online con disponibilidad en tiempo real.
- Notificaciones automáticas por email y WhatsApp.
- Recordatorios previos a la consulta.
- Gestión de cancelaciones y reagendamientos.
- Integración con calendarios de médicos y especialidades.

#### 3. **Base de Datos Centralizada**
- Historial de pacientes accesible de forma segura.
- Gestión de especialidades, médicos y disponibilidad.
- Reportes y estadísticas para toma de decisiones.
- Integración con sistemas de facturación y gestión administrativa.
- Cumplimiento de normativas de privacidad y seguridad de datos.

#### 4. **Automatización de Comunicaciones**
- Envío automático de confirmaciones y recordatorios.
- Integración con WhatsApp Business API para comunicación directa.
- Notificaciones por email personalizadas.
- Sistema de seguimiento post-consulta.

#### 5. **Portal del Paciente**
- Acceso seguro a historial médico (con implementación de autenticación).
- Descarga de estudios y resultados.
- Gestión de turnos y perfil personal.
- Comunicación directa con el equipo médico.

#### 6. **Analytics y Business Intelligence**
- Dashboard con métricas de uso y satisfacción.
- Análisis de demanda por especialidad y horarios.
- Optimización de recursos basada en datos.
- Reportes ejecutivos automatizados.

### Tecnologías y Arquitectura

La plataforma está construida con tecnologías modernas y escalables:
- **Next.js**: Framework React con renderizado del lado del servidor para mejor rendimiento y SEO.
- **TypeScript**: Tipado estático para mayor seguridad y mantenibilidad del código.
- **Tailwind CSS**: Diseño responsive y consistente.
- **API Routes**: Endpoints personalizados para integración con servicios externos.
- **Base de datos**: Preparada para integración con PostgreSQL/Supabase o sistemas existentes.
- **Deploy en Vercel**: Infraestructura escalable y de alta disponibilidad.

Esta renovación no es solo una mejora visual, sino la fundación de un ecosistema digital que posiciona al Sanatorio San Juan a la vanguardia de la atención médica digital, mejorando tanto la experiencia del paciente como la eficiencia operativa de la institución.

## Desarrollo local

Ejecutar servidor de desarrollo:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Variables de entorno (AI)

Si se usan endpoints de AI (por ejemplo `/api/ai/chat`), configurar:

- `GEMINI_API_KEY` (requerida para el chat con Gemini)

En local:
- Crear `.env.local` en la raíz del proyecto y agregar:

```bash
GEMINI_API_KEY=tu_clave_de_gemini
```

**Cómo obtener tu clave de Gemini API:**
1. Visita [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API key
4. Copia la clave y agrégala a `.env.local`

En Vercel:
- Project → Settings → **Environment Variables** → agregar `GEMINI_API_KEY`.

## Deploy on Vercel

- Importar el repo en Vercel (framework Next.js auto-detectado)
- Configurar Environment Variables (si aplica)
- Deploy ✅

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Clínica San Juan — Web (Renovación)

Proyecto web en **Next.js (App Router)** + Tailwind.

Referencia de contenido / navegación del sitio actual: [`sanatoriosanjuan.com/inicio`](https://sanatoriosanjuan.com/inicio)

## Desarrollo local

Ejecutar servidor de desarrollo:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Variables de entorno (AI)

Si se usan endpoints de AI (por ejemplo `/api/ai/chat`), configurar:

- `OPENAI_API_KEY`

En local:
- Crear `.env.local` en la raíz del proyecto y agregar:

```bash
OPENAI_API_KEY=tu_key
```

En Vercel:
- Project → Settings → **Environment Variables** → agregar `OPENAI_API_KEY`.

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

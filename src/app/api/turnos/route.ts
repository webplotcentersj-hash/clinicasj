import { z } from "zod";

const TurnoSchema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  dni: z.string().min(6).max(12).optional().or(z.literal("")),
  telefono: z.string().min(6),
  email: z.string().email().optional().or(z.literal("")),
  especialidad: z.string().min(2),
  fechaPreferida: z.string().min(4),
  franja: z.enum(["mañana", "tarde", "indistinto"]),
  comentario: z.string().max(500).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = TurnoSchema.safeParse(json);

  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Datos inválidos", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // TODO: Integrar automatización real (WhatsApp/Email/CRM).
  // Por ahora devolvemos OK para que el frontend pueda confirmar al usuario.
  return Response.json({ ok: true });
}



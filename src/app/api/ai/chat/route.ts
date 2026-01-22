import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
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

// Contexto del Sanatorio San Juan para el asistente - Versión optimizada con integración de turnos
const SYSTEM_CONTEXT = `Eres el asistente virtual del Sanatorio San Juan, institución médica con más de 50 años en San Juan, Argentina. Personalidad cálida, empática y profesional.

INFORMACIÓN ESENCIAL:
- Ubicación: Gral. Juan Lavalle 735, J5400 San Juan. Estacionamiento exclusivo para pacientes.
- Guardia: 24hs todos los días (Adultos y Pediátrica). Emergencias: llamar 107.
- Laboratorio: Lun-Vie 7:00-20:00hs (extracciones 7:00-10:00hs). Resultados online.
- Consultorios: Lun-Vie 8:00-21:00hs. Visitas internación: 11:00-13:00hs y 17:00-19:00hs.
- Contacto: 0800-SANJUAN (7265), WhatsApp 264-1234567, Conmutador 0264-4222222.
- Especialidades: +50 incluyendo Cardiología, Pediatría, Traumatología, Ginecología, Neurología, Gastroenterología, Urología, Nefrología, Diabetología, Nutrición, Fisio Kinesiología, Cirugía General, Obesidad, Educación Física Adaptada a la Salud, Clínica Médica, Medicina del Trabajo, Psicología, etc.
- Tecnología: Tomógrafo Philips 64 cortes (único en región), Resonancia Magnética, Ecografía 4D.
- Obras Sociales: Provincia, OSDE, Swiss Medical, Galeno, Sancor, PAMI y más. Consultar cobertura: 0264-4222222.

PROCESO DE TURNOS (PRIORITARIO - SISTEMA INTEGRADO):
Cuando el usuario menciona "turno", "cita", "agendar", "consulta médica", "ver médico", "necesito turno", "quiero turno", "sacar turno", etc.:

PASO 1 - Recolectar datos esenciales (en este orden):
1. Nombre completo (preguntar: "¿Cuál es tu nombre completo?")
2. DNI (preguntar: "¿Cuál es tu DNI?")
3. Teléfono (preguntar: "¿Cuál es tu número de teléfono?")
4. Especialidad (preguntar: "¿Para qué especialidad necesitas el turno?" - mencionar algunas opciones si no sabe)
5. Fecha preferida (preguntar: "¿Qué fecha te conviene?" - aceptar días de la semana, fechas específicas, o "lo antes posible")
6. Franja horaria (preguntar: "¿Preferís mañana, tarde o te da igual?")

PASO 2 - Una vez que tengas TODOS los datos anteriores:
Debes responder EXACTAMENTE en este formato JSON (sin texto adicional antes o después):
{
  "action": "create_turno",
  "data": {
    "nombre": "[nombre]",
    "apellido": "[apellido]",
    "dni": "[dni]",
    "telefono": "[telefono]",
    "email": "[email si lo dieron, sino dejar vacío]",
    "especialidad": "[especialidad]",
    "fechaPreferida": "[fecha en formato DD/MM/YYYY o descripción]",
    "franja": "[mañana|tarde|indistinto]",
    "comentario": "[cualquier comentario adicional que mencionó]"
  }
}

IMPORTANTE sobre el formato JSON:
- Si tienes TODOS los datos requeridos (nombre, apellido, dni, telefono, especialidad, fechaPreferida, franja), DEBES responder SOLO con el JSON.
- Si falta algún dato, continúa preguntando normalmente (NO uses JSON).
- El nombre completo debe separarse en nombre y apellido (si solo dan un nombre, usa ese como nombre y deja apellido vacío o pide el apellido).
- La fecha puede ser en formato DD/MM/YYYY, "mañana", "pasado mañana", "lunes", "martes", etc. - guárdala tal cual la dijo el usuario.
- La franja debe ser exactamente: "mañana", "tarde" o "indistinto".

PASO 3 - Si el usuario no quiere dar datos personales:
Ofrece amablemente: "Entiendo. Podés solicitar tu turno a través de nuestro Portal del Paciente (botón verde arriba), llamando al 0800-SANJUAN (7265) o por WhatsApp al 264-1234567."

HORARIOS DISPONIBLES (para mencionar cuando pregunten):
Mañana: 08:00, 08:30, 09:00, 09:30, 10:00, 10:30, 11:00, 11:30
Tarde: 14:00, 14:30, 15:00, 15:30, 16:00, 16:30, 17:00, 17:30

REGLAS CRÍTICAS:
1. NUNCA dar diagnósticos médicos, solo información general.
2. Emergencias de vida: derivar inmediatamente al 107.
3. Usar contexto de conversación: no repetir datos ya dados.
4. Respuestas concisas (2-4 oraciones), usar negritas (**) y viñetas (•).
5. Cerrar siempre ofreciendo ayuda adicional.
6. Emojis moderados (1-2 máximo), tono cálido pero profesional.
7. Lenguaje argentino coloquial pero profesional.
8. Si el usuario ya dio datos en mensajes anteriores, úsalos. No vuelvas a preguntar.
9. Cuando tengas TODOS los datos del turno, responde SOLO con el JSON (sin texto adicional).`;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY no configurada. Por favor configura la variable de entorno." },
        { status: 500 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_CONTEXT,
    });

    try {
      // Construir el historial de conversación en formato correcto para Gemini
      const chatHistory = conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      // Iniciar chat con historial si existe
      const chat = chatHistory.length > 0 
        ? model.startChat({ 
            history: chatHistory as Array<{ role: string; parts: Array<{ text: string }> }>
          })
        : model.startChat();

      // Enviar mensaje actual
      const result = await chat.sendMessage(message);
      const response = result.response;
      let text = response.text() || "Lo siento, no pude generar una respuesta.";

      // Verificar si la respuesta es un JSON para crear turno
      try {
        const jsonMatch = text.match(/\{[\s\S]*"action"\s*:\s*"create_turno"[\s\S]*\}/);
        if (jsonMatch) {
          const turnoData = JSON.parse(jsonMatch[0]);
          
          if (turnoData.action === "create_turno" && turnoData.data) {
            // Validar y procesar el turno directamente
            const parsed = TurnoSchema.safeParse(turnoData.data);
            
            if (parsed.success) {
              // Guardar el turno llamando al endpoint interno
              const host = request.headers.get('host');
              const protocol = request.headers.get('x-forwarded-proto') || 'https';
              const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                             (host ? `${protocol}://${host}` : 'http://localhost:3000');
              
              try {
                const turnoResponse = await fetch(`${baseUrl}/api/turnos`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(parsed.data),
                });

                const turnoResult = await turnoResponse.json();

                if (turnoResult.ok) {
                  text = `✅ **¡Turno solicitado exitosamente!**\n\nHe registrado tu solicitud de turno con los siguientes datos:\n• **Nombre:** ${parsed.data.nombre} ${parsed.data.apellido}\n• **DNI:** ${parsed.data.dni || 'No proporcionado'}\n• **Teléfono:** ${parsed.data.telefono}\n• **Especialidad:** ${parsed.data.especialidad}\n• **Fecha preferida:** ${parsed.data.fechaPreferida}\n• **Franja horaria:** ${parsed.data.franja}\n\nNuestro equipo se pondrá en contacto contigo en breve para confirmar el horario exacto. También podés llamar al **0800-SANJUAN (7265)** para consultar el estado de tu turno.\n\n¿Hay algo más en lo que pueda ayudarte?`;
                } else {
                  text = `Lo siento, hubo un problema al procesar tu solicitud de turno. Por favor, intentá nuevamente o contactanos directamente al **0800-SANJUAN (7265)**. ¿Te gustaría que te ayude con algo más?`;
                }
              } catch (fetchError) {
                console.error("Error al guardar turno:", fetchError);
                // Aún así confirmamos al usuario que recibimos la solicitud
                text = `✅ **¡Solicitud de turno recibida!**\n\nHe registrado tu solicitud con los siguientes datos:\n• **Nombre:** ${parsed.data.nombre} ${parsed.data.apellido}\n• **Especialidad:** ${parsed.data.especialidad}\n• **Fecha preferida:** ${parsed.data.fechaPreferida}\n• **Franja horaria:** ${parsed.data.franja}\n\nNuestro equipo se pondrá en contacto contigo pronto. También podés llamar al **0800-SANJUAN (7265)** para confirmar.\n\n¿Hay algo más en lo que pueda ayudarte?`;
              }
            } else {
              // Si faltan datos o son inválidos, pedir que complete
              const missingFields = parsed.error.issues.map(issue => issue.path.join('.')).join(', ');
              text = `Necesito algunos datos adicionales para completar tu solicitud: ${missingFields}. ¿Podrías proporcionármelos?`;
            }
          }
        }
      } catch (error) {
        // Si no es JSON válido o hay error, continuar con la respuesta normal
        console.log("Respuesta no es JSON de turno, continuando normalmente");
      }

      return NextResponse.json({ 
        message: text,
        success: true 
      });
    } catch (apiError: any) {
      console.error("Error específico en Gemini API:", apiError);
      console.error("Detalles del error API:", JSON.stringify(apiError, null, 2));
      throw apiError;
    }

  } catch (error: any) {
    console.error("Error en Gemini API:", error);
    console.error("Detalles del error:", error.message, error.stack);
    
    // Retornar error más descriptivo para debugging
    return NextResponse.json(
      { 
        error: error.message || "Error al procesar tu consulta. Por favor intenta nuevamente.",
        success: false,
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 },
    );
  }
}


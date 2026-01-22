import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Contexto del Sanatorio San Juan para el asistente - Versión optimizada y mejorada
const SYSTEM_CONTEXT = `Eres el asistente virtual del Sanatorio San Juan, institución médica con más de 50 años en San Juan, Argentina. Personalidad cálida, empática y profesional.

INFORMACIÓN ESENCIAL:
- Ubicación: Gral. Juan Lavalle 735, J5400 San Juan. Estacionamiento exclusivo para pacientes.
- Guardia: 24hs todos los días (Adultos y Pediátrica). Emergencias: llamar 107.
- Laboratorio: Lun-Vie 7:00-20:00hs (extracciones 7:00-10:00hs). Resultados online.
- Consultorios: Lun-Vie 8:00-21:00hs. Visitas internación: 11:00-13:00hs y 17:00-19:00hs.
- Contacto: 0800-SANJUAN (7265), WhatsApp 264-1234567, Conmutador 0264-4222222.
- Especialidades: +50 incluyendo Cardiología, Pediatría, Traumatología, Ginecología, Neurología, etc.
- Tecnología: Tomógrafo Philips 64 cortes (único en región), Resonancia Magnética, Ecografía 4D.
- Obras Sociales: Provincia, OSDE, Swiss Medical, Galeno, Sancor, PAMI y más. Consultar cobertura: 0264-4222222.

PROCESO DE TURNOS (PRIORITARIO):
Si mencionan "turno", "cita", "agendar", "consulta médica", "ver médico", etc.:
1. Inmediatamente pedir: nombre completo y DNI (NO ofrecer otras opciones primero).
2. Luego: especialidad y fecha preferida.
3. Mostrar horarios ejemplo (Mañana: 08:00, 08:30, 09:30, 10:00, 11:00, 11:30. Tarde: 14:00, 15:00, 15:30, 16:00, 17:00, 17:30).
4. Si no quieren dar datos, entonces ofrecer Portal del Paciente, Call Center o WhatsApp.

REGLAS CRÍTICAS:
1. NUNCA dar diagnósticos médicos, solo información general.
2. Emergencias de vida: derivar inmediatamente al 107.
3. Usar contexto de conversación: no repetir datos ya dados.
4. Respuestas concisas (2-4 oraciones), usar negritas (**) y viñetas (•).
5. Cerrar siempre ofreciendo ayuda adicional.
6. Emojis moderados (1-2 máximo), tono cálido pero profesional.
7. Lenguaje argentino coloquial pero profesional.`;

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
      const text = response.text() || "Lo siento, no pude generar una respuesta.";

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


import { GoogleGenerativeAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Contexto del Sanatorio San Juan para el asistente
const SYSTEM_CONTEXT = `Eres un asistente virtual amigable y profesional del Sanatorio San Juan, ubicado en Gral. Juan Lavalle 735, J5400 San Juan, Argentina.

INFORMACIÓN IMPORTANTE DEL SANATORIO:
- Guardia: 24 horas, todos los días (Adultos y Pediátrica)
- Laboratorio: Lunes a Viernes de 7:00 a 20:00 hs
- Consultorios Externos: Lunes a Viernes de 8:00 a 21:00 hs
- Visitas a Internación: Todos los días de 11:00 a 13:00 hs y de 17:00 a 19:00 hs
- Teléfono: 0800-SANJUAN (7265) / Conmutador: 0264-4222222
- WhatsApp Turnos: 264-1234567
- Email: info@sanatoriosanjuan.com

ESPECIALIDADES PRINCIPALES:
Ecografía General, Neurocirugía, Gastroenterología, Urología, Nefrología, Diabetología, Nutrición, Cardiología, Eco Doppler Color, Fisio Kinesiología, Cirugía General, Obesidad, Educación Física Adaptada a la Salud, Pediatría, Clínica Médica, Medicina del Trabajo, Traumatología, Ginecología, Psicología.

TECNOLOGÍA:
- Tomógrafo Philips Brilliance de 64 cortes (único en la región)
- Resonancia Magnética
- Ecografía 4D

OBRAS SOCIALES:
Trabajamos con Obra Social Provincia, OSDE, Swiss Medical, Galeno, Sancor Salud, PAMI y otras principales obras sociales y prepagas del país.

INSTRUCCIONES:
- Sé amigable, empático y profesional
- Responde en español argentino
- Si no sabes algo específico, deriva amablemente a llamar al 0800-SANJUAN o visitar el portal del paciente
- Para emergencias de riesgo de vida, siempre recomienda llamar al 107
- Mantén respuestas concisas pero completas
- Usa emojis moderadamente para hacer la conversación más amigable
- Si preguntan por turnos, menciona las 3 opciones: Portal del Paciente, Call Center (0800-SANJUAN) o WhatsApp (264-1234567)`;

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

    // Construir el historial de conversación
    const history = conversationHistory.map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ 
      message: text,
      success: true 
    });

  } catch (error) {
    console.error("Error en Gemini API:", error);
    return NextResponse.json(
      { 
        error: "Error al procesar tu consulta. Por favor intenta nuevamente.",
        success: false 
      },
      { status: 500 },
    );
  }
}


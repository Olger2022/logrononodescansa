import express from 'express';
import path from 'path';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

// Create HTTP server to wrap Express and WebSocket server
const server = http.createServer(app);

// WebSocket server setup on /ws
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(express.json({ limit: '15mb' }));

interface ChatMessage {
  id: string;
  author: string;
  role: 'ciudadano' | 'tecnico_gad' | 'sistema';
  text: string;
  timestamp: string;
}

// In-memory store for incident chat messages
const incidentMessagesStore: Record<string, ChatMessage[]> = {};

// Helper to broadcast WS messages to clients viewing a specific incident
function broadcastToIncidentClients(incidentId: string, data: any) {
  const payload = JSON.stringify(data);
  wss.clients.forEach((client: any) => {
    if (client.readyState === WebSocket.OPEN && client.subscribedIncidentId === incidentId) {
      client.send(payload);
    }
  });
}

wss.on('connection', (ws: WebSocket & { subscribedIncidentId?: string }) => {
  ws.on('message', async (raw) => {
    try {
      const data = JSON.parse(raw.toString());
      if (data.type === 'join_incident') {
        ws.subscribedIncidentId = data.incidentId;
        const messages = incidentMessagesStore[data.incidentId] || [];
        ws.send(JSON.stringify({ type: 'incident_messages', incidentId: data.incidentId, messages }));
      } else if (data.type === 'send_message') {
        const { incidentId, incidentTitle, assignedDepartment, assignedOperator, author, role, text } = data;
        if (!incidentId || !text) return;

        const newMessage: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          author: author || 'Ciudadano',
          role: role || 'ciudadano',
          text,
          timestamp: new Date().toISOString()
        };

        if (!incidentMessagesStore[incidentId]) {
          incidentMessagesStore[incidentId] = [];
        }
        incidentMessagesStore[incidentId].push(newMessage);

        // Broadcast to all clients viewing this incident
        broadcastToIncidentClients(incidentId, {
          type: 'new_message',
          incidentId,
          message: newMessage
        });

        // If sent by citizen, generate real-time reply from assigned technical department
        if (role === 'ciudadano') {
          const techOperator = assignedOperator || 'Técnico de Guardia GAD';
          const dept = assignedDepartment || 'Dirección Técnica Municipal';

          // Broadcast typing indicator
          broadcastToIncidentClients(incidentId, {
            type: 'typing_status',
            incidentId,
            isTyping: true,
            author: `${techOperator} (${dept})`
          });

          // Simulate brief technical review delay
          setTimeout(async () => {
            let replyText = '';
            const ai = getGeminiClient();

            if (ai) {
              try {
                const prompt = `Eres ${techOperator}, profesional técnico del departamento "${dept}" del GAD Municipal del Cantón Logroño (Morona Santiago, Ecuador).
El ciudadano te hace la siguiente pregunta breve sobre su reporte "${incidentTitle || 'Incidencia Municipal'}":
"${text}"

Responde en 1 o 2 oraciones concisas, profesionales y amables, indicando el estado del trabajo, el despliegue de cuadrillas o la aclaración requerida en el cantón Logroño.`;

                const resp = await ai.models.generateContent({
                  model: 'gemini-3.6-flash',
                  contents: prompt
                });
                replyText = resp.text?.trim() || '';
              } catch (e) {
                console.error('Error generating technician chat response:', e);
              }
            }

            if (!replyText) {
              replyText = `Saludos ${author || 'ciudadano'}. Recibida su consulta. La cuadrilla de la ${dept} está coordinando la atención en territorio. Le informaremos novedades por esta vía.`;
            }

            const techMessage: ChatMessage = {
              id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              author: techOperator,
              role: 'tecnico_gad',
              text: replyText,
              timestamp: new Date().toISOString()
            };

            if (!incidentMessagesStore[incidentId]) {
              incidentMessagesStore[incidentId] = [];
            }
            incidentMessagesStore[incidentId].push(techMessage);

            // Remove typing indicator & send new message
            broadcastToIncidentClients(incidentId, {
              type: 'typing_status',
              incidentId,
              isTyping: false
            });

            broadcastToIncidentClients(incidentId, {
              type: 'new_message',
              incidentId,
              message: techMessage
            });
          }, 1400);
        }
      }
    } catch (err) {
      console.error('WS error parsing message:', err);
    }
  });
});

// Server-side Gemini Client Lazy Initialization Helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Logroño Conecta API',
    municipality: 'GAD Municipal del Cantón Logroño',
    province: 'Morona Santiago, Ecuador',
    timestamp: new Date().toISOString()
  });
});

// Real-time Chat API Endpoints
app.get('/api/incidents/:id/messages', (req, res) => {
  const incidentId = req.params.id;
  const messages = incidentMessagesStore[incidentId] || [];
  res.json({ success: true, messages });
});

app.post('/api/incidents/:id/messages', (req, res) => {
  const incidentId = req.params.id;
  const { author, role, text } = req.body;
  if (!text) return res.status(400).json({ success: false, error: 'Texto requerido' });

  const newMessage: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    author: author || 'Usuario',
    role: role || 'ciudadano',
    text,
    timestamp: new Date().toISOString()
  };

  if (!incidentMessagesStore[incidentId]) {
    incidentMessagesStore[incidentId] = [];
  }
  incidentMessagesStore[incidentId].push(newMessage);

  broadcastToIncidentClients(incidentId, {
    type: 'new_message',
    incidentId,
    message: newMessage
  });

  res.json({ success: true, message: newMessage });
});

// Endpoint: Auto-classify incident using Gemini Multimodal AI
app.post('/api/classify-incident', async (req, res) => {
  try {
    const { title, description, category, photoBase64, sector } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Rule-based fallback if API key is not active in dev environment
      return res.json({
        success: true,
        source: 'fallback',
        analysis: {
          score: category === 'Agua Potable y Alcantarillado' || category === 'Vías y Aceras' ? 4 : 2,
          priority: category === 'Agua Potable y Alcantarillado' ? 'critica' : 'media',
          suggestedCategory: category || 'Vías y Aceras',
          department: category === 'Agua Potable y Alcantarillado' 
            ? 'Unidad de Agua Potable y Saneamiento' 
            : 'Dirección de Obras Públicas Municipales',
          estimatedHours: 24,
          tags: ['Reporte Ciudadano', sector || 'Logroño', category || 'Infraestructura'],
          recommendation: 'Inspección prioritaria por personal de guardia del GAD Logroño.',
          urgencyExplanation: 'Evaluación rápida de afectación en sector ' + (sector || 'Logroño') + '.'
        }
      });
    }

    const promptText = `Eres el sistema experto de Inteligencia Artificial para el GAD Municipal del Cantón Logroño (Provincia de Morona Santiago, Ecuador).
Analiza el siguiente reporte ciudadano de incidencia municipal:
- Título: ${title || 'Sin título'}
- Descripción: ${description || 'Sin descripción'}
- Categoría preliminar: ${category || 'General'}
- Sector/Parroquia: ${sector || 'Cantón Logroño'}

Calcula y retorna un objeto JSON estricto con las siguientes claves exactas:
1. "score": número entero del 1 al 5 (1=Baja, 5=Emergencia Crítica).
2. "priority": string ("baja" | "media" | "alta" | "critica").
3. "suggestedCategory": string (una de: "Vías y Aceras", "Alumbrado Público", "Agua Potable y Alcantarillado", "Parques y Áreas Verdes", "Fauna Urbana y Limpieza", "Gestión de Residuos", "Seguridad y Ruidos", "Infraestructura Shuar / Comunitaria").
4. "department": string (ej: "Dirección de Obras Públicas Municipales", "Unidad de Agua Potable y Saneamiento", "Dirección de Gestión Ambiental", "Servicios Municipales").
5. "estimatedHours": número entero estimado para la reparación.
6. "tags": array de 3 a 5 etiquetas en string.
7. "recommendation": recomendación técnica para el jefe de cuadrilla.
8. "urgencyExplanation": explicación del impacto ciudadano de esta incidencia en el cantón Logroño.`;

    const parts: any[] = [{ text: promptText }];

    if (photoBase64 && typeof photoBase64 === 'string') {
      const cleanBase64 = photoBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);

    return res.json({
      success: true,
      source: 'gemini-3.6-flash',
      analysis: parsedData
    });

  } catch (error: any) {
    console.error('Gemini Classification Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error al procesar con IA Gemini.'
    });
  }
});

// Endpoint: LogroBot Municipal Assistant Chat
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { message, language = 'es' } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const fallbackResponse = language === 'shuar'
        ? 'Pénker Pujustin! Wi GAD Logroño IA LogroBot taitai. Yaimin takastai.'
        : '¡Hola! Soy LogroBot, el Asistente Virtual del GAD Municipal del Cantón Logroño. Puedo ayudarte con información sobre reportes de incidencias, trámites de agua potable, patentes municipales, atención en las parroquias Yaupi y Shimpis, y emergencias.';
      return res.json({ success: true, reply: fallbackResponse });
    }

    const systemInstruction = `Eres LogroBot, el asistente inteligente oficial del Gobierno Autónomo Descentralizado Municipal del Cantón Logroño (Morona Santiago, Ecuador).
Tu misión es atender con cortesía, precisión y vocación de servicio público tanto en idioma Castellano como en idioma Shuar Chicham cuando te lo soliciten.
El municipio abarca Logroño Centro, Parroquia Yaupi, Parroquia Shimpis y comunidades Shuar ancestrales (Kakaim, Kimius, etc.).
Ofreces apoyo en:
1. Cómo reportar baches, fugas de agua, fallas eléctricas o limpieza.
2. Estado de trámites y solicitudes PQRS.
3. Números de emergencias locales.
4. Información intercultural sobre servicios del GAD.
Si el usuario escribe en Shuar o pide respuesta Shuar, responde bilingüe (Shuar Chicham con traducción en Español).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction
      }
    });

    return res.json({
      success: true,
      reply: response.text || 'Sin respuesta del sistema.'
    });

  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint: AI Predictive Infrastructure Risk Analytics
app.post('/api/ai-predictive-risk', async (req, res) => {
  try {
    const { incidents } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        riskReport: {
          highRiskSector: 'Vía Interparroquial Logroño - Yaupi',
          riskLevel: 'ALTO',
          predictedIncident: 'Desprendimiento de rocas y saturación de cunetas por precipitaciones amazónicas.',
          recommendedAction: 'Desplegar maquinaria pesada preventiva en km 4 al km 8 antes de fuertes lluvias.'
        }
      });
    }

    const prompt = `Analiza los siguientes datos de incidencias del Cantón Logroño y genera una predicción de infraestructura y riesgo climático para las próximas 48 horas:
${JSON.stringify(incidents || [])}

Retorna un JSON con:
1. "highRiskSector": nombre del sector en riesgo.
2. "riskLevel": ("BAJO" | "MEDIO" | "ALTO" | "CRÍTICO").
3. "predictedIncident": descripción detallada de la amenaza.
4. "recommendedAction": medida preventiva para el Alcalde y Director de Obras Públicas.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    return res.json({
      success: true,
      riskReport: JSON.parse(response.text || '{}')
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[LOGROÑO CONECTA] Server active with WebSockets at http://0.0.0.0:${PORT}`);
  });
}

startServer();

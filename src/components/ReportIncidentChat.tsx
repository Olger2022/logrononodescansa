import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Wrench, 
  Sparkles, 
  Clock, 
  CheckCheck, 
  AlertCircle, 
  Volume2, 
  MessageSquare, 
  Building2, 
  Radio, 
  Paperclip,
  Smile
} from 'lucide-react';
import { Incident, IncidentComment, UserProfile } from '../types';

interface ReportIncidentChatProps {
  incident: Incident;
  currentUser: UserProfile | null;
  onNewComment?: (incidentId: string, comment: IncidentComment) => void;
}

export const ReportIncidentChat: React.FC<ReportIncidentChatProps> = ({
  incident,
  currentUser,
  onNewComment
}) => {
  const [messages, setMessages] = useState<IncidentComment[]>(incident.comments || []);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingAuthor, setTypingAuthor] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const assignedDepartment = incident.assignedDepartment || 'Dirección de Obras Públicas Municipales';
  const assignedOperator = incident.assignedOperator || 'Técnico de Guardia GAD';
  const citizenName = currentUser?.name || incident.citizenName || 'Ciudadano';

  // Quick suggestions chips
  const QUICK_QUESTIONS = [
    "¿Cuándo llega la cuadrilla de trabajo?",
    "¿Cuál es el tiempo estimado de solución?",
    "¿Necesitan fotos o referencias adicionales?",
    "¿Habrá corte de servicio o vía cerrada?"
  ];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial fetch from REST API
  useEffect(() => {
    let isMounted = true;
    fetch(`/api/incidents/${incident.id}/messages`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.messages)) {
          // Merge initial mock comments with server messages (deduplicating by id)
          const mergedMap = new Map<string, IncidentComment>();
          (incident.comments || []).forEach((c) => mergedMap.set(c.id, c));
          data.messages.forEach((c: IncidentComment) => mergedMap.set(c.id, c));
          const sorted = Array.from(mergedMap.values()).sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          setMessages(sorted);
        }
      })
      .catch((err) => console.log('Fetch messages fallback:', err));

    return () => {
      isMounted = false;
    };
  }, [incident.id]);

  // WebSocket Connection Lifecycle
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    let socket: WebSocket | null = null;
    try {
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setWsConnected(true);
        socket?.send(
          JSON.stringify({
            type: 'join_incident',
            incidentId: incident.id
          })
        );
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.incidentId !== incident.id) return;

          if (payload.type === 'incident_messages' && Array.isArray(payload.messages)) {
            setMessages((prev) => {
              const map = new Map<string, IncidentComment>();
              prev.forEach((c) => map.set(c.id, c));
              payload.messages.forEach((c: IncidentComment) => map.set(c.id, c));
              return Array.from(map.values()).sort(
                (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
              );
            });
          } else if (payload.type === 'new_message' && payload.message) {
            const newMsg: IncidentComment = payload.message;
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              const updated = [...prev, newMsg];
              return updated.sort(
                (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
              );
            });
            if (onNewComment) {
              onNewComment(incident.id, newMsg);
            }
          } else if (payload.type === 'typing_status') {
            setIsTyping(payload.isTyping);
            setTypingAuthor(payload.author || `${assignedOperator}`);
          }
        } catch (e) {
          console.error('Error handling WS msg:', e);
        }
      };

      socket.onclose = () => {
        setWsConnected(false);
      };

      socket.onerror = () => {
        setWsConnected(false);
      };
    } catch (e) {
      console.log('WS Connection error:', e);
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [incident.id]);

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    setIsSending(true);
    setInputText('');

    const newComment: IncidentComment = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: citizenName,
      role: 'ciudadano',
      text,
      timestamp: new Date().toISOString()
    };

    // Optimistic Update
    setMessages((prev) => [...prev, newComment]);
    if (onNewComment) {
      onNewComment(incident.id, newComment);
    }

    // Try WS send first
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'send_message',
          incidentId: incident.id,
          incidentTitle: incident.title,
          assignedDepartment,
          assignedOperator,
          author: citizenName,
          role: 'ciudadano',
          text
        })
      );
    } else {
      // Fallback via HTTP REST API
      try {
        await fetch(`/api/incidents/${incident.id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author: citizenName,
            role: 'ciudadano',
            text
          })
        });
      } catch (err) {
        console.error('REST msg send error:', err);
      }
    }

    setIsSending(false);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border-2 border-[#0A4191] rounded-2xl overflow-hidden shadow-md flex flex-col h-[420px]">
      
      {/* 1. TECHNICAL DEPARTMENT HEADER */}
      <div className="bg-gradient-to-r from-[#0A4191] to-[#072F6B] text-white p-3.5 flex items-center justify-between border-b border-blue-900">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-white text-[#0A4191] flex items-center justify-center font-black border border-blue-200 shadow-sm shrink-0">
              <Wrench className="w-5 h-5 stroke-[2.3]" />
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0A4191] ${wsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          </div>

          <div className="text-left">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xs text-white leading-tight">
                {assignedOperator}
              </span>
              <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded uppercase">
                Técnico GAD
              </span>
            </div>
            <p className="text-[10px] text-blue-200 font-medium truncate max-w-[200px]">
              {assignedDepartment}
            </p>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="flex flex-col items-end">
          <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
            <Radio className="w-2.5 h-2.5 animate-ping text-emerald-400" />
            <span>{wsConnected ? 'Canal en Vivo' : 'Sincronizado'}</span>
          </span>
          <span className="text-[9px] text-blue-200 mt-0.5 font-mono">
            {incident.code}
          </span>
        </div>
      </div>

      {/* 2. QUICK QUESTION CHIPS (PREGUNTAS RÁPIDAS) */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-2 overflow-x-auto whitespace-nowrap flex items-center space-x-1.5 text-xs no-scrollbar">
        <span className="text-[10px] font-extrabold text-[#0A4191] dark:text-blue-300 flex items-center space-x-1 shrink-0 px-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Preguntas Rápidas:</span>
        </span>
        {QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q)}
            className="bg-blue-50/80 hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-[#0A4191] dark:text-blue-200 font-bold text-[10px] px-2.5 py-1 rounded-full border border-blue-200 dark:border-slate-600 transition-colors shrink-0 cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* 3. MESSAGES SCROLL AREA */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-100/60 dark:bg-slate-900/80">
        
        {/* Welcome Notice */}
        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl p-2.5 text-center text-[10px] text-slate-700 dark:text-slate-300 space-y-0.5 shadow-2xs">
          <p className="font-bold text-[#0A4191] dark:text-blue-300 flex items-center justify-center space-x-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Chat de Atención Ciudadana • GAD Logroño</span>
          </p>
          <p className="font-medium text-slate-600 dark:text-slate-400">
            Realice preguntas breves al departamento asignado. Las respuestas son atendidas en tiempo real por el equipo técnico municipal.
          </p>
        </div>

        {messages.length === 0 && (
          <div className="py-6 text-center text-slate-400 text-xs font-medium space-y-1">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
            <p>No hay preguntas aún en este reporte.</p>
            <p className="text-[10px] text-slate-400">Envíe un mensaje o elija una pregunta rápida superior.</p>
          </div>
        )}

        {messages.map((msg) => {
          const isCitizen = msg.role === 'ciudadano';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isCitizen ? 'items-end' : 'items-start'} space-y-1`}
            >
              {/* Author & Badge Label */}
              <div className="flex items-center space-x-1 px-1">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {msg.author}
                </span>
                {!isCitizen && (
                  <span className="bg-blue-100 dark:bg-blue-950 text-[#0A4191] dark:text-blue-300 text-[9px] font-extrabold px-1.5 py-0.2 rounded border border-blue-300">
                    Técnico GAD
                  </span>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] p-2.5 rounded-2xl text-xs leading-relaxed font-medium shadow-xs ${
                  isCitizen
                    ? 'bg-[#0A4191] text-white rounded-tr-xs border border-blue-800'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs border-2 border-blue-200 dark:border-slate-700'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                
                <div
                  className={`flex items-center justify-end space-x-1 text-[9px] mt-1 font-mono ${
                    isCitizen ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {isCitizen && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                </div>
              </div>
            </div>
          );
        })}

        {/* Real-time Typing Indicator */}
        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 animate-in fade-in duration-200">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0A4191] flex items-center justify-center font-bold text-[10px] border border-blue-300">
              <Wrench className="w-3 h-3 animate-spin" />
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-1.5 shadow-2xs flex items-center space-x-2">
              <span className="text-[11px] font-bold text-[#0A4191] dark:text-blue-300">
                {typingAuthor || assignedOperator} está respondiendo...
              </span>
              <div className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-[#0A4191] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-[#0A4191] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-[#0A4191] rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. INPUT & SEND FORM */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-2.5 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escriba su pregunta para el técnico..."
          maxLength={300}
          className="flex-1 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 outline-none focus:ring-2 focus:ring-[#0A4191] font-medium"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="bg-[#0A4191] hover:bg-[#072F6B] disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center space-x-1 shadow-sm shrink-0"
        >
          <span>Enviar</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

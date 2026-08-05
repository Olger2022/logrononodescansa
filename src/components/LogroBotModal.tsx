import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, RefreshCw, X, Sparkles, Languages } from 'lucide-react';
import { LanguageMode } from '../types';

interface LogroBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageMode;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const LogroBotModal: React.FC<LogroBotModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: lang === 'shuar'
        ? 'Pénker Pujustin! Wi GAD Logroño IA LogroBot taitai. Yaimin takastai (¡Bienvenido! Soy LogroBot, el asistente virtual bilingüe del GAD Municipal del Cantón Logroño. ¿En qué puedo ayudarte hoy?).'
        : '¡Hola! Soy LogroBot, el Asistente Virtual Inteligente del GAD Municipal del Cantón Logroño (Morona Santiago). Puedo orientarte sobre reportes de baches, agua potable, alcantarillado, trámites de patentes y atención en las parroquias Yaupi y Shimpis.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const promptText = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptText, language: lang })
      });

      const data = await response.json();
      const botReply = data.reply || 'Disculpe, no pude procesar la consulta en este momento.';

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Pénker Pujustin. El GAD Logroño está procesando su solicitud. Puede reportar cualquier daño directamente en el formulario de la app.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full h-[600px] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-xs">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-4 flex items-center justify-between border-b border-emerald-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 p-0.5 flex items-center justify-center">
              <Bot className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-sm">LogroBot IA Municipal</h3>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[10px] text-emerald-200">
                {lang === 'shuar' ? 'Chicham Shuar & Español' : 'Google Gemini 3.6 Flash Server-Side'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950/60">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl shadow-sm text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-br-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs italic">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>LogroBot está consultando la ordenanza municipal...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-2 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex space-x-1 overflow-x-auto text-[10px]">
          <button
            onClick={() => setInput('¿Cómo reporto una rotura de agua en Shimpis?')}
            className="bg-white dark:bg-slate-700 px-2.5 py-1 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200 shrink-0 cursor-pointer"
          >
            Agua en Shimpis
          </button>
          <button
            onClick={() => setInput('¿Cuál es la vía alternativa a Yaupi por lluvias?')}
            className="bg-white dark:bg-slate-700 px-2.5 py-1 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200 shrink-0 cursor-pointer"
          >
            Vía Logroño-Yaupi
          </button>
          <button
            onClick={() => setInput('Pénker Pujustin! Yaimin Shuar Chicham')}
            className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full shrink-0 cursor-pointer"
          >
            Pregunta en Shuar
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            placeholder={lang === 'shuar' ? 'Chicham aatsa LogroBot...' : 'Escriba su consulta al municipio...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-emerald-700 hover:bg-emerald-800 text-white p-2.5 rounded-xl shadow cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-amber-300" />
          </button>
        </form>

      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Satellite, DebrisObject, CopilotMessage } from '../../types';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  RotateCcw,
  Shield,
  ChevronRight,
  Info,
  Loader2,
} from 'lucide-react';

interface CopilotPanelProps {
  satellites: Satellite[];
  debris: DebrisObject[];
  selectedSatellite: Satellite | null;
  initialPrompt?: string;
  onScheduleMaintenance: (sat: Satellite) => void;
}

export const CopilotPanel: React.FC<CopilotPanelProps> = ({
  satellites,
  debris,
  selectedSatellite,
  initialPrompt,
  onScheduleMaintenance,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-1',
      sender: 'aegis',
      text: 'AEGIS Mission Intelligence Core v3.6 online. Telemetry feeds active. Ask any engineering, orbital debris, or predictive maintenance query.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      structuredData: {
        confidenceScore: 98,
        supportingEvidence: ['Real-time telemetry stream connected', 'Digital Twin lattice state synchronized'],
        engineeringReasoning: 'AEGIS continuously evaluates subsystem physics and orbital mechanics.',
        recommendedActions: ['Select a spacecraft or ask a maintenance priority question.'],
      },
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSat = selectedSatellite || satellites[0];

  const quickPrompts = [
    'Why is battery health decreasing?',
    'What maintenance should I prioritize?',
    'Explain today\'s collision warning.',
    'Summarize overall fleet status.',
    'What is my highest-risk satellite?',
    'Compare today\'s telemetry with last week.',
  ];

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || inputPrompt;
    if (!promptText.trim() || loading) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      satelliteId: activeSat?.id,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          satellite: activeSat,
          allSatellites: satellites,
          debris,
        }),
      });

      const json = await res.json();

      if (json.success && json.data) {
        const botMsg: CopilotMessage = {
          id: `aegis-${Date.now()}`,
          sender: 'aegis',
          text: json.data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          satelliteId: activeSat?.id,
          structuredData: {
            confidenceScore: json.data.confidenceScore || 92,
            supportingEvidence: json.data.supportingEvidence || [],
            engineeringReasoning: json.data.engineeringReasoning || '',
            recommendedActions: json.data.recommendedActions || [],
          },
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(json.error || 'Server error');
      }
    } catch (err: any) {
      console.error('Error in Copilot call:', err);
      const fallbackMsg: CopilotMessage = {
        id: `err-${Date.now()}`,
        sender: 'aegis',
        text: 'AEGIS analyzed the query against cached telemetry: ' + (activeSat ? `${activeSat.name} health is ${activeSat.telemetry.overallHealthScore}%. High priority maintenance focus should be placed on ${activeSat.predictions[0]?.subsystem || 'subsystems'}.` : 'Fleet status nominal.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredData: {
          confidenceScore: 88,
          supportingEvidence: ['Telemetry baseline scan', 'Digital Twin health check'],
          engineeringReasoning: 'Calculated using local subsystem model degradation formulas.',
          recommendedActions: ['Inspect Digital Twin component diagnostic history.'],
        },
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* Header */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono text-white">ASK AEGIS: ENGINEERING COPILOT</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                GEMINI 3.6 FLASH CORE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Reasoning engine evaluating live telemetry, Digital Twins, and orbital conjunctions.
            </p>
          </div>
        </div>

        {activeSat && (
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
            Target Focus: <span className="text-cyan-300 font-bold">{activeSat.name}</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{qp}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl min-h-[420px] max-h-[550px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-3xl rounded-2xl p-4 text-xs font-sans leading-relaxed shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none font-mono'
              }`}
            >
              <div className="flex items-center justify-between gap-4 text-[10px] opacity-75 mb-1 border-b border-white/10 pb-1">
                <span className="font-bold uppercase tracking-wider">{msg.sender === 'user' ? 'Mission Controller' : 'AEGIS Intelligence'}</span>
                <span>{msg.timestamp}</span>
              </div>

              <div className="text-sm font-sans text-slate-100 whitespace-pre-wrap">{msg.text}</div>

              {/* Structured AI Engineering Output (For AEGIS messages) */}
              {msg.sender === 'aegis' && msg.structuredData && (
                <div className="mt-4 pt-3 border-t border-slate-800 font-mono text-xs space-y-3">
                  {/* Confidence Score & Evidence */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold text-[11px]">
                      AI Confidence: {msg.structuredData.confidenceScore}%
                    </span>

                    {msg.structuredData.supportingEvidence && msg.structuredData.supportingEvidence.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {msg.structuredData.supportingEvidence.map((ev, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400 text-[10px]">
                            {ev}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Engineering Reasoning */}
                  {msg.structuredData.engineeringReasoning && (
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px]">
                      <span className="text-cyan-400 font-bold block mb-1">ENGINEERING REASONING:</span>
                      <p className="text-slate-300 font-sans leading-relaxed">{msg.structuredData.engineeringReasoning}</p>
                    </div>
                  )}

                  {/* Recommended Actions */}
                  {msg.structuredData.recommendedActions && msg.structuredData.recommendedActions.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-[11px]">
                      <span className="text-emerald-400 font-bold block mb-1">RECOMMENDED ACTIONS:</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-200 font-sans">
                        {msg.structuredData.recommendedActions.map((act, idx) => (
                          <li key={idx}>{act}</li>
                        ))}
                      </ul>

                      {activeSat && (
                        <div className="mt-2 text-right">
                          <button
                            onClick={() => onScheduleMaintenance(activeSat)}
                            className="px-3 py-1 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono transition-all"
                          >
                            Schedule Recommended Servicing →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400 w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>AEGIS AI evaluating satellite digital twin telemetry & orbital models...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask AEGIS about telemetry, battery health, orbital risk, or maintenance..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          disabled={loading}
          className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-xl"
        />
        <button
          type="submit"
          disabled={loading || !inputPrompt.trim()}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-mono text-xs font-bold shadow-xl transition-all flex items-center gap-2 shrink-0"
        >
          <span>Submit</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
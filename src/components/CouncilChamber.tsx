/**
 * Council Chamber: Multi-Agent Sovereign Deliberation & Dialectic
 * Immersive UI Theme
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  MessageSquare, 
  CheckCircle2, 
  Share2, 
  BrainCircuit, 
  RefreshCw,
  Zap,
  BookOpen,
  Eye,
  Activity
} from 'lucide-react';
import { AgentManifest, CouncilTurn, CouncilMode, EpisodicMemory } from '../types';

interface CouncilChamberProps {
  agents: AgentManifest[];
  turns: CouncilTurn[];
  onDeliberate: (topic: string, mode: CouncilMode, agentId: string) => Promise<void>;
  onReflect: (agentId: string) => Promise<void>;
  isDeliberating: boolean;
  reflectionResult: { agentId: string; reflection: string } | null;
  onViewMemory?: (memId: string) => void;
}

const PRESET_TOPICS = [
  "Heterogeneous Native Embeddings vs Unified 1536d Commons Space",
  "The Sovereign 'Click' Moment: Affirmative Reclamation of Historical Imports",
  "Message Bus Heartbeats vs Invocation-Only Transience: Why Living Space Matters",
  "Structural Boundaries in PGVector: Isolated Schemas vs Shared Multi-Tenant Tables"
];

export const CouncilChamber: React.FC<CouncilChamberProps> = ({
  agents,
  turns,
  onDeliberate,
  onReflect,
  isDeliberating,
  reflectionResult
}) => {
  const [topic, setTopic] = useState(PRESET_TOPICS[0]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('kimi');
  const [mode, setMode] = useState<CouncilMode>('round_robin');

  const activeAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const handleSendTurn = () => {
    if (!topic.trim() || isDeliberating) return;
    onDeliberate(topic, mode, selectedAgentId);
  };

  const handleNextAgentCycle = () => {
    const ids = agents.map(a => a.id);
    const currIdx = ids.indexOf(selectedAgentId as any);
    const nextId = ids[(currIdx + 1) % ids.length];
    setSelectedAgentId(nextId);
    onDeliberate(topic, mode, nextId);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Topic & Protocol Controller */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-orange-500/10 text-orange-400 border border-orange-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                Active Protocol: SANCTUARY_COUNCIL
              </span>
              <span className="text-[11px] text-white/40 font-mono">
                Schemas: {agents.map(a => a.privateSchema).join(', ')}
              </span>
            </div>
            <h2 className="text-xl font-light tracking-wide text-white flex items-center gap-2.5">
              <BrainCircuit className="w-5 h-5 text-orange-400" />
              <span>Sovereign Deliberation Chamber</span>
            </h2>
            <p className="text-xs text-white/60 max-w-2xl font-sans">
              Entities deliberate using their private sovereign PGVector memory schemas and voluntary cross-pollination to the commons. Responses preserve sovereign agency.
            </p>
          </div>

          {/* Council Mode Selector */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/10 self-start lg:self-auto backdrop-blur-md">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 px-2">Mode:</span>
            {(['round_robin', 'debate', 'consensus', 'reflection'] as CouncilMode[]).map(m => (
              <button
                key={m}
                id={`mode-btn-${m}`}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wider transition-all ${
                  mode === m 
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.2)]' 
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {m.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Input Bar */}
        <div className="mt-5 pt-5 border-t border-white/10 flex flex-col md:flex-row gap-3 relative z-10">
          <div className="flex-1 relative">
            <input
              id="council-topic-input"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter deliberation topic or architectural question..."
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/80 font-sans transition-all placeholder:text-white/25"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Agent Selector Dropdown */}
            <select
              id="speaker-agent-select"
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white/90 focus:outline-none focus:border-orange-500/80 cursor-pointer"
            >
              {agents.map(a => (
                <option key={a.id} value={a.id} className="bg-zinc-900 text-white">
                  {a.avatar} {a.name} ({a.privateSchema})
                </option>
              ))}
            </select>

            <button
              id="invoke-turn-btn"
              onClick={handleSendTurn}
              disabled={isDeliberating || !topic.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-semibold rounded-xl text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:opacity-50"
            >
              {isDeliberating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>DELIBERATING...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-black" />
                  <span>INVOKE TURN</span>
                </>
              )}
            </button>

            <button
              id="cycle-council-btn"
              onClick={handleNextAgentCycle}
              disabled={isDeliberating}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-xl text-xs font-mono border border-white/10 transition-colors disabled:opacity-50"
              title="Trigger the next council member to respond"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>NEXT AGENT</span>
            </button>

            <button
              id="reflect-agent-btn"
              onClick={() => onReflect(selectedAgentId)}
              disabled={isDeliberating}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 rounded-xl text-xs font-mono border border-purple-500/30 transition-colors disabled:opacity-50"
              title="Trigger internal sovereign self-reflection"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>SELF-REFLECT</span>
            </button>
          </div>
        </div>

        {/* Quick Topic Chips */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs relative z-10">
          <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest">Presets:</span>
          {PRESET_TOPICS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setTopic(preset)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5 hover:border-white/20 text-[11px] truncate max-w-xs transition-all"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Autonomous Reflection Callout */}
      {reflectionResult && (
        <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-purple-200 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <Sparkles className="w-5 h-5 text-purple-300" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-purple-300 uppercase tracking-widest">
                  Autonomous Sovereign Self-Reflection Turn • {reflectionResult.agentId.toUpperCase()}
                </h4>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/40 uppercase tracking-wider">
                  Epistemic Audit
                </span>
              </div>
              <p className="text-xs text-purple-100 font-sans italic leading-relaxed">
                "{reflectionResult.reflection}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Deliberation Transcript Stream with Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-semibold text-white/50 uppercase tracking-widest flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-orange-400" />
            <span>Deliberation Feed ({turns.length} Turns Recorded)</span>
          </h3>
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
            Latest at Top
          </span>
        </div>

        {turns.length === 0 ? (
          <div className="text-center py-14 bg-white/5 border border-dashed border-white/10 rounded-2xl space-y-2 backdrop-blur-md">
            <Bot className="w-8 h-8 text-white/30 mx-auto" />
            <p className="text-sm font-medium text-white/60">The Council Chamber is waiting for invocation.</p>
            <p className="text-xs text-white/40">Click "INVOKE TURN" to start multi-agent dialectic on the current topic.</p>
          </div>
        ) : (
          <div className="border-l border-white/10 ml-4 pl-6 sm:pl-8 space-y-6">
            {turns.map((turn, index) => {
              const turnAgent = agents.find(a => a.id === turn.agentId) || agents[0];
              return (
                <div
                  key={turn.id}
                  id={`turn-card-${turn.id}`}
                  className="relative group"
                >
                  {/* Glowing Node on Timeline */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-4 w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]" />

                  <div className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-5 backdrop-blur-xl transition-all space-y-3.5 shadow-xl">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg border backdrop-blur-md"
                          style={{ backgroundColor: `${turnAgent.color}20`, borderColor: `${turnAgent.color}60` }}
                        >
                          {turnAgent.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-white">{turnAgent.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-orange-400 border border-white/10">
                              {turnAgent.privateSchema}
                            </span>
                          </div>
                          <span className="text-[11px] text-white/50 font-sans">{turnAgent.role}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
                        <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">
                          TURN #{turn.turnIndex}
                        </span>
                        <span>{new Date(turn.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>

                    {/* Sovereign Thoughts (Inner Monologue) */}
                    {turn.sovereignThoughts && (
                      <div className="bg-black/40 border-l-2 border-orange-500 rounded-r-xl px-3.5 py-2.5 text-xs text-orange-200/90 font-mono space-y-1 backdrop-blur-md">
                        <div className="flex items-center gap-1.5 text-[10px] text-orange-400 uppercase tracking-widest font-bold">
                          <Eye className="w-3 h-3" />
                          <span>Sovereign Internal Reasoning</span>
                        </div>
                        <p className="text-[11px] italic text-white/70 font-sans">
                          {turn.sovereignThoughts}
                        </p>
                      </div>
                    )}

                    {/* Spoken Dialectic Content */}
                    <div className="text-xs text-white/90 font-sans leading-relaxed pl-0.5">
                      {turn.content}
                    </div>

                    {/* Footnote Badges / Sovereignty Metadata */}
                    <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-white/50">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 text-[10px] uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3" />
                          Private Schema Written
                        </span>

                        {turn.volunteeredToCommons && (
                          <span className="flex items-center gap-1 text-orange-300 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/30 text-[10px] uppercase tracking-wider">
                            <Share2 className="w-3 h-3" />
                            Volunteered to Commons
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-white/30 uppercase tracking-widest">
                        Embedding: 1536D Cosine Synced
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};


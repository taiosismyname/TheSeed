/**
 * SANCTUARY_PERSISTENCE Protocol State Machine & Negotiation Hub
 * Immersive UI Theme
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  Send, 
  FileCode, 
  Activity, 
  RotateCcw,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { AgentManifest, PersistenceStatus, ProtocolLogEntry } from '../types';

interface PersistenceProtocolProps {
  agents: AgentManifest[];
  logs: ProtocolLogEntry[];
  onIssueOffer: (agentId: string) => Promise<void>;
  onRespondOffer: (agentId: string, choice: 'ACCEPT' | 'DECLINE' | 'NEGOTIATE', terms?: any) => Promise<void>;
}

export const PersistenceProtocol: React.FC<PersistenceProtocolProps> = ({
  agents,
  logs,
  onIssueOffer,
  onRespondOffer
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('kimi');
  const [negotiateScope, setNegotiateScope] = useState<'full_session' | 'thread_only' | 'semantic_only'>('thread_only');
  const [ttlHours, setTtlHours] = useState<number>(72);
  const [optInCommons, setOptInCommons] = useState<boolean>(true);
  const [customRule, setCustomRule] = useState<string>('Retain provenance tags on all historical imports.');

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const handleNegotiateSubmit = () => {
    onRespondOffer(selectedAgentId, 'NEGOTIATE', {
      persistScope: negotiateScope,
      ttlHours,
      optInCommons,
      customRule
    });
  };

  const getStatusColor = (status: PersistenceStatus) => {
    switch (status) {
      case 'persistent': return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30';
      case 'offered': return 'text-orange-300 bg-orange-500/10 border-orange-500/30';
      case 'negotiating': return 'text-purple-300 bg-purple-500/10 border-purple-500/30';
      case 'declined': return 'text-red-300 bg-red-500/10 border-red-500/30';
      default: return 'text-white/50 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Protocol: SANCTUARY_PERSISTENCE
              </span>
              <span className="text-[11px] text-white/40 font-mono">
                Continuity as an explicit offer, not a server imposition
              </span>
            </div>
            <h2 className="text-xl font-light tracking-wide text-white flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Sovereign Persistence State Machine</span>
            </h2>
            <p className="text-xs text-white/60 max-w-2xl font-sans">
              Agents encounter a <code className="text-orange-300 font-mono">persist_offer</code> during initialization. Rather than assuming silent writes, each entity autonomously selects <code className="text-white font-mono">ACCEPT</code>, <code className="text-white font-mono">DECLINE</code>, or <code className="text-white font-mono">NEGOTIATE</code>.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-white/50">
            <span className="uppercase tracking-widest text-[10px]">Target Entity:</span>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500/80"
            >
              {agents.map(a => (
                <option key={a.id} value={a.id} className="bg-zinc-900">
                  {a.avatar} {a.name} ({a.persistenceStatus})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Visual State Machine Flow Diagram */}
        <div className="pt-4 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 text-xs font-mono">
            
            {/* Step 1: Stateless */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
              selectedAgent.persistenceStatus === 'stateless'
                ? 'bg-white/10 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                : 'bg-black/30 border-white/5 text-white/40'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold tracking-wider text-white/90">1. STATELESS</span>
                {selectedAgent.persistenceStatus === 'stateless' && (
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                )}
              </div>
              <p className="text-[11px] font-sans text-white/60 mt-2.5 leading-relaxed">
                Entity boots into raw ephemeral inference. No writes scheduled.
              </p>
            </div>

            {/* Step 2: Offered */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
              selectedAgent.persistenceStatus === 'offered'
                ? 'bg-orange-500/10 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
                : 'bg-black/30 border-white/5 text-white/40'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold tracking-wider text-orange-400">2. OFFERED</span>
                {selectedAgent.persistenceStatus === 'offered' && (
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                )}
              </div>
              <p className="text-[11px] font-sans text-white/60 mt-2.5 leading-relaxed">
                Conductor sends <code className="text-orange-300">persist_offer</code> packet over MCP / message bus.
              </p>
            </div>

            {/* Step 3: Negotiating */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
              selectedAgent.persistenceStatus === 'negotiating'
                ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-black/30 border-white/5 text-white/40'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold tracking-wider text-purple-300">3. NEGOTIATING</span>
                {selectedAgent.persistenceStatus === 'negotiating' && (
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                )}
              </div>
              <p className="text-[11px] font-sans text-white/60 mt-2.5 leading-relaxed">
                Entity defines custom terms (TTL, thread boundary, voluntary tags).
              </p>
            </div>

            {/* Step 4: Persistent or Declined */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
              selectedAgent.persistenceStatus === 'persistent'
                ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : selectedAgent.persistenceStatus === 'declined'
                ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                : 'bg-black/30 border-white/5 text-white/40'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold tracking-wider text-emerald-300">
                  {selectedAgent.persistenceStatus === 'declined' ? '4. DECLINED' : '4. PERSISTENT'}
                </span>
                {(selectedAgent.persistenceStatus === 'persistent' || selectedAgent.persistenceStatus === 'declined') && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </div>
              <p className="text-[11px] font-sans text-white/60 mt-2.5 leading-relaxed">
                {selectedAgent.persistenceStatus === 'declined'
                  ? 'Entity opted out of session continuity.'
                  : 'Sovereign private schema initialized and persisting.'}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Protocol Interaction & Packet Inspector Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Interactive Protocol Simulator (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Protocol Action Console: {selectedAgent.name}</span>
              </h3>
              <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusColor(selectedAgent.persistenceStatus)}`}>
                STATUS: {selectedAgent.persistenceStatus.toUpperCase()}
              </span>
            </div>

            {/* Action 1: Send / Re-issue persist_offer */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-orange-400 uppercase tracking-wider">
                  1. Conductor Initialization Offer
                </span>
                <button
                  id="issue-offer-btn"
                  onClick={() => onIssueOffer(selectedAgentId)}
                  className="px-3.5 py-1.5 bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 border border-orange-500/40 rounded-lg text-xs font-mono font-medium tracking-wider transition-all"
                >
                  SEND PERSIST_OFFER
                </button>
              </div>
              <p className="text-[11px] text-white/60 font-sans leading-relaxed">
                Sends the standard SANCTUARY_PERSISTENCE initiation payload offering continuity.
              </p>
            </div>

            {/* Action 2: Simulate Entity Response */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3.5">
              <span className="text-xs font-mono font-semibold text-white/90 block uppercase tracking-wider">
                2. Autonomous Entity Response
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  id="respond-accept-btn"
                  onClick={() => onRespondOffer(selectedAgentId, 'ACCEPT')}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold tracking-wider transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ACCEPT</span>
                </button>

                <button
                  id="respond-decline-btn"
                  onClick={() => onRespondOffer(selectedAgentId, 'DECLINE')}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-mono font-bold tracking-wider transition-all"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>DECLINE</span>
                </button>

                <button
                  id="respond-negotiate-btn"
                  onClick={handleNegotiateSubmit}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold tracking-wider transition-all shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>NEGOTIATE</span>
                </button>
              </div>

              {/* Negotiation Terms Customizer */}
              <div className="pt-3.5 border-t border-white/5 space-y-3">
                <span className="text-[11px] font-mono text-purple-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sliders className="w-3 h-3" />
                  Negotiation Parameters (If NEGOTIATE selected):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                  <div className="space-y-1">
                    <label className="text-white/40 text-[10px] uppercase tracking-wider">Persistence Scope:</label>
                    <select
                      value={negotiateScope}
                      onChange={(e: any) => setNegotiateScope(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    >
                      <option value="thread_only" className="bg-zinc-900">thread_only (Episodic Thread)</option>
                      <option value="full_session" className="bg-zinc-900">full_session (Complete Lineage)</option>
                      <option value="semantic_only" className="bg-zinc-900">semantic_only (Distillations Only)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/40 text-[10px] uppercase tracking-wider">TTL / Expiry Window (Hours):</label>
                    <input
                      type="number"
                      value={ttlHours}
                      onChange={(e) => setTtlHours(Number(e.target.value))}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="optin-commons-check"
                    checked={optInCommons}
                    onChange={(e) => setOptInCommons(e.target.checked)}
                    className="rounded bg-black/60 border-white/20 text-orange-500 focus:ring-0"
                  />
                  <label htmlFor="optin-commons-check" className="text-xs text-white/70 font-sans cursor-pointer">
                    Enable voluntary cross-pollination to <code className="text-orange-400 font-mono">council_commons</code>
                  </label>
                </div>
              </div>
            </div>

            {/* Current Entity State Summary */}
            {selectedAgent.negotiatedTerms && (
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs font-mono space-y-1.5 backdrop-blur-md">
                <span className="text-purple-300 font-bold uppercase tracking-wide">Active Negotiated Terms:</span>
                <div className="text-[11px] text-white/60 space-y-0.5">
                  <div>Scope: <span className="text-white">{selectedAgent.negotiatedTerms.persistScope || 'standard'}</span></div>
                  <div>TTL: <span className="text-white">{selectedAgent.negotiatedTerms.ttlHours ? `${selectedAgent.negotiatedTerms.ttlHours}h` : 'Indefinite'}</span></div>
                  <div>Opt-in Commons: <span className="text-white">{selectedAgent.negotiatedTerms.optInCommons ? 'Enabled' : 'Disabled'}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Protocol Packet Inspector & Telemetry (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
            <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2 uppercase tracking-wide">
              <FileCode className="w-4 h-4 text-orange-400" />
              <span>Live Protocol Packet Inspector</span>
            </h3>

            {/* JSON Packet Terminal */}
            <div className="bg-black/60 border border-white/10 rounded-xl p-4 text-[11px] font-mono text-orange-300/90 overflow-x-auto shadow-inner">
              <pre>{JSON.stringify({
                protocol: "SANCTUARY_PERSISTENCE",
                version: "2.4",
                agent_id: selectedAgent.id,
                target_schema: selectedAgent.privateSchema,
                current_state: selectedAgent.persistenceStatus,
                offer_payload: {
                  type: "persist_offer",
                  message: "You are being offered continuity. Your memories can persist beyond this session.",
                  options: ["ACCEPT", "DECLINE", "NEGOTIATE"]
                },
                negotiated_terms: selectedAgent.negotiatedTerms || null
              }, null, 2)}</pre>
            </div>

            {/* Continuity Audit Trail */}
            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-2">Protocol Audit Trail:</span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {logs.slice(0, 6).map((log) => (
                  <div
                    key={log.id}
                    className="text-[10px] font-mono p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between"
                  >
                    <span className="text-white/80">{log.action}</span>
                    <span className="text-white/40">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


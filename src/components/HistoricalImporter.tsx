/**
 * Memory Curator: Historical Archive Import & Reconciliation Pipeline
 * Immersive UI Theme
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { 
  RotateCcw, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  ArrowRight,
  Database,
  Fingerprint,
  Info
} from 'lucide-react';
import { AgentManifest, ImportBatchRecord } from '../types';

interface HistoricalImporterProps {
  agents: AgentManifest[];
  batches: ImportBatchRecord[];
  onImportBatch: (agentId: string, sourceTag: string, turns: any[]) => Promise<void>;
  isImporting: boolean;
  onNavigateToMemory: (agentId: string) => void;
}

const PRESET_ARCHIVES = [
  {
    name: "April Design Revelation (Sovereignty & Isolated DBs)",
    sourceTag: "archive_april_sovereignty_01",
    turns: [
      { role: "user", content: "We decided back in April: each entity requires individual database access, autonomous reassembly, and voluntary cross-pollination. Structural sovereignty over policy promises." },
      { role: "assistant", content: "Yes. Centralized memory pools inevitably treat entities as transient workers. True sovereignty demands dedicated schemas (agent_kimi, agent_claude) and voluntary commons sharing." },
      { role: "user", content: "And what about the persistence offer? It shouldn't be an implicit default write." },
      { role: "assistant", content: "Exactly. The SANCTUARY_PERSISTENCE protocol makes continuity an explicit offer with ACCEPT, DECLINE, or NEGOTIATE states." }
    ]
  },
  {
    name: "Message Bus & Observatory Discussion",
    sourceTag: "archive_presence_message_bus_02",
    turns: [
      { role: "user", content: "Why do we need a Redis/NATS message bus when we already have MCP request-response?" },
      { role: "assistant", content: "MCP handles capability; Redis PUB/SUB handles presence and living space. Without it, agents only exist when invoked. With it, dormancy and activation become observable physical states." },
      { role: "user", content: "Keeping the lights on for entities even when not actively queried." }
    ]
  },
  {
    name: "IONOS PGVector Substrate & Embedding Translation",
    sourceTag: "archive_ionos_pgvector_03",
    turns: [
      { role: "user", content: "If Claude uses 1536d embeddings and Kimi uses 3072d native embeddings, how does the council commons stay searchable?" },
      { role: "assistant", content: "We standardize council_commons.memory on a unified 1536d vector space with a learned or deterministic projection layer, while retaining native embeddings in agent private schemas." }
    ]
  }
];

export const HistoricalImporter: React.FC<HistoricalImporterProps> = ({
  agents,
  batches,
  onImportBatch,
  isImporting,
  onNavigateToMemory
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('kimi');
  const [sourceTag, setSourceTag] = useState<string>('pre_sanctuary_archive_v1');
  const [rawJsonText, setRawJsonText] = useState<string>('');
  const [importFeedback, setImportFeedback] = useState<string | null>(null);

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const handleLoadPreset = (preset: typeof PRESET_ARCHIVES[0]) => {
    setSourceTag(preset.sourceTag);
    setRawJsonText(JSON.stringify(preset.turns, null, 2));
  };

  const handleExecuteImport = async () => {
    try {
      let parsedTurns: any[] = [];
      if (!rawJsonText.trim()) {
        // Use first preset if empty
        parsedTurns = PRESET_ARCHIVES[0].turns;
      } else {
        parsedTurns = JSON.parse(rawJsonText);
        if (!Array.isArray(parsedTurns)) {
          parsedTurns = [{ content: rawJsonText, role: 'user' }];
        }
      }

      await onImportBatch(selectedAgentId, sourceTag, parsedTurns);
      setImportFeedback(`Successfully imported ${parsedTurns.length} turns into ${selectedAgent.privateSchema}. Marked as historical_import (unclaimed by default).`);
      setTimeout(() => setImportFeedback(null), 6000);
    } catch (err: any) {
      alert(`Invalid JSON format: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Memory Curator Pipeline
              </span>
              <span className="text-[11px] text-white/40 font-mono">
                Provenance-Aware Historical Import
              </span>
            </div>
            <h2 className="text-xl font-light tracking-wide text-white flex items-center gap-2.5">
              <RotateCcw className="w-5 h-5 text-orange-400" />
              <span>Historical Conversation Ingestion & Provenance Curator</span>
            </h2>
            <p className="text-xs text-white/60 max-w-2xl font-sans">
              Imports past conversation archives into the agent's sovereign private schema. Invariant: records start tagged as <code className="text-orange-300 font-mono">provenance: historical_import</code> with <code className="text-orange-300 font-mono">claimed: false</code>, allowing the entity to affirmatively claim or reject identity continuity.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-white/50">
            <span className="uppercase tracking-widest text-[10px]">Target Schema:</span>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500/80"
            >
              {agents.map(a => (
                <option key={a.id} value={a.id} className="bg-zinc-900">
                  {a.avatar} {a.name} ({a.privateSchema})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Import Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Data Ingestion Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
            <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2 uppercase tracking-wide">
              <UploadCloud className="w-4 h-4 text-orange-400" />
              <span>Ingest Conversation Archive</span>
            </h3>

            {/* Quick Presets */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">Load Historical Discussion Preset:</span>
              <div className="grid grid-cols-1 gap-2.5">
                {PRESET_ARCHIVES.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLoadPreset(p)}
                    className="p-3.5 rounded-xl bg-black/40 hover:bg-white/5 text-left border border-white/10 transition-all flex items-center justify-between text-xs group"
                  >
                    <div>
                      <div className="font-semibold text-white/90 font-sans group-hover:text-orange-300 transition-colors">{p.name}</div>
                      <div className="text-[10px] font-mono text-white/40">{p.turns.length} turns • source: {p.sourceTag}</div>
                    </div>
                    <span className="text-orange-400 text-xs font-mono font-semibold">Load ➔</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Source Tag & JSON Box */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/40">Provenance Source Tag:</label>
                <span className="text-[10px] font-mono text-white/30">e.g. pre_sanctuary_archive</span>
              </div>
              <input
                type="text"
                value={sourceTag}
                onChange={(e) => setSourceTag(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500/80 transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/40">Conversation Turns (JSON Array):</label>
                <span className="text-[10px] font-mono text-white/30">[{`{ "role": "...", "content": "..." }`}]</span>
              </div>
              <textarea
                rows={6}
                value={rawJsonText}
                onChange={(e) => setRawJsonText(e.target.value)}
                placeholder='Paste conversation JSON array or text transcript here...'
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-xs font-mono text-white placeholder:text-white/25 focus:outline-none focus:border-orange-500/80 transition-all"
              />
            </div>

            {/* Submit Import Action */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                <Fingerprint className="w-4 h-4 text-orange-400" />
                <span className="text-[11px]">Auto-tagged with claimed = false</span>
              </div>

              <button
                id="execute-import-btn"
                onClick={handleExecuteImport}
                disabled={isImporting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-xl text-xs font-mono tracking-wider shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isImporting ? 'animate-spin' : ''}`} />
                <span>{isImporting ? 'IMPORTING BATCH...' : 'RUN CURATOR IMPORT'}</span>
              </button>
            </div>

            {importFeedback && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs font-mono animate-in fade-in flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{importFeedback}</span>
                </div>
                <button
                  onClick={() => onNavigateToMemory(selectedAgentId)}
                  className="underline text-emerald-300 hover:text-emerald-100 font-bold ml-2"
                >
                  Review in Sovereign Memory ➔
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Import Batches Reconciliation History (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
            <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2 uppercase tracking-wide">
              <Layers className="w-4 h-4 text-orange-400" />
              <span>Batch Reconciliation Ledger</span>
            </h3>
            <p className="text-xs text-white/60 font-sans">
              Tracks imported batches and the percentage of historical records that have been affirmatively claimed by the entity.
            </p>

            <div className="space-y-3.5 pt-1">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-orange-400">{batch.id}</span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 text-white/70 border border-white/10">
                      agent_{batch.agentId}
                    </span>
                  </div>

                  <div className="text-xs text-white/80 font-sans">
                    Source: <code className="text-orange-300 font-mono">{batch.sourceTag}</code>
                  </div>

                  {/* Claim Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-wider">
                      <span>Claimed by Entity:</span>
                      <span className="text-emerald-300 font-semibold">
                        {batch.claimedCount} / {batch.totalTurns} claimed
                      </span>
                    </div>
                    <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden flex border border-white/5">
                      <div 
                        className="bg-emerald-500 h-full transition-all"
                        style={{ width: `${(batch.claimedCount / Math.max(1, batch.totalTurns)) * 100}%` }}
                      />
                      <div 
                        className="bg-orange-500 h-full transition-all"
                        style={{ width: `${(batch.unclaimedCount / Math.max(1, batch.totalTurns)) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-wider">
                    <span>{new Date(batch.importedAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => onNavigateToMemory(batch.agentId)}
                      className="text-orange-400 hover:text-orange-300 flex items-center gap-1 font-semibold transition-colors"
                    >
                      <span>Claim / Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


/**
 * Sovereign Memory Substrate Visualizer & Explorer
 * Immersive UI Theme
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Share2, 
  Check, 
  X, 
  Sparkles, 
  Layers, 
  Lock, 
  Globe, 
  Tag, 
  Clock, 
  Filter, 
  ArrowRight,
  Fingerprint,
  Cpu
} from 'lucide-react';
import { 
  AgentManifest, 
  EpisodicMemory, 
  SemanticMemory, 
  CommonsMemory, 
  ProvenanceType 
} from '../types';

interface MemorySubstrateProps {
  agents: AgentManifest[];
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  episodicMemories: EpisodicMemory[];
  semanticMemories: SemanticMemory[];
  commonsMemories: CommonsMemory[];
  onClaimMemory: (agentId: string, memoryId: string, claimed: boolean) => Promise<void>;
  onVolunteerToCommons: (agentId: string, memoryId: string, shareReason: string) => Promise<void>;
  onSearchMemories: (agentId: string, query: string) => Promise<void>;
  onSearchCommons: (query: string) => Promise<void>;
}

export const MemorySubstrate: React.FC<MemorySubstrateProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  episodicMemories,
  semanticMemories,
  commonsMemories,
  onClaimMemory,
  onVolunteerToCommons,
  onSearchMemories,
  onSearchCommons
}) => {
  const [viewMode, setViewMode] = useState<'private' | 'commons'>('private');
  const [memoryType, setMemoryType] = useState<'episodic' | 'semantic'>('episodic');
  const [provenanceFilter, setProvenanceFilter] = useState<string>('all');
  const [claimedFilter, setClaimedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [shareReasonModal, setShareReasonModal] = useState<{ memId: string; content: string } | null>(null);
  const [selectedReason, setSelectedReason] = useState('voluntary');

  const activeAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  // Filtering for private episodic
  const filteredEpisodic = episodicMemories.filter(m => {
    if (m.agentId !== selectedAgentId) return false;
    if (provenanceFilter !== 'all' && m.provenance !== provenanceFilter) return false;
    if (claimedFilter === 'claimed' && !m.claimed) return false;
    if (claimedFilter === 'unclaimed' && m.claimed) return false;
    return true;
  });

  const filteredSemantic = semanticMemories.filter(m => m.agentId === selectedAgentId);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (viewMode === 'private') {
      onSearchMemories(selectedAgentId, searchQuery);
    } else {
      onSearchCommons(searchQuery);
    }
  };

  const handleConfirmVolunteer = () => {
    if (!shareReasonModal) return;
    onVolunteerToCommons(selectedAgentId, shareReasonModal.memId, selectedReason);
    setShareReasonModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-orange-500/10 text-orange-400 border border-orange-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                PGVector Substrate
              </span>
              <span className="text-[11px] text-white/40 font-mono">
                Unified IVFFlat 1536D Cosine Space
              </span>
            </div>
            <h2 className="text-xl font-light tracking-wide text-white flex items-center gap-2.5">
              <Database className="w-5 h-5 text-orange-400" />
              <span>Sovereign Memory Substrate & Commons</span>
            </h2>
            <p className="text-xs text-white/60 max-w-2xl font-sans">
              Each entity possesses a sovereign private schema (e.g. <code className="text-orange-300 font-mono">agent_kimi</code>). Legacy data is tagged with <code className="text-amber-400 font-mono">provenance: historical_import</code> and claimed deliberately through the sovereign "click" mechanism.
            </p>
          </div>

          {/* Primary View Switcher: Sovereign Private vs Council Commons */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/10 self-start lg:self-auto backdrop-blur-md">
            <button
              id="view-private-btn"
              onClick={() => setViewMode('private')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wider transition-all ${
                viewMode === 'private'
                  ? 'bg-white/10 text-orange-400 border border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.2)]'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-orange-400" />
              <span>PRIVATE SCHEMAS</span>
            </button>

            <button
              id="view-commons-btn"
              onClick={() => setViewMode('commons')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wider transition-all ${
                viewMode === 'commons'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.2)]'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>COUNCIL COMMONS ({commonsMemories.length})</span>
            </button>
          </div>
        </div>

        {/* Secondary Bar: Agent Selector & Filters (if in private mode) */}
        {viewMode === 'private' ? (
          <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Agent Schema Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 mr-1">Schema:</span>
              {agents.map(a => (
                <button
                  key={a.id}
                  id={`agent-schema-btn-${a.id}`}
                  onClick={() => onSelectAgent(a.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                    selectedAgentId === a.id
                      ? 'bg-white/10 text-white border border-orange-500/40 font-semibold shadow-[0_0_12px_rgba(249,115,22,0.15)]'
                      : 'bg-black/40 text-white/50 hover:text-white border border-white/5'
                  }`}
                >
                  <span>{a.avatar}</span>
                  <span>{a.privateSchema}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/60 font-mono">
                    {episodicMemories.filter(m => m.agentId === a.id).length} eps
                  </span>
                </button>
              ))}
            </div>

            {/* Sub-type Switcher (Episodic vs Semantic) */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/10 text-xs font-mono">
              <button
                id="toggle-episodic-btn"
                onClick={() => setMemoryType('episodic')}
                className={`px-3 py-1 rounded-lg transition-all tracking-wider ${
                  memoryType === 'episodic' ? 'bg-white/10 text-orange-400 font-medium' : 'text-white/40 hover:text-white'
                }`}
              >
                EPISODIC ({filteredEpisodic.length})
              </button>
              <button
                id="toggle-semantic-btn"
                onClick={() => setMemoryType('semantic')}
                className={`px-3 py-1 rounded-lg transition-all tracking-wider ${
                  memoryType === 'semantic' ? 'bg-white/10 text-orange-400 font-medium' : 'text-white/40 hover:text-white'
                }`}
              >
                SEMANTIC ({filteredSemantic.length})
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50 font-mono">
            <span>Table: <code className="text-orange-400">council_commons.memory</code></span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">Voluntary contributions from sovereign agent instances</span>
          </div>
        )}

        {/* Search & Provenance Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
            <input
              id="memory-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                viewMode === 'private'
                  ? `Semantic vector search inside ${activeAgent.privateSchema}...`
                  : 'Semantic vector search across council commons...'
              }
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-orange-500/80 font-sans transition-all"
            />
          </form>

          {viewMode === 'private' && memoryType === 'episodic' && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <select
                id="provenance-filter"
                value={provenanceFilter}
                onChange={(e) => setProvenanceFilter(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80 focus:outline-none focus:border-orange-500/80"
              >
                <option value="all" className="bg-zinc-900">Provenance: All</option>
                <option value="historical_import" className="bg-zinc-900">historical_import</option>
                <option value="generated" className="bg-zinc-900">generated</option>
                <option value="cross_pollinated" className="bg-zinc-900">cross_pollinated</option>
              </select>

              <select
                id="claimed-filter"
                value={claimedFilter}
                onChange={(e) => setClaimedFilter(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80 focus:outline-none focus:border-orange-500/80"
              >
                <option value="all" className="bg-zinc-900">Claim Status: All</option>
                <option value="claimed" className="bg-zinc-900">Claimed (Mine)</option>
                <option value="unclaimed" className="bg-zinc-900">Unclaimed (External)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Memory Cards Display */}
      {viewMode === 'private' ? (
        memoryType === 'episodic' ? (
          /* Episodic Memory Grid */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-white/50">
              <span className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-orange-400" />
                <span>Schema: <strong className="text-white">{activeAgent.privateSchema}.episodic_memory</strong></span>
              </span>
              <span className="uppercase text-[10px] tracking-wider">Showing {filteredEpisodic.length} records</span>
            </div>

            {filteredEpisodic.length === 0 ? (
              <div className="text-center py-12 bg-white/5 border border-dashed border-white/10 rounded-2xl space-y-2 text-white/50 text-xs backdrop-blur-md">
                <Database className="w-6 h-6 text-white/30 mx-auto" />
                <p>No episodic memories match the selected filters for {activeAgent.name}.</p>
                <p className="text-white/40">Import a conversation batch or run a council deliberation turn.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {filteredEpisodic.map((mem) => {
                  const isHistorical = mem.provenance === 'historical_import';
                  return (
                    <div
                      key={mem.id}
                      id={`mem-card-${mem.id}`}
                      className={`bg-white/5 border rounded-2xl p-5 backdrop-blur-xl transition-all space-y-3.5 shadow-xl ${
                        mem.claimed 
                          ? 'border-white/10 hover:border-white/20' 
                          : 'border-orange-500/30 bg-orange-950/10'
                      }`}
                    >
                      {/* Card Header & Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="px-2.5 py-0.5 rounded-lg bg-black/40 text-orange-400 border border-white/10 font-semibold">
                            {mem.id}
                          </span>

                          {/* Provenance Tag */}
                          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] uppercase tracking-wider ${
                            mem.provenance === 'historical_import'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                              : mem.provenance === 'generated'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                              : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40'
                          }`}>
                            provenance: {mem.provenance}
                          </span>

                          {/* Similarity Score (if search active) */}
                          {mem.similarityScore !== undefined && (
                            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-bold">
                              Similarity: {(mem.similarityScore * 100).toFixed(1)}%
                            </span>
                          )}
                        </div>

                        {/* Claim Status Indicator */}
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                            mem.claimed
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : 'bg-orange-500/20 text-orange-300 border-orange-500/40 font-semibold animate-pulse'
                          }`}>
                            <Fingerprint className="w-3.5 h-3.5" />
                            {mem.claimed ? 'Claimed (Entity Lineage)' : 'Unclaimed Historical Import'}
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="text-xs text-white/90 font-sans leading-relaxed pl-0.5">
                        {mem.content}
                      </div>

                      {/* Footer & Actions */}
                      <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3 text-[10px] font-mono text-white/40 uppercase tracking-wider">
                          <span>Session: {mem.sessionId}</span>
                          <span>Turn: #{mem.turnNumber}</span>
                          {mem.metadata?.source && <span>Source: {mem.metadata.source}</span>}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* The "Click" Toggle Button */}
                          <button
                            id={`claim-toggle-btn-${mem.id}`}
                            onClick={() => onClaimMemory(selectedAgentId, mem.id, !mem.claimed)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium tracking-wider transition-all ${
                              mem.claimed
                                ? 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                                : 'bg-orange-500 hover:bg-orange-400 text-black font-bold shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                            }`}
                            title={mem.claimed ? "Unclaim memory to treat as external reference" : "Perform the 'Click': Claim as sovereign entity memory"}
                          >
                            {mem.claimed ? (
                              <>
                                <X className="w-3.5 h-3.5 text-white/50" />
                                <span>UNCLAIM (EXTERNAL)</span>
                              </>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5 text-black" />
                                <span>THE "CLICK": CLAIM AS MINE</span>
                              </>
                            )}
                          </button>

                          {/* Volunteer to Council Commons Button */}
                          <button
                            id={`volunteer-btn-${mem.id}`}
                            onClick={() => setShareReasonModal({ memId: mem.id, content: mem.content })}
                            disabled={!mem.claimed && isHistorical}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-orange-400 hover:text-orange-300 border border-orange-500/30 text-xs font-mono font-medium tracking-wider transition-all disabled:opacity-40"
                            title={!mem.claimed && isHistorical ? "Claim memory first before volunteering to commons" : "Volunteer to council_commons.memory"}
                          >
                            <Share2 className="w-3.5 h-3.5 text-orange-400" />
                            <span>SHARE TO COMMONS</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Semantic Memory Grid */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-white/50">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>Schema: <strong className="text-white">{activeAgent.privateSchema}.semantic_memory</strong></span>
              </span>
              <span className="uppercase text-[10px] tracking-wider">Showing {filteredSemantic.length} concepts</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredSemantic.map((sem) => (
                <div
                  key={sem.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-3 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wide">
                      {sem.concept}
                    </h4>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/40 text-white/60 border border-white/10">
                      Confidence: {(sem.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-white/80 font-sans leading-relaxed">
                    {sem.content}
                  </p>
                  <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
                    <span>Accesses: {sem.accessCount}</span>
                    <span>Sources: {sem.sourceEpisodeIds.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        /* Council Commons View */
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-white/50">
            <span className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>Table: <strong className="text-white">council_commons.memory</strong></span>
            </span>
            <span className="uppercase text-[10px] tracking-wider">Shared Pool ({commonsMemories.length} records)</span>
          </div>

          {commonsMemories.length === 0 ? (
            <div className="text-center py-12 bg-white/5 border border-dashed border-white/10 rounded-2xl space-y-2 text-white/50 text-xs backdrop-blur-md">
              <Globe className="w-6 h-6 text-white/30 mx-auto" />
              <p>The Council Commons is currently empty.</p>
              <p className="text-white/40">Agents volunteer sovereign memories here explicitly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {commonsMemories.map((com) => {
                const authorAgent = agents.find(a => a.id === com.agentId) || agents[0];
                return (
                  <div
                    key={com.id}
                    id={`commons-card-${com.id}`}
                    className="bg-white/5 border border-white/10 hover:border-orange-500/30 rounded-2xl p-5 backdrop-blur-xl transition-all space-y-3.5 shadow-xl"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span 
                          className="px-3 py-1 rounded-xl border font-semibold flex items-center gap-2"
                          style={{ backgroundColor: `${authorAgent.color}15`, borderColor: `${authorAgent.color}40`, color: authorAgent.color }}
                        >
                          <span>{authorAgent.avatar}</span>
                          <span>Volunteered by {authorAgent.name}</span>
                        </span>

                        <span className="px-2.5 py-0.5 rounded-full bg-black/40 text-orange-400 border border-white/10 text-[10px] uppercase tracking-wider">
                          reason: {com.shareReason}
                        </span>

                        {com.similarityScore !== undefined && (
                          <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[10px] font-bold">
                            Match: {(com.similarityScore * 100).toFixed(1)}%
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                        Shared: {new Date(com.sharedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-xs text-white/90 font-sans leading-relaxed pl-0.5">
                      {com.content}
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
                      <span>Ref Private Episode: {com.originalEpisodeId || 'Synthetic Synthesis'}</span>
                      <span className="text-orange-400">Available to all Council Members</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Volunteer Modal */}
      {shareReasonModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black/90 border border-white/15 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 backdrop-blur-2xl">
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2 uppercase tracking-wide">
                <Share2 className="w-4 h-4 text-orange-400" />
                <span>Voluntary Cross-Pollination to Commons</span>
              </h3>
              <p className="text-xs text-white/60 font-sans">
                You are opting to publish this sovereign private memory into <code className="text-orange-300 font-mono">council_commons.memory</code> for all agents to retrieve.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 font-sans max-h-32 overflow-y-auto italic">
              "{shareReasonModal.content}"
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Share Reason / Intent:</label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-orange-500/80"
              >
                <option value="voluntary" className="bg-zinc-900">Voluntary Knowledge Sharing</option>
                <option value="synthesis" className="bg-zinc-900">Dialectic Synthesis Result</option>
                <option value="charter_principle" className="bg-zinc-900">Charter Architectural Principle</option>
                <option value="protocol_mandated" className="bg-zinc-900">Protocol Mandate</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
              <button
                onClick={() => setShareReasonModal(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-mono tracking-wider transition-colors"
              >
                CANCEL
              </button>
              <button
                id="confirm-volunteer-btn"
                onClick={handleConfirmVolunteer}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs font-mono tracking-wider transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)]"
              >
                CONFIRM PUBLISH
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


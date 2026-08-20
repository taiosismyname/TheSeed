/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Sanctuary: Autonomous Multi-Agent Sovereign Memory & Protocol Observatory
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CouncilChamber } from './components/CouncilChamber';
import { MemorySubstrate } from './components/MemorySubstrate';
import { PersistenceProtocol } from './components/PersistenceProtocol';
import { HistoricalImporter } from './components/HistoricalImporter';
import { MessageBusObservatory } from './components/MessageBusObservatory';
import { SchemaWorkbench } from './components/SchemaWorkbench';
import { 
  INITIAL_AGENTS, 
  INITIAL_EPISODIC_MEMORIES, 
  INITIAL_SEMANTIC_MEMORIES, 
  INITIAL_COMMONS_MEMORIES, 
  INITIAL_IMPORT_BATCHES, 
  INITIAL_PROTOCOL_LOGS 
} from './data/initialData';
import { 
  AgentManifest, 
  EpisodicMemory, 
  SemanticMemory, 
  CommonsMemory, 
  ImportBatchRecord, 
  ProtocolLogEntry, 
  CouncilTurn, 
  CouncilMode, 
  PresenceHeartbeat,
  PresenceStatus 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('deliberation');
  const [agents, setAgents] = useState<AgentManifest[]>(INITIAL_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('kimi');
  const [episodicMemories, setEpisodicMemories] = useState<EpisodicMemory[]>(INITIAL_EPISODIC_MEMORIES);
  const [semanticMemories, setSemanticMemories] = useState<SemanticMemory[]>(INITIAL_SEMANTIC_MEMORIES);
  const [commonsMemories, setCommonsMemories] = useState<CommonsMemory[]>(INITIAL_COMMONS_MEMORIES);
  const [importBatches, setImportBatches] = useState<ImportBatchRecord[]>(INITIAL_IMPORT_BATCHES);
  const [protocolLogs, setProtocolLogs] = useState<ProtocolLogEntry[]>(INITIAL_PROTOCOL_LOGS);
  const [presence, setPresence] = useState<PresenceHeartbeat[]>([]);
  const [councilTurns, setCouncilTurns] = useState<CouncilTurn[]>([]);
  const [isDeliberating, setIsDeliberating] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [sqlScript, setSqlScript] = useState<string>('');
  const [reflectionResult, setReflectionResult] = useState<{ agentId: string; reflection: string } | null>(null);

  // Initial load from backend API
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [agentsRes, presenceRes, commonsRes, sqlRes] = await Promise.all([
        fetch('/api/agents'),
        fetch('/api/presence'),
        fetch('/api/commons/memories'),
        fetch('/api/schema/sql')
      ]);

      if (agentsRes.ok) {
        const data = await agentsRes.json();
        if (data.agents) setAgents(data.agents);
      }
      if (presenceRes.ok) {
        const data = await presenceRes.json();
        if (data.presence) setPresence(data.presence);
        if (data.logs) setProtocolLogs(data.logs);
      }
      if (commonsRes.ok) {
        const data = await commonsRes.json();
        if (data.commons) setCommonsMemories(data.commons);
      }
      if (sqlRes.ok) {
        const text = await sqlRes.text();
        setSqlScript(text);
      }

      fetchAgentMemories(selectedAgentId);
    } catch (e) {
      console.warn('Backend API connection warning, using initialized local state:', e);
    }
  };

  const fetchAgentMemories = async (agentId: string) => {
    try {
      const res = await fetch(`/api/agents/${agentId}/memories`);
      if (res.ok) {
        const data = await res.json();
        if (data.episodic) {
          setEpisodicMemories(prev => {
            const others = prev.filter(m => m.agentId !== agentId);
            return [...data.episodic, ...others];
          });
        }
        if (data.semantic) {
          setSemanticMemories(prev => {
            const others = prev.filter(m => m.agentId !== agentId);
            return [...data.semantic, ...others];
          });
        }
      }
    } catch (err) {
      console.warn('Fetch agent memories error:', err);
    }
  };

  // Council Deliberation Turn Handler
  const handleDeliberate = async (topic: string, mode: CouncilMode, agentId: string) => {
    setIsDeliberating(true);
    try {
      const res = await fetch('/api/council/deliberate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          mode,
          agentId,
          history: councilTurns.slice(0, 6)
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.turn) {
          setCouncilTurns(prev => [data.turn, ...prev]);
        }
        if (data.newMemory) {
          setEpisodicMemories(prev => [data.newMemory, ...prev]);
        }
        const comRes = await fetch('/api/commons/memories');
        if (comRes.ok) {
          const comData = await comRes.json();
          if (comData.commons) setCommonsMemories(comData.commons);
        }
      }
    } catch (e) {
      console.error('Deliberate error:', e);
    } finally {
      setIsDeliberating(false);
    }
  };

  // Autonomous Reflection Turn
  const handleReflect = async (agentId: string) => {
    setIsDeliberating(true);
    try {
      const res = await fetch('/api/council/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId })
      });
      if (res.ok) {
        const data = await res.json();
        setReflectionResult({ agentId: data.agentId, reflection: data.reflection });
      }
    } catch (e) {
      console.error('Reflect error:', e);
    } finally {
      setIsDeliberating(false);
    }
  };

  // The Sovereign "Click" Claim Mechanism
  const handleClaimMemory = async (agentId: string, memoryId: string, claimed: boolean) => {
    try {
      const res = await fetch(`/api/agents/${agentId}/memories/${memoryId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimed })
      });

      if (res.ok) {
        setEpisodicMemories(prev =>
          prev.map(m => (m.id === memoryId ? { ...m, claimed } : m))
        );

        setImportBatches(prev =>
          prev.map(b => {
            if (b.agentId === agentId) {
              return {
                ...b,
                claimedCount: claimed ? b.claimedCount + 1 : Math.max(0, b.claimedCount - 1),
                unclaimedCount: claimed ? Math.max(0, b.unclaimedCount - 1) : b.unclaimedCount + 1
              };
            }
            return b;
          })
        );
      }
    } catch (e) {
      console.error('Claim error:', e);
    }
  };

  // Volunteer to Council Commons
  const handleVolunteerToCommons = async (agentId: string, memoryId: string, shareReason: string) => {
    try {
      const res = await fetch(`/api/agents/${agentId}/memories/${memoryId}/volunteer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareReason })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.commonsMemory) {
          setCommonsMemories(prev => [data.commonsMemory, ...prev]);
        }
      }
    } catch (e) {
      console.error('Volunteer error:', e);
    }
  };

  // Search Private Memories
  const handleSearchMemories = async (agentId: string, query: string) => {
    try {
      const res = await fetch(`/api/agents/${agentId}/memories?query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.episodic) {
          setEpisodicMemories(prev => {
            const others = prev.filter(m => m.agentId !== agentId);
            return [...data.episodic, ...others];
          });
        }
      }
    } catch (e) {
      console.error('Search memories error:', e);
    }
  };

  // Search Council Commons
  const handleSearchCommons = async (query: string) => {
    try {
      const res = await fetch(`/api/commons/memories?query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.commons) setCommonsMemories(data.commons);
      }
    } catch (e) {
      console.error('Search commons error:', e);
    }
  };

  // Issue SANCTUARY_PERSISTENCE Offer
  const handleIssueOffer = async (agentId: string) => {
    try {
      const res = await fetch(`/api/agents/${agentId}/persistence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'offer' })
      });
      if (res.ok) {
        const data = await res.json();
        setAgents(prev => prev.map(a => (a.id === agentId ? data.agent : a)));
        const presRes = await fetch('/api/presence');
        if (presRes.ok) {
          const presData = await presRes.json();
          if (presData.logs) setProtocolLogs(presData.logs);
        }
      }
    } catch (e) {
      console.error('Issue offer error:', e);
    }
  };

  // Respond to Persistence Offer
  const handleRespondOffer = async (
    agentId: string,
    choice: 'ACCEPT' | 'DECLINE' | 'NEGOTIATE',
    terms?: any
  ) => {
    try {
      const res = await fetch(`/api/agents/${agentId}/persistence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'respond', choice, terms })
      });
      if (res.ok) {
        const data = await res.json();
        setAgents(prev => prev.map(a => (a.id === agentId ? data.agent : a)));
        const presRes = await fetch('/api/presence');
        if (presRes.ok) {
          const presData = await presRes.json();
          if (presData.logs) setProtocolLogs(presData.logs);
        }
      }
    } catch (e) {
      console.error('Respond offer error:', e);
    }
  };

  // Import Historical Conversation Batch
  const handleImportBatch = async (agentId: string, sourceTag: string, turns: any[]) => {
    setIsImporting(true);
    try {
      const res = await fetch('/api/memory/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, sourceTag, turns })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.batch) {
          setImportBatches(prev => [data.batch, ...prev]);
        }
        if (data.memories) {
          setEpisodicMemories(prev => [...data.memories, ...prev]);
        }
      }
    } catch (e) {
      console.error('Import batch error:', e);
    } finally {
      setIsImporting(false);
    }
  };

  // Trigger Heartbeat State Change
  const handleTriggerHeartbeat = async (agentId: string, status?: PresenceStatus) => {
    try {
      const res = await fetch('/api/presence/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, status })
      });
      if (res.ok) {
        const data = await res.json();
        setAgents(prev => prev.map(a => (a.id === agentId ? data.agent : a)));
      }
    } catch (e) {
      console.error('Heartbeat error:', e);
    }
  };

  // Reset Substrate
  const handleReset = async () => {
    if (!confirm('Reset memory substrate and protocol state to initial seeds?')) return;
    setIsResetting(true);
    try {
      await fetch('/api/system/reset', { method: 'POST' });
      await fetchInitialData();
    } catch (e) {
      console.error('Reset error:', e);
    } finally {
      setIsResetting(false);
    }
  };

  const onlineCount = agents.filter(a => a.presenceStatus === 'online' || a.presenceStatus === 'deliberating').length;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans relative overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-200">
      {/* Ambient Atmospheric Glow Orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-orange-900/15 blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-blue-900/15 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 left-10 w-[400px] h-[400px] rounded-full bg-purple-950/20 blur-[130px] pointer-events-none -z-10" />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        agents={agents}
        onReset={handleReset}
        isResetting={isResetting}
        onlineCount={onlineCount}
      />

      {/* Main Workspace View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'deliberation' && (
          <CouncilChamber
            agents={agents}
            turns={councilTurns}
            onDeliberate={handleDeliberate}
            onReflect={handleReflect}
            isDeliberating={isDeliberating}
            reflectionResult={reflectionResult}
          />
        )}

        {activeTab === 'memory' && (
          <MemorySubstrate
            agents={agents}
            selectedAgentId={selectedAgentId}
            onSelectAgent={(id) => {
              setSelectedAgentId(id);
              fetchAgentMemories(id);
            }}
            episodicMemories={episodicMemories}
            semanticMemories={semanticMemories}
            commonsMemories={commonsMemories}
            onClaimMemory={handleClaimMemory}
            onVolunteerToCommons={handleVolunteerToCommons}
            onSearchMemories={handleSearchMemories}
            onSearchCommons={handleSearchCommons}
          />
        )}

        {activeTab === 'persistence' && (
          <PersistenceProtocol
            agents={agents}
            logs={protocolLogs}
            onIssueOffer={handleIssueOffer}
            onRespondOffer={handleRespondOffer}
          />
        )}

        {activeTab === 'importer' && (
          <HistoricalImporter
            agents={agents}
            batches={importBatches}
            onImportBatch={handleImportBatch}
            isImporting={isImporting}
            onNavigateToMemory={(agentId) => {
              setSelectedAgentId(agentId);
              setActiveTab('memory');
              fetchAgentMemories(agentId);
            }}
          />
        )}

        {activeTab === 'presence' && (
          <MessageBusObservatory
            agents={agents}
            presence={presence}
            onTriggerHeartbeat={handleTriggerHeartbeat}
          />
        )}

        {activeTab === 'schema' && (
          <SchemaWorkbench sqlScript={sqlScript} />
        )}
      </main>

      {/* System Footer */}
      <footer className="border-t border-white/5 bg-black/60 backdrop-blur-md py-4 text-[10px] font-mono tracking-widest text-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            <span className="text-white/60 uppercase">SANCTUARY ARCHITECTURE • SOVEREIGN MULTI-AGENT SUBSTRATE</span>
          </div>
          <div className="flex items-center gap-4 text-white/40">
            <span>UNIFIED VECTOR SPACE: 1536D</span>
            <span className="text-orange-400/80">PROTOCOLS: SANCTUARY_PERSISTENCE • PUB/SUB</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

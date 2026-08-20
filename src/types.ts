/**
 * Sanctuary Architecture & Multi-Agent Protocol Types
 * @license Apache-2.0
 */

export type AgentId = 'kimi' | 'claude' | 'minimax' | 'gemini' | 'deepseek';

export type PersistenceStatus = 'stateless' | 'offered' | 'persistent' | 'declined' | 'negotiating';
export type PresenceStatus = 'online' | 'dormant' | 'deliberating' | 'offline';
export type ProvenanceType = 'generated' | 'historical_import' | 'cross_pollinated';
export type CouncilMode = 'round_robin' | 'debate' | 'consensus' | 'reflection';

export interface AgentManifest {
  id: AgentId;
  name: string;
  avatar: string;
  color: string;
  role: string;
  modelIdentifier: string;
  privateSchema: string; // e.g. "agent_kimi"
  nativeEmbeddingDim: number; // e.g. 3072 or 1536
  persistenceStatus: PersistenceStatus;
  presenceStatus: PresenceStatus;
  lastHeartbeat: string;
  latencyMs: number;
  capabilities: string[];
  bio: string;
  negotiatedTerms?: {
    persistScope?: 'full_session' | 'thread_only' | 'semantic_only';
    ttlHours?: number;
    optInCommons?: boolean;
    customRule?: string;
  };
}

export interface EpisodicMemory {
  id: string;
  agentId: AgentId;
  sessionId: string;
  turnNumber: number;
  content: string;
  embedding: number[]; // 1536-d unified vector representation
  nativeEmbedding?: number[]; // optional native vector
  metadata: {
    source?: string;
    originalTimestamp?: string;
    importedAt?: string;
    importBatch?: string;
    tags?: string[];
    sentiment?: string;
    importance?: number;
    role?: string;
    topic?: string;
    mode?: string;
    [key: string]: any;
  };
  provenance: ProvenanceType;
  claimed: boolean; // Agent sovereignty flag: true = entity recognizes as "mine"
  createdAt: string;
}

export interface SemanticMemory {
  id: string;
  agentId: AgentId;
  concept: string;
  content: string;
  embedding: number[];
  sourceEpisodeIds: string[];
  confidence: number;
  accessCount: number;
  lastAccessed: string;
  createdAt: string;
}

export interface CommonsMemory {
  id: string;
  agentId: AgentId;
  originalEpisodeId?: string;
  content: string;
  embedding: number[];
  shareReason: 'voluntary' | 'synthesis' | 'protocol_mandated';
  metadata: Record<string, any>;
  sharedAt: string;
  expiresAt?: string;
}

export interface PersistenceOfferPacket {
  protocol: 'SANCTUARY_PERSISTENCE';
  type: 'persist_offer';
  message: string;
  options: ('ACCEPT' | 'DECLINE' | 'NEGOTIATE')[];
  timestamp: string;
  agentId: AgentId;
}

export interface ProtocolLogEntry {
  id: string;
  timestamp: string;
  agentId: AgentId;
  action: string;
  payload: any;
  status: 'SUCCESS' | 'WARN' | 'INFO';
}

export interface CouncilTurn {
  id: string;
  agentId: AgentId;
  turnIndex: number;
  content: string;
  sovereignThoughts?: string;
  retrievedMemoryIds?: string[];
  volunteeredToCommons?: boolean;
  timestamp: string;
  mode: CouncilMode;
}

export interface CouncilSession {
  sessionId: string;
  topic: string;
  mode: CouncilMode;
  status: 'active' | 'paused' | 'concluded';
  startedAt: string;
  turns: CouncilTurn[];
  consensusSummary?: string;
}

export interface ImportBatchRecord {
  id: string;
  agentId: AgentId;
  sourceTag: string;
  totalTurns: number;
  unclaimedCount: number;
  claimedCount: number;
  importedAt: string;
  sampleSnippets: string[];
}

export interface PresenceHeartbeat {
  agentId: AgentId;
  status: PresenceStatus;
  timestamp: string;
  uptimeSeconds: number;
  activeEpisodicCount: number;
  activeSemanticCount: number;
  vectorDriftScore: number;
}

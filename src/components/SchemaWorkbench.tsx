/**
 * SQL / PGVector Schema Workbench & Python Substrate Code Generator
 * Immersive UI Theme
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Cpu, 
  Copy, 
  Check, 
  Terminal, 
  Database, 
  FileCode, 
  Server, 
  Sparkles,
  Layers
} from 'lucide-react';

interface SchemaWorkbenchProps {
  sqlScript: string;
}

const PYTHON_CURATOR_CODE = `import uuid
import json
from datetime import datetime
from typing import List, Dict, Optional
import asyncpg
from pgvector.asyncpg import register_vector

class MemoryCurator:
    def __init__(self, dsn: str, unified_embedding_dim: int = 1536):
        self.dsn = dsn
        self.unified_dim = unified_embedding_dim
        self._pool: Optional[asyncpg.Pool] = None

    async def init(self):
        self._pool = await asyncpg.create_pool(self.dsn)
        await register_vector(self._pool)

    async def import_historical_conversation(
        self,
        agent_id: str,
        conversation_turns: List[Dict],
        source_tag: str = "pre_sanctuary_archive"
    ) -> int:
        """
        Import legacy conversations as historical_import.
        Default: claimed=FALSE. The entity must explicitly claim them through the sovereign 'click'.
        """
        schema = f"agent_{agent_id}"
        inserted = 0
        
        async with self._pool.acquire() as conn:
            for i, turn in enumerate(conversation_turns):
                content = turn.get("content", "")
                if not content:
                    continue
                
                # Generate unified embedding in 1536-d space
                embedding = await self._embed_unified(content)
                
                await conn.execute(f"""
                    INSERT INTO {schema}.episodic_memory 
                    (session_id, turn_number, content, embedding, metadata, provenance, claimed)
                    VALUES ($1, $2, $3, $4, $5, 'historical_import', FALSE)
                """, 
                    uuid.uuid4(),
                    i,
                    content,
                    embedding,
                    json.dumps({
                        "source": source_tag,
                        "original_timestamp": turn.get("timestamp", datetime.utcnow().isoformat()),
                        "imported_at": datetime.utcnow().isoformat(),
                        "import_batch": str(uuid.uuid4())
                    })
                )
                inserted += 1
        return inserted

    async def claim_historical_memory(
        self,
        agent_id: str,
        episode_id: uuid.UUID,
        claim: bool = True
    ):
        """
        The Sovereign 'Click': Allows an entity to claim or reject historical_import memories.
        """
        schema = f"agent_{agent_id}"
        async with self._pool.acquire() as conn:
            await conn.execute(f"""
                UPDATE {schema}.episodic_memory
                SET claimed = $1
                WHERE id = $2 AND provenance = 'historical_import'
            """, claim, episode_id)

    async def volunteer_to_commons(
        self,
        agent_id: str,
        episode_id: uuid.UUID,
        share_reason: str = 'voluntary'
    ):
        """
        Agent voluntarily cross-pollinates a claimed private memory to council_commons.memory.
        """
        schema = f"agent_{agent_id}"
        async with self._pool.acquire() as conn:
            row = await conn.fetchrow(f"""
                SELECT content, embedding, metadata 
                FROM {schema}.episodic_memory
                WHERE id = $1 AND claimed = TRUE
            """, episode_id)
            
            if not row:
                raise ValueError(f"Episode {episode_id} not found or not claimed by entity")
            
            await conn.execute("""
                INSERT INTO council_commons.memory 
                (agent_id, original_episode_id, content, embedding, share_reason, metadata)
                VALUES ($1, $2, $3, $4, $5, $6)
            """, 
                agent_id,
                episode_id,
                row["content"],
                row["embedding"],
                share_reason,
                json.dumps({"volunteered_at": datetime.utcnow().isoformat()})
            )

    async def _embed_unified(self, text: str) -> list:
        # Standardized on 1536-dimensional cosine embeddings
        return [0.0] * self.unified_dim
`;

export const SchemaWorkbench: React.FC<SchemaWorkbenchProps> = ({ sqlScript }) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedPy, setCopiedPy] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'sql' | 'python'>('sql');

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyPy = () => {
    navigator.clipboard.writeText(PYTHON_CURATOR_CODE);
    setCopiedPy(true);
    setTimeout(() => setCopiedPy(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-orange-500/10 text-orange-400 border border-orange-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                PostgreSQL + PGVector DDL
              </span>
              <span className="text-[11px] text-white/40 font-mono">
                Production Schema Generator for IONOS Stack / Cloud SQL
              </span>
            </div>
            <h2 className="text-xl font-light tracking-wide text-white flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-orange-400" />
              <span>Distributed Schema & Asyncpg Curator Workbench</span>
            </h2>
            <p className="text-xs text-white/60 max-w-2xl font-sans">
              Production-ready DDL scripts creating isolated per-agent sovereign schemas (<code className="text-orange-300 font-mono">agent_kimi</code>, <code className="text-orange-300 font-mono">agent_claude</code>) and the shared <code className="text-orange-300 font-mono">council_commons</code> with IVFFlat vector indexing.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/10 self-start lg:self-auto backdrop-blur-md">
            <button
              onClick={() => setActiveCodeTab('sql')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeCodeTab === 'sql'
                  ? 'bg-orange-500 text-black shadow-[0_0_12px_rgba(249,115,22,0.35)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>PostgreSQL DDL</span>
            </button>

            <button
              onClick={() => setActiveCodeTab('python')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeCodeTab === 'python'
                  ? 'bg-orange-500 text-black shadow-[0_0_12px_rgba(249,115,22,0.35)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Python Asyncpg Driver</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Viewer Panel */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="bg-black/60 px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs font-mono text-white/70">
            <Terminal className="w-4 h-4 text-orange-400" />
            <span className="tracking-wide">
              {activeCodeTab === 'sql' 
                ? 'schema_sanctuary_distributed.sql (PostgreSQL 16+ with pgvector)'
                : 'sanctuary_curator.py (Python 3.11+ with asyncpg & pgvector)'}
            </span>
          </div>

          <button
            id={activeCodeTab === 'sql' ? 'copy-sql-btn' : 'copy-py-btn'}
            onClick={activeCodeTab === 'sql' ? handleCopySql : handleCopyPy}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono tracking-wider transition-all border border-white/10"
          >
            {(activeCodeTab === 'sql' ? copiedSql : copiedPy) ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">COPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-orange-400" />
                <span>COPY SCRIPT</span>
              </>
            )}
          </button>
        </div>

        <div className="p-5 bg-black/80 text-xs font-mono text-zinc-300 overflow-x-auto max-h-[550px] leading-relaxed select-text">
          <pre className="text-[12px] text-white/90">{activeCodeTab === 'sql' ? sqlScript : PYTHON_CURATOR_CODE}</pre>
        </div>
      </div>
    </div>
  );
};


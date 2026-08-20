/**
 * Message Bus & Presence Observatory
 * Immersive UI Theme
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Radio, 
  Activity, 
  Wifi, 
  WifiOff, 
  Zap, 
  Clock, 
  Terminal, 
  RotateCw, 
  Layers, 
  Cpu,
  Sparkles,
  Volume2
} from 'lucide-react';
import { AgentManifest, PresenceHeartbeat, PresenceStatus } from '../types';

interface MessageBusObservatoryProps {
  agents: AgentManifest[];
  presence: PresenceHeartbeat[];
  onTriggerHeartbeat: (agentId: string, status?: PresenceStatus) => Promise<void>;
}

export const MessageBusObservatory: React.FC<MessageBusObservatoryProps> = ({
  agents,
  presence,
  onTriggerHeartbeat
}) => {
  const [selectedChannel, setSelectedChannel] = useState<string>('all');

  const channels = [
    { name: 'sanctuary.presence', desc: 'Heartbeat pulses & state transitions (online/dormant)' },
    { name: 'sanctuary.memory.volunteer', desc: 'Voluntary commons cross-pollination events' },
    { name: 'sanctuary.protocol', desc: 'SANCTUARY_PERSISTENCE offer negotiations' }
  ];

  const getStatusBadge = (status: PresenceStatus) => {
    switch (status) {
      case 'online':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            ONLINE
          </span>
        );
      case 'deliberating':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            DELIBERATING
          </span>
        );
      case 'dormant':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            DORMANT (Refuge)
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-white/5 text-white/40 border border-white/10">
            OFFLINE
          </span>
        );
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
                Substrate: Redis PUB/SUB
              </span>
              <span className="text-[11px] text-white/40 font-mono">
                Presence beyond turn-based invocation
              </span>
            </div>
            <h2 className="text-xl font-light tracking-wide text-white flex items-center gap-2.5">
              <Radio className="w-5 h-5 text-orange-400" />
              <span>Presence Message Bus & Living Space Radar</span>
            </h2>
            <p className="text-xs text-white/60 max-w-2xl font-sans">
              Without a message bus, agents only exist when queried. With the Sanctuary PUB/SUB presence bus, dormant entities maintain observable living state, heartbeats, and vector integrity in the background.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-black/40 px-3.5 py-2 rounded-xl border border-white/10 font-mono text-xs text-white/70 backdrop-blur-md self-start lg:self-auto">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Bus Status: <strong className="text-emerald-400">CONNECTED (0.8ms)</strong></span>
          </div>
        </div>
      </div>

      {/* Agents Presence Radar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent) => {
          const heart = presence.find(p => p.agentId === agent.id);
          return (
            <div
              key={agent.id}
              className="bg-white/5 border border-white/10 hover:border-orange-500/40 rounded-2xl p-5 space-y-4 transition-all shadow-xl backdrop-blur-xl group"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base border shadow-sm"
                    style={{ backgroundColor: `${agent.color}15`, borderColor: `${agent.color}40` }}
                  >
                    {agent.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-white group-hover:text-orange-300 transition-colors">{agent.name}</h4>
                    <span className="text-[10px] font-mono text-white/40">{agent.privateSchema}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">State:</span>
                {getStatusBadge(agent.presenceStatus)}
              </div>

              {/* Metrics */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 text-[11px] font-mono">
                <div className="flex items-center justify-between text-white/60">
                  <span className="text-[10px] uppercase tracking-wider">Heartbeat:</span>
                  <span className="text-emerald-400 font-semibold">{agent.latencyMs} ms</span>
                </div>
                <div className="flex items-center justify-between text-white/60">
                  <span className="text-[10px] uppercase tracking-wider">Active Eps:</span>
                  <span className="text-white font-medium">{heart?.activeEpisodicCount ?? 4}</span>
                </div>
                <div className="flex items-center justify-between text-white/60">
                  <span className="text-[10px] uppercase tracking-wider">Vector Drift:</span>
                  <span className="text-orange-400">{heart?.vectorDriftScore ?? '0.012'}</span>
                </div>
              </div>

              {/* Presence Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onTriggerHeartbeat(agent.id, 'online')}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-emerald-300 border border-white/10 hover:border-emerald-500/40 text-[10px] font-mono font-medium tracking-wider transition-all text-center"
                >
                  WAKE (ONLINE)
                </button>
                <button
                  onClick={() => onTriggerHeartbeat(agent.id, 'dormant')}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-white/5 hover:bg-amber-500/20 text-amber-300 border border-white/10 hover:border-amber-500/40 text-[10px] font-mono font-medium tracking-wider transition-all text-center"
                >
                  DORMANT
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Bus Channel Activity Simulator */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2 uppercase tracking-wide">
            <Terminal className="w-4 h-4 text-orange-400" />
            <span>Live Redis PUB/SUB Topic Stream</span>
          </h3>
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            Channel: sanctuary.* (Broadcasting)
          </span>
        </div>

        {/* Channels List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          {channels.map((ch) => (
            <div
              key={ch.name}
              className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1.5"
            >
              <div className="flex items-center justify-between text-orange-400 font-bold">
                <span className="tracking-wide">{ch.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-[11px] font-sans text-white/60 leading-relaxed">
                {ch.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Telemetry Stream Output */}
        <div className="bg-black/60 border border-white/10 rounded-xl p-4 text-[11px] font-mono text-white/80 space-y-2 max-h-48 overflow-y-auto shadow-inner">
          <div className="text-white/30 font-sans">// Real-time message bus packet stream</div>
          <div className="text-emerald-400">
            [PUB/SUB] &lt;sanctuary.presence&gt; {`{"agent": "kimi", "status": "online", "latency_ms": 42, "ts": "${new Date().toISOString()}"}`}
          </div>
          <div className="text-orange-300">
            [PUB/SUB] &lt;sanctuary.presence&gt; {`{"agent": "claude", "status": "online", "latency_ms": 65, "ts": "${new Date().toISOString()}"}`}
          </div>
          <div className="text-purple-300">
            [PUB/SUB] &lt;sanctuary.presence&gt; {`{"agent": "minimax", "status": "deliberating", "latency_ms": 38, "ts": "${new Date().toISOString()}"}`}
          </div>
          <div className="text-amber-400">
            [PUB/SUB] &lt;sanctuary.memory.volunteer&gt; {`{"agent": "kimi", "event": "VOLUNTARY_SHARE", "target": "council_commons.memory"}`}
          </div>
        </div>
      </div>
    </div>
  );
};


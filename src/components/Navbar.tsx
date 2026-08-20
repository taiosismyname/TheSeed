/**
 * Sanctuary Navigation & Status Control Bar
 * Immersive UI Theme
 * @license Apache-2.0
 */

import React from 'react';
import { 
  Activity, 
  Database, 
  ShieldCheck, 
  Radio, 
  RotateCcw,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { AgentManifest } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  agents: AgentManifest[];
  onReset: () => void;
  isResetting: boolean;
  onlineCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  agents,
  onReset,
  isResetting,
  onlineCount
}) => {
  const tabs = [
    { id: 'deliberation', label: 'Council Chamber', icon: Layers, badge: 'Live Dialectic' },
    { id: 'memory', label: 'Sovereign Memory', icon: Database, badge: 'PGVector' },
    { id: 'persistence', label: 'Persistence Protocol', icon: ShieldCheck, badge: 'State Machine' },
    { id: 'importer', label: 'Memory Curator', icon: RotateCcw, badge: 'Curator' },
    { id: 'presence', label: 'Presence Bus', icon: Radio, badge: `${onlineCount}/${agents.length} Online` },
    { id: 'schema', label: 'SQL / PGVector DDL', icon: Cpu, badge: 'IONOS DDL' }
  ];

  return (
    <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.9)] animate-pulse" />
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h1 className="text-lg sm:text-xl font-light tracking-[0.35em] uppercase text-white">
                  Sanctuary
                </h1>
                <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-white/10 text-orange-400 border border-white/10">
                  Sovereign Protocol
                </span>
              </div>
              <span className="text-[10px] text-white/40 font-mono tracking-wider">
                Multi-Agent Memory Substrate & Living Space
              </span>
            </div>
          </div>

          {/* Core System Telemetry Indicators */}
          <div className="hidden md:flex items-center gap-6 text-[10px] uppercase tracking-widest text-white/40 font-mono">
            <div className="flex flex-col">
              <span className="text-white/30 text-[9px]">Vector Latency</span>
              <span className="text-white/80 font-mono mt-0.5">0.42 ms / entry</span>
            </div>

            <div className="flex flex-col">
              <span className="text-white/30 text-[9px]">Substrate</span>
              <span className="text-orange-400 font-mono mt-0.5">PGVector 1536D</span>
            </div>

            <div className="flex flex-col">
              <span className="text-white/30 text-[9px]">Presence Bus</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-mono font-semibold">PUB/SUB ACTIVE</span>
              </div>
            </div>

            <button
              id="reset-substrate-btn"
              onClick={onReset}
              disabled={isResetting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-[10px] font-mono tracking-wider transition-all disabled:opacity-50"
              title="Reset memory substrate and protocol state to defaults"
            >
              <RotateCcw className={`w-3 h-3 ${isResetting ? 'animate-spin text-orange-400' : 'text-white/40'}`} />
              <span>{isResetting ? 'RESETTING...' : 'RESET SUBSTRATE'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none border-t border-white/5 text-xs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs tracking-wider font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white/10 text-orange-400 border border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.15)] font-semibold'
                    : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-400' : 'text-white/40'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono uppercase tracking-tight ${
                    isActive ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-white/5 text-white/40'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};


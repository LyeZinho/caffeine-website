import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  FolderTree,
  Eye,
  Sliders
} from 'lucide-react';
import { ViewTab, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface DoppioShowcaseProps {
  onNavigateTab: (tab: ViewTab, targetId?: string) => void;
  currentLanguage?: Language;
}

export const DoppioShowcase: React.FC<DoppioShowcaseProps> = ({
  onNavigateTab,
  currentLanguage = 'pt'
}) => {
  const t = TRANSLATIONS[currentLanguage].doppio;
  const [selectedNode, setSelectedNode] = useState<'player' | 'camera' | 'particles' | 'physics'>('player');
  const [isHotReloading, setIsHotReloading] = useState(false);
  const [hotReloadMessage, setHotReloadMessage] = useState<string | null>(null);

  const triggerShaderHotReload = () => {
    setIsHotReloading(true);
    setHotReloadMessage(t.recompiling);
    setTimeout(() => {
      setHotReloadMessage(t.successMsg);
      setTimeout(() => {
        setIsHotReloading(false);
        setHotReloadMessage(null);
      }, 2000);
    }, 400);
  };

  const sceneNodes = [
    { id: 'player', name: 'Entity_Player', type: 'Archetype [Tf2D, Vel, Col2D]' },
    { id: 'particles', name: 'Crema_Vapor_Emitter', type: 'ParticleSystem2D' },
    { id: 'physics', name: 'World_Gravity_Zone', type: 'Physics2D Solver (60Hz)' },
    { id: 'camera', name: 'Main_Orthographic_Cam', type: 'Camera2D [Follow]' }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="mb-6 border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-[2px_2px_0px_0px_var(--border-bold)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              {t.title}
            </h1>
            <p className="mt-1 font-sans text-sm text-[var(--text-secondary)] max-w-2xl">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={triggerShaderHotReload}
              disabled={isHotReloading}
              className="flex items-center gap-2 border border-[var(--accent-punch)] bg-[var(--accent-punch)] px-4 py-2 font-mono-code text-xs font-bold text-white transition-opacity hover:opacity-90"
            >
              <Zap className="h-4 w-4" />
              <span>{isHotReloading ? t.recompiling : t.hotReloadBtn}</span>
            </button>
            <button
              onClick={() => onNavigateTab('tutorials', 'tutorial-doppio-node-graph')}
              className="border border-[var(--border-main)] bg-[var(--bg-card)] px-4 py-2 font-mono-code text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-punch)]"
            >
              {t.tutorialBtn}
            </button>
          </div>
        </div>

        {hotReloadMessage && (
          <div className="mt-4 border border-emerald-500 bg-emerald-950/20 p-2.5 font-mono-code text-xs text-emerald-300">
            {hotReloadMessage}
          </div>
        )}
      </div>

      {/* Interactive IDE Mockup Stage */}
      <div className="border border-[var(--border-main)] bg-[#0C0A09] shadow-[2px_2px_0px_0px_var(--border-bold)]">
        {/* Top Window Bar */}
        <div className="flex items-center justify-between border-b border-[var(--border-main)] bg-[#14100E] px-4 py-2 text-xs font-mono-code">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF3E24]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
            </div>
            <span className="font-medium text-[var(--text-primary)]">
              {t.windowTitle}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
            <span>Vulkan 1.3</span>
            <span>·</span>
            <span className="text-emerald-400 font-bold">144.0 FPS</span>
            <span>·</span>
            <span>138 MB</span>
          </div>
        </div>

        {/* 3-Column IDE Workspace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[440px]">
          {/* Left Panel: Scene Tree */}
          <div className="border-b md:border-b-0 md:border-r border-[var(--border-main)] bg-[#120E0C] p-4 md:col-span-3">
            <div className="mb-3 flex items-center justify-between border-b border-[var(--border-main)] pb-2">
              <div className="flex items-center gap-1.5 font-mono-code text-xs font-bold text-[var(--text-primary)]">
                <FolderTree className="h-3.5 w-3.5 text-[var(--accent-punch)]" />
                <span>{t.hierarchyTitle}</span>
              </div>
            </div>

            <div className="space-y-1 font-mono-code text-xs">
              {sceneNodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node.id as any)}
                  className={`flex w-full items-center justify-between p-2 text-left transition-colors ${
                    selectedNode === node.id
                      ? 'border-l-2 border-[var(--accent-punch)] bg-[#211B17] font-bold text-white'
                      : 'border-l-2 border-transparent text-[#ADA096] hover:bg-[#1A1412] hover:text-white'
                  }`}
                >
                  <div className="truncate">
                    <div>{node.name}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{node.type}</div>
                  </div>
                  <Eye className="h-3.5 w-3.5 shrink-0 opacity-40" />
                </button>
              ))}
            </div>
          </div>

          {/* Center: Viewport */}
          <div className="relative flex flex-col justify-between bg-[#080706] md:col-span-6">
            <div className="flex items-center justify-between border-b border-[var(--border-main)] bg-[#161210] px-3 py-1.5 text-xs font-mono-code text-[var(--text-secondary)]">
              <span>{t.viewportTitle}</span>
              <span className="text-emerald-400 text-[10px]">{t.vsyncOn}</span>
            </div>

            {/* Viewport Center Graphic */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden p-2">
              <img
                src="/images/doppio_ide_preview_1792062384957.jpg"
                alt="Doppio IDE Viewport and Node Graph"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover border border-[var(--border-main)]"
              />
            </div>

            <div className="border-t border-[var(--border-main)] bg-[#120E0C] p-2 text-[11px] font-mono-code text-[var(--text-secondary)]">
              <span className="text-[var(--accent-crema)] font-bold">{t.consoleLabel}</span> {t.consoleText}
            </div>
          </div>

          {/* Right Panel: Entity Inspector */}
          <div className="border-t md:border-t-0 md:border-l border-[var(--border-main)] bg-[#120E0C] p-4 md:col-span-3">
            <div className="mb-3 flex items-center justify-between border-b border-[var(--border-main)] pb-2">
              <div className="flex items-center gap-1.5 font-mono-code text-xs font-bold text-[var(--text-primary)]">
                <Sliders className="h-3.5 w-3.5 text-[var(--accent-crema)]" />
                <span>{t.inspectorTitle}</span>
              </div>
            </div>

            <div className="space-y-3 font-mono-code text-xs">
              {selectedNode === 'player' && (
                <>
                  <div className="border border-[var(--border-main)] bg-[#181310] p-2.5">
                    <div className="font-bold text-[var(--accent-punch)]">Transform2D</div>
                    <div className="mt-2 space-y-1 text-[11px] text-[var(--text-secondary)]">
                      <div className="flex justify-between">
                        <span>Position:</span>
                        <span className="text-white font-medium">200.0, 150.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Scale:</span>
                        <span className="text-white">1.0, 1.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-[var(--border-main)] bg-[#181310] p-2.5">
                    <div className="font-bold text-[var(--accent-crema)]">Velocity</div>
                    <div className="mt-2 space-y-1 text-[11px] text-[var(--text-secondary)]">
                      <div className="flex justify-between">
                        <span>Max Speed:</span>
                        <span className="text-white font-medium">240.0 px/s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Friction:</span>
                        <span className="text-white font-medium">0.94</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedNode === 'particles' && (
                <div className="border border-[var(--border-main)] bg-[#181310] p-2.5">
                  <div className="font-bold text-[var(--accent-crema)]">CremaEmitter</div>
                  <div className="mt-2 space-y-1 text-[11px] text-[var(--text-secondary)]">
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <span className="text-white font-medium">80 part/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Start Color:</span>
                      <span className="text-[#FF3E24] font-medium">#FF3E24</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bloom:</span>
                      <span className="text-white font-medium">0.85</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedNode === 'physics' && (
                <div className="border border-[var(--border-main)] bg-[#181310] p-2.5">
                  <div className="font-bold text-sky-400">Physics2D</div>
                  <div className="mt-2 space-y-1 text-[11px] text-[var(--text-secondary)]">
                    <div className="flex justify-between">
                      <span>Fixed Timestep:</span>
                      <span className="text-white font-medium">60 Hz</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gravity:</span>
                      <span className="text-white font-medium">Vec2(0, -980)</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedNode === 'camera' && (
                <div className="border border-[var(--border-main)] bg-[#181310] p-2.5">
                  <div className="font-bold text-purple-400">Camera2D</div>
                  <div className="mt-2 space-y-1 text-[11px] text-[var(--text-secondary)]">
                    <div className="flex justify-between">
                      <span>Mode:</span>
                      <span className="text-white">Orthographic</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Target:</span>
                      <span className="text-white font-medium">Entity_Player</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature comparison */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 shadow-[2px_2px_0px_0px_var(--border-bold)]">
          <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
            {t.coreBoxTitle}
          </h3>
          <p className="mt-2 font-sans text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            {t.coreBoxDesc}
          </p>
          <ul className="mt-4 space-y-2 font-sans text-xs sm:text-sm text-[var(--text-primary)]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--accent-punch)] shrink-0" />
              <span>{t.coreBox1}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--accent-punch)] shrink-0" />
              <span>{t.coreBox2}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--accent-punch)] shrink-0" />
              <span>{t.coreBox3}</span>
            </li>
          </ul>
        </div>

        <div className="border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 shadow-[2px_2px_0px_0px_var(--border-bold)]">
          <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">
            {t.ideBoxTitle}
          </h3>
          <p className="mt-2 font-sans text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            {t.ideBoxDesc}
          </p>
          <ul className="mt-4 space-y-2 font-sans text-xs sm:text-sm text-[var(--text-primary)]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--accent-crema)] shrink-0" />
              <span>{t.ideBox1}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--accent-crema)] shrink-0" />
              <span>{t.ideBox2}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--accent-crema)] shrink-0" />
              <span>{t.ideBox3}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

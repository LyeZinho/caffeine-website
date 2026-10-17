import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Code2,
  Share2,
  MousePointer
} from 'lucide-react';
import { getInteractiveTutorials } from '../data/tutorialsData';
import { CodeBlock } from './CodeBlock';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface InteractiveTutorialsViewProps {
  initialTutorialId?: string;
  currentLanguage?: Language;
}

export const InteractiveTutorialsView: React.FC<InteractiveTutorialsViewProps> = ({
  initialTutorialId,
  currentLanguage = 'pt'
}) => {
  const t = TRANSLATIONS[currentLanguage].tutorials;
  const tutorials = useMemo(() => getInteractiveTutorials(currentLanguage), [currentLanguage]);

  const [selectedTutId, setSelectedTutId] = useState(
    initialTutorialId || tutorials[0].id
  );
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'code' | 'node'>('code');

  // Simulation parameters (live editable)
  const [speed, setSpeed] = useState(240);
  const [gravity, setGravity] = useState(0);
  const [particleCount, setParticleCount] = useState(40);
  const [bounce, setBounce] = useState(0.7);
  const [bloom, setBloom] = useState(0.5);
  const [isSimRunning, setIsSimRunning] = useState(true);

  // Sync initial tutorial if prop changes
  useEffect(() => {
    if (initialTutorialId) {
      setSelectedTutId(initialTutorialId);
    }
  }, [initialTutorialId]);

  // Ensure selected tutorial is valid on language switch
  useEffect(() => {
    if (!tutorials.some((tut) => tut.id === selectedTutId)) {
      setSelectedTutId(tutorials[0].id);
      setCurrentStepIdx(0);
    }
  }, [tutorials, selectedTutId]);

  // Active tutorial & step
  const activeTut =
    tutorials.find((tut) => tut.id === selectedTutId) || tutorials[0];
  const activeStep = activeTut.steps[currentStepIdx] || activeTut.steps[0];

  // Sync initial params on step change
  useEffect(() => {
    if (activeStep?.defaultParams) {
      setSpeed(activeStep.defaultParams.speed);
      setGravity(activeStep.defaultParams.gravity);
      setParticleCount(activeStep.defaultParams.particleCount);
      setBounce(activeStep.defaultParams.bounce);
      setBloom(activeStep.defaultParams.bloom);
    }
  }, [currentStepIdx, selectedTutId, activeStep]);

  // Canvas simulation state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const entityStateRef = useRef({
    x: 220,
    y: 160,
    vx: 0,
    vy: 0,
    radius: 18,
    angle: 0
  });

  const particlesRef = useRef<Particle[]>([]);
  const keysDownRef = useRef<Record<string, boolean>>({});
  const fpsRef = useRef({ lastTime: performance.now(), frames: 0, fps: 60 });
  const [displayFps, setDisplayFps] = useState(60);
  const [entityCoords, setEntityCoords] = useState({ x: 220, y: 160, vx: 0, vy: 0 });

  // Key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        if (document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
        }
      }
      keysDownRef.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysDownRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main simulation loop
  useEffect(() => {
    let animationId: number;

    const obstacles: Obstacle[] = [
      { x: 120, y: 220, w: 100, h: 20 },
      { x: 300, y: 140, w: 90, h: 20 }
    ];

    const coffeeColors = ['#FF3E24', '#F59E0B', '#FBBF24', '#FFFFFF', '#D97706'];

    const spawnParticles = (x: number, y: number, count: number, spreadSpeed = 4) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const pSpeed = Math.random() * spreadSpeed + 1;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * pSpeed,
          vy: Math.sin(angle) * pSpeed,
          life: 1.0,
          maxLife: 0.4 + Math.random() * 0.4,
          size: Math.random() * 4 + 2,
          color: coffeeColors[Math.floor(Math.random() * coffeeColors.length)]
        });
      }
    };

    const updateSimulation = (now: number) => {
      const dt = 1 / 60;

      // FPS tracking
      fpsRef.current.frames++;
      if (now - fpsRef.current.lastTime >= 1000) {
        fpsRef.current.fps = fpsRef.current.frames;
        setDisplayFps(fpsRef.current.frames);
        fpsRef.current.frames = 0;
        fpsRef.current.lastTime = now;
      }

      if (isSimRunning) {
        const ent = entityStateRef.current;
        const keys = keysDownRef.current;

        // User Input -> Acceleration
        let inputX = 0;
        let inputY = 0;
        if (keys['w'] || keys['arrowup']) inputY -= 1;
        if (keys['s'] || keys['arrowdown']) inputY += 1;
        if (keys['a'] || keys['arrowleft']) inputX -= 1;
        if (keys['d'] || keys['arrowright']) inputX += 1;

        if (inputX !== 0 || inputY !== 0) {
          const len = Math.hypot(inputX, inputY) || 1;
          const force = speed * 4.5;
          ent.vx += (inputX / len) * force * dt;
          ent.vy += (inputY / len) * force * dt;

          if (Math.random() < 0.7) {
            spawnParticles(ent.x, ent.y, 2, 2.5);
          }
        }

        // Apply Gravity
        ent.vy += gravity * dt;

        // Friction / drag
        ent.vx *= 0.94;
        ent.vy *= 0.94;

        // Clamp speed
        const currentSpeed = Math.hypot(ent.vx, ent.vy);
        if (currentSpeed > speed * 1.5) {
          ent.vx = (ent.vx / currentSpeed) * (speed * 1.5);
          ent.vy = (ent.vy / currentSpeed) * (speed * 1.5);
        }

        // Move
        ent.x += ent.vx * dt;
        ent.y += ent.vy * dt;

        // Wall collisions
        const width = 520;
        const height = 320;
        const r = ent.radius;

        if (ent.x - r < 0) {
          ent.x = r;
          ent.vx = -ent.vx * bounce;
          spawnParticles(ent.x - r, ent.y, 4, 3);
        } else if (ent.x + r > width) {
          ent.x = width - r;
          ent.vx = -ent.vx * bounce;
          spawnParticles(ent.x + r, ent.y, 4, 3);
        }

        if (ent.y - r < 0) {
          ent.y = r;
          ent.vy = -ent.vy * bounce;
          spawnParticles(ent.x, ent.y - r, 4, 3);
        } else if (ent.y + r > height) {
          ent.y = height - r;
          ent.vy = -ent.vy * bounce;
          spawnParticles(ent.x, ent.y + r, 4, 3);
        }

        // Obstacle collisions
        for (const obs of obstacles) {
          const nearestX = Math.max(obs.x, Math.min(ent.x, obs.x + obs.w));
          const nearestY = Math.max(obs.y, Math.min(ent.y, obs.y + obs.h));
          const distX = ent.x - nearestX;
          const distY = ent.y - nearestY;
          const distSq = distX * distX + distY * distY;

          if (distSq < r * r) {
            const dist = Math.sqrt(distSq) || 1;
            const nx = distX / dist;
            const ny = distY / dist;
            ent.x = nearestX + nx * r;
            ent.y = nearestY + ny * r;

            const dot = ent.vx * nx + ent.vy * ny;
            ent.vx = (ent.vx - 2 * dot * nx) * bounce;
            ent.vy = (ent.vy - 2 * dot * ny) * bounce;

            spawnParticles(nearestX, nearestY, 6, 4);
          }
        }

        // Update particle lifetimes
        const aliveParticles: Particle[] = [];
        for (const p of particlesRef.current) {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= dt / p.maxLife;
          if (p.life > 0) {
            aliveParticles.push(p);
          }
        }
        particlesRef.current = aliveParticles;

        setEntityCoords({
          x: Math.round(ent.x),
          y: Math.round(ent.y),
          vx: Math.round(ent.vx),
          vy: Math.round(ent.vy)
        });
      }

      // Render Canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#0E0B09';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Grid pattern
          ctx.strokeStyle = '#261E1A';
          ctx.lineWidth = 1;
          const gridSize = 32;
          for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
          }
          for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
          }

          // Obstacles
          for (const obs of obstacles) {
            ctx.fillStyle = '#2A201B';
            ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
            ctx.strokeStyle = '#F59E0B';
            ctx.lineWidth = 2;
            ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);

            // Hatch lines
            ctx.strokeStyle = '#382B24';
            ctx.lineWidth = 1;
            for (let i = 0; i < obs.w; i += 10) {
              ctx.beginPath();
              ctx.moveTo(obs.x + i, obs.y);
              ctx.lineTo(obs.x + i + 10, obs.y + obs.h);
              ctx.stroke();
            }
          }

          // Particles
          for (const p of particlesRef.current) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillStyle = p.color;
            if (bloom > 0.2) {
              ctx.shadowColor = p.color;
              ctx.shadowBlur = bloom * 12;
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Entity (Caffeine Player)
          const ent = entityStateRef.current;
          ctx.save();
          ctx.translate(ent.x, ent.y);

          // Glow bloom
          if (bloom > 0) {
            ctx.shadowColor = '#FF3E24';
            ctx.shadowBlur = bloom * 24;
          }

          // Outer brutalist ring
          ctx.fillStyle = '#FF3E24';
          ctx.beginPath();
          ctx.arc(0, 0, ent.radius, 0, Math.PI * 2);
          ctx.fill();

          // High-contrast Crema core
          ctx.fillStyle = '#FBBF24';
          ctx.beginPath();
          ctx.arc(0, 0, ent.radius * 0.55, 0, Math.PI * 2);
          ctx.fill();

          // Crosshair markings
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-ent.radius - 4, 0);
          ctx.lineTo(ent.radius + 4, 0);
          ctx.moveTo(0, -ent.radius - 4);
          ctx.lineTo(0, ent.radius + 4);
          ctx.stroke();

          ctx.restore();
        }
      }

      animationId = requestAnimationFrame(updateSimulation);
    };

    animationId = requestAnimationFrame(updateSimulation);
    return () => cancelAnimationFrame(animationId);
  }, [isSimRunning, speed, gravity, bounce, bloom]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Reposition entity toward click
    entityStateRef.current.vx = (clickX - entityStateRef.current.x) * 2.5;
    entityStateRef.current.vy = (clickY - entityStateRef.current.y) * 2.5;

    // Burst particles
    const coffeeColors = ['#FF3E24', '#F59E0B', '#FBBF24', '#FFFFFF'];
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const pSpeed = Math.random() * 6 + 2;
      particlesRef.current.push({
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * pSpeed,
        vy: Math.sin(angle) * pSpeed,
        life: 1.0,
        maxLife: 0.5 + Math.random() * 0.4,
        size: Math.random() * 5 + 2,
        color: coffeeColors[Math.floor(Math.random() * coffeeColors.length)]
      });
    }
  };

  const resetSimulation = () => {
    entityStateRef.current = {
      x: 220,
      y: 160,
      vx: 0,
      vy: 0,
      radius: 18,
      angle: 0
    };
    particlesRef.current = [];
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 shadow-[2px_2px_0px_0px_var(--border-bold)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              {t.title}
            </h1>
            <p className="mt-1 font-sans text-xs sm:text-sm text-[var(--text-secondary)]">
              {t.subtitle}
            </p>
          </div>

          {/* Quick tutorial selector */}
          <div className="flex flex-wrap gap-2">
            {tutorials.map((tut) => (
              <button
                key={tut.id}
                onClick={() => {
                  setSelectedTutId(tut.id);
                  setCurrentStepIdx(0);
                }}
                className={`border px-3 py-1.5 font-mono-code text-xs font-semibold transition-colors ${
                  selectedTutId === tut.id
                    ? 'border-[var(--accent-punch)] bg-[var(--accent-punch)] text-white'
                    : 'border-[var(--border-main)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tut.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: 2-column split */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Step Guide & Code / Doppio Node Graph */}
        <div className="space-y-6 lg:col-span-6">
          {/* Step Progress Card */}
          <div className="border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 shadow-[2px_2px_0px_0px_var(--border-bold)]">
            <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono-code text-xs font-bold text-[var(--accent-punch)]">
                  {t.stepOf} {currentStepIdx + 1} / {activeTut.steps.length}
                </span>
                <span className="text-[var(--text-muted)]">·</span>
                <span className="font-mono-code text-xs text-[var(--text-muted)]">
                  {activeTut.duration}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentStepIdx === 0}
                  onClick={() => setCurrentStepIdx((p) => Math.max(0, p - 1))}
                  className="border border-[var(--border-main)] p-1 text-[var(--text-secondary)] disabled:opacity-30 hover:border-[var(--accent-punch)] hover:text-[var(--text-primary)]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  disabled={currentStepIdx === activeTut.steps.length - 1}
                  onClick={() =>
                    setCurrentStepIdx((p) => Math.min(activeTut.steps.length - 1, p + 1))
                  }
                  className="border border-[var(--border-main)] p-1 text-[var(--text-secondary)] disabled:opacity-30 hover:border-[var(--accent-punch)] hover:text-[var(--text-primary)]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <h2 className="mt-4 font-display text-xl font-bold text-[var(--text-primary)]">
              {activeStep.title}
            </h2>
            <p className="mt-2 font-sans text-sm leading-relaxed text-[var(--text-secondary)]">
              {activeStep.instruction}
            </p>

            {/* Task Explanation banner */}
            <div className="mt-4 border border-[var(--border-main)] bg-[var(--bg-subtle)] p-3">
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-crema)]" />
                <p className="font-sans text-xs text-[var(--text-primary)]">
                  {activeStep.taskExplanation}
                </p>
              </div>
            </div>

            {/* View Mode Toggle: Code vs Doppio Visual Nodes */}
            <div className="mt-6">
              <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-2">
                <span className="font-mono-code text-xs font-bold text-[var(--text-primary)]">
                  {t.logic}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewMode('code')}
                    className={`flex items-center gap-1.5 px-3 py-1 font-mono-code text-xs transition-colors ${
                      viewMode === 'code'
                        ? 'border border-[var(--accent-punch)] bg-[var(--accent-punch)] font-bold text-white'
                        : 'border border-[var(--border-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    <span>{t.csharpScript}</span>
                  </button>
                  <button
                    onClick={() => setViewMode('node')}
                    className={`flex items-center gap-1.5 px-3 py-1 font-mono-code text-xs transition-colors ${
                      viewMode === 'node'
                        ? 'border border-[var(--accent-punch)] bg-[var(--accent-punch)] font-bold text-white'
                        : 'border border-[var(--border-main)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>{t.visualGraph}</span>
                  </button>
                </div>
              </div>

              {viewMode === 'code' ? (
                <CodeBlock
                  code={activeStep.code}
                  lang="csharp"
                  label={`Caffeine · ${activeStep.title}`}
                />
              ) : (
                /* Interactive Doppio Node Diagram */
                <div className="my-4 border border-[var(--border-main)] bg-[var(--code-bg)] p-4 text-xs font-mono-code">
                  <div className="mb-2 flex items-center justify-between text-[11px] text-[var(--text-muted)] border-b border-[var(--border-main)] pb-1">
                    <span>{t.graphCanvas}</span>
                    <span className="text-[var(--accent-crema)]">{t.activeNodes}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="border border-[#F59E0B] bg-[#18120e] p-2.5">
                      <div className="flex items-center justify-between text-[#F59E0B] font-bold text-[11px]">
                        <span>{t.nodeInput}</span>
                        <span className="text-[9px] bg-[#F59E0B]/20 px-1">Evento</span>
                      </div>
                      <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
                        {t.nodeInputDesc}
                      </div>
                    </div>
                    <div className="ml-6 border-l border-dashed border-[var(--accent-punch)] pl-4 text-[10px] text-[var(--accent-punch)]">
                      {t.nodeRate}
                    </div>
                    <div className="border border-[var(--accent-punch)] bg-[#1a0e0a] p-2.5">
                      <div className="flex items-center justify-between text-[var(--accent-punch)] font-bold text-[11px]">
                        <span>{t.nodeRigidBody}</span>
                        <span className="text-[9px] bg-[var(--accent-punch)]/20 px-1">ECS Core</span>
                      </div>
                      <div className="mt-1 text-[11px] text-[var(--text-secondary)]">
                        Speed: {speed} px/s · Gravity: {gravity} · Bounce: {bounce}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step navigation buttons */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-[var(--border-main)]">
              <button
                disabled={currentStepIdx === 0}
                onClick={() => setCurrentStepIdx((p) => Math.max(0, p - 1))}
                className="border border-[var(--border-main)] px-4 py-2 font-mono-code text-xs font-medium text-[var(--text-secondary)] disabled:opacity-40 hover:text-[var(--text-primary)]"
              >
                {t.prevStep}
              </button>
              {currentStepIdx < activeTut.steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStepIdx((p) => p + 1)}
                  className="flex items-center gap-1.5 border border-[var(--accent-punch)] bg-[var(--accent-punch)] px-4 py-2 font-mono-code text-xs font-bold text-white transition-opacity hover:opacity-90"
                >
                  <span>{t.nextStep}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <div className="font-mono-code text-xs font-bold text-emerald-400">
                  {t.completed}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live In-Browser Doppio Simulator */}
        <div className="space-y-6 lg:col-span-6">
          <div className="border border-[var(--border-main)] bg-[var(--bg-surface)] p-6 shadow-[2px_2px_0px_0px_var(--border-bold)]">
            {/* Viewport Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-emerald-500 rounded-full" />
                <span className="font-mono-code text-xs font-bold text-[var(--text-primary)]">
                  {t.simTitle}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="border border-[var(--border-main)] bg-[var(--bg-subtle)] px-2 py-0.5 font-mono-code text-[11px] font-bold text-[var(--accent-crema)]">
                  {displayFps} FPS
                </span>
                <button
                  onClick={() => setIsSimRunning(!isSimRunning)}
                  className="border border-[var(--border-main)] bg-[var(--bg-card)] px-2 py-0.5 font-mono-code text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {isSimRunning ? t.pause : t.run}
                </button>
                <button
                  onClick={resetSimulation}
                  title={t.resetTitle}
                  className="border border-[var(--border-main)] bg-[var(--bg-card)] p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Canvas Viewport */}
            <div className="relative mt-4 overflow-hidden border border-[var(--border-main)] bg-[#0C0A09]">
              <canvas
                ref={canvasRef}
                width={520}
                height={320}
                onClick={handleCanvasClick}
                className="w-full cursor-crosshair touch-none"
              />

              {/* In-canvas control hint overlay */}
              <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-2 bg-black/80 px-2.5 py-1 font-mono-code text-[10px] text-[var(--text-secondary)] backdrop-blur-xs">
                <MousePointer className="h-3 w-3 text-[var(--accent-punch)]" />
                <span>{t.wasdHint}</span>
              </div>
            </div>

            {/* Live Parameter Controls */}
            <div className="mt-6 space-y-4 border-t border-[var(--border-main)] pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono-code text-xs font-bold text-[var(--text-primary)]">
                  <Sliders className="h-3.5 w-3.5 text-[var(--accent-punch)]" />
                  <span>{t.realtimeParams}</span>
                </div>
                <span className="font-mono-code text-[10px] text-[var(--text-muted)]">
                  {t.noRecompile}
                </span>
              </div>

              {/* Slider 1: Speed */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono-code text-xs">
                  <span className="text-[var(--text-secondary)]">{t.speedLabel}</span>
                  <span className="font-bold text-[var(--accent-punch)]">{speed} px/s</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="500"
                  step="10"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-[var(--accent-punch)]"
                />
              </div>

              {/* Slider 2: Gravity */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono-code text-xs">
                  <span className="text-[var(--text-secondary)]">{t.gravityLabel}</span>
                  <span className="font-bold text-[var(--accent-crema)]">{gravity}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1200"
                  step="50"
                  value={gravity}
                  onChange={(e) => setGravity(Number(e.target.value))}
                  className="w-full accent-[var(--accent-crema)]"
                />
              </div>

              {/* Slider 3: Bounciness / Restitution */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono-code text-xs">
                  <span className="text-[var(--text-secondary)]">{t.restitutionLabel}</span>
                  <span className="font-bold text-sky-400">{bounce.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.95"
                  step="0.05"
                  value={bounce}
                  onChange={(e) => setBounce(Number(e.target.value))}
                  className="w-full accent-sky-400"
                />
              </div>

              {/* Slider 4: Particles & Glow */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between font-mono-code text-xs">
                    <span className="text-[var(--text-secondary)]">{t.particlesLabel}</span>
                    <span className="font-bold text-[var(--text-primary)]">{particleCount}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="10"
                    value={particleCount}
                    onChange={(e) => setParticleCount(Number(e.target.value))}
                    className="w-full accent-[var(--accent-punch)]"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-mono-code text-xs">
                    <span className="text-[var(--text-secondary)]">{t.bloomLabel}</span>
                    <span className="font-bold text-[var(--accent-crema)]">{bloom.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={bloom}
                    onChange={(e) => setBloom(Number(e.target.value))}
                    className="w-full accent-[var(--accent-crema)]"
                  />
                </div>
              </div>
            </div>

            {/* Entity Inspector Output */}
            <div className="mt-6 border border-[var(--border-main)] bg-[var(--bg-card)] p-3 font-mono-code text-[11px]">
              <div className="flex items-center justify-between border-b border-[var(--border-main)] pb-1.5 text-[10px] font-bold text-[var(--text-muted)]">
                <span>{t.inspectorTitle}</span>
                <span className="text-emerald-400">{t.activeStatus}</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[var(--text-secondary)]">
                <div>
                  <span className="text-[var(--text-muted)]">{t.posLabel}</span>
                  <span className="text-[var(--text-primary)] font-bold">
                    X: {entityCoords.x}, Y: {entityCoords.y}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">{t.velLabel}</span>
                  <span className="text-[var(--text-primary)] font-bold">
                    VX: {entityCoords.vx}, VY: {entityCoords.vy}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[var(--text-muted)]">{t.componentsLabel}</span>
                  <span className="text-[var(--accent-crema)] font-bold">
                    Transform2D, Velocity, RigidBody2D, CremaEmitter
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

# Editor milestones

<div class="doc-meta">
  <span class="doc-badge doc-badge--historical">Historical</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

Historical planning for the Doppio editor, moved here from the engine tree. The
documents are kept as design records; implementation notes live in the module
reference and in the dated plans under `docs/plans/`.

## Program plan

| Document | Purpose |
|----------|---------|
| [Caffeine Studio IDE plan](caffeine-studio-ide.md) | Four-milestone program for the editor |
| [Runtime capabilities RFC](engine-runtime-capabilities-rfc.md) | Engine-neutral runtime gaps (requires, UI runtime, scene stack) |

## M1 — Scene Editor Foundation

| # | Document |
|---|----------|
| 1.1 | [EditorContext and undo/redo](m1-scene-editor-foundation/1.1-editor-context-undo-redo.md) |
| 1.2 | [Hierarchy panel](m1-scene-editor-foundation/1.2-hierarchy-panel.md) |
| 1.3 | [Inspector panel](m1-scene-editor-foundation/1.3-inspector-panel.md) |
| 1.4 | [Scene viewport](m1-scene-editor-foundation/1.4-scene-viewport.md) |
| 1.5 | [Asset browser v1](m1-scene-editor-foundation/1.5-asset-browser-v1.md) |
| 1.6 | [Scene editor orchestrator](m1-scene-editor-foundation/1.6-scene-editor-orchestrator.md) |
| 1.7 | [Save and load scene](m1-scene-editor-foundation/1.7-save-load-scene.md) |

## M2 — Visual editing and assets

| # | Document |
|---|----------|
| 2.1 | [Transform gizmos](m2-visual-editing-assets/2.1-transform-gizmos.md) |
| 2.2 | [Drag and drop](m2-visual-editing-assets/2.2-drag-and-drop.md) |
| 2.3 | [Asset pipeline integration](m2-visual-editing-assets/2.3-asset-pipeline-integration.md) |
| 2.4 | [Asset hot reload](m2-visual-editing-assets/2.4-hot-reload-assets.md) |
| 2.5 | [Project manager](m2-visual-editing-assets/2.5-project-manager.md) |
| 2.6 | [Asset browser v2](m2-visual-editing-assets/2.6-asset-browser-v2.md) |
| 2.7 | [Multiple scene tabs](m2-visual-editing-assets/2.7-multiple-scene-tabs.md) |

## M3 — Scripting and runtime

| # | Document |
|---|----------|
| 3.1 | [Lua VM](m3-scripting-runtime/3.1-lua-vm.md) |
| 3.2 | [Script component and system](m3-scripting-runtime/3.2-script-component-system.md) |
| 3.3 | [ECS Lua bindings](m3-scripting-runtime/3.3-ecs-lua-bindings.md) |
| 3.4 | [Sandboxing](m3-scripting-runtime/3.4-sandboxing.md) |
| 3.5 | [Script watcher](m3-scripting-runtime/3.5-script-watcher.md) |
| 3.6 | [Editor script integration](m3-scripting-runtime/3.6-editor-script-integration.md) |
| 3.7 | [Particle system](m3-scripting-runtime/3.7-particle-system.md) |

## M4 — Advanced tools and polish

| # | Document |
|---|----------|
| 4.1 | [Animation timeline](m4-advanced-tools-polish/4.1-animation-timeline.md) |
| 4.2 | [Tilemap editor](m4-advanced-tools-polish/4.2-tilemap-editor.md) |
| 4.3 | [Material and shader editor](m4-advanced-tools-polish/4.3-material-shader-editor.md) |
| 4.4 | [Audio preview and spatial placement](m4-advanced-tools-polish/4.4-audio-preview-spatial.md) |
| 4.5 | [Build system integration](m4-advanced-tools-polish/4.5-build-system.md) |
| 4.6 | [Prefab system](m4-advanced-tools-polish/4.6-prefab-system.md) |
| 4.7 | [Entity debugger](m4-advanced-tools-polish/4.7-entity-debugger.md) |
| 4.8 | [Extension and plugin system](m4-advanced-tools-polish/4.8-plugin-system.md) |

## Terrain track

| Document | Purpose |
|----------|---------|
| [Terrain overview](terrain/README.md) | Scope and status |
| [7.1 Additional modules](terrain/7.1-modulos-adicionais.md) | Reusable terrain modules |
| [7.2 Boolean combinators](terrain/7.2-combinadores-booleanos.md) | CSG-style composition |
| [7.3 Generation brush](terrain/7.3-brush-de-geracao.md) | Sculpting workflow |
| [7.4 Undo for generation](terrain/7.4-undo-de-geracao.md) | History integration |
| [7.5 GPU compute](terrain/7.5-gpu-compute.md) | Compute backend |
| [7.6 PNG import](terrain/7.6-import-png.md) | Heightmap import |
| [7.7 Physics collision](terrain/7.7-colisao-fisica.md) | Collision meshes |

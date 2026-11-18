# Milestones do editor

<div class="doc-meta">
  <span class="doc-badge doc-badge--historical">Historical</span>
  <span>Last updated: <time datetime="2026-11-18">2026-11-18</time></span>
</div>

Planeamento histórico do editor Doppio, movido da árvore da engine. Os documentos
são mantidos como registos de design; as notas de implementação atuais vivem na
referência dos módulos e nos planos datados em `docs/plans/`.

## Plano do programa

| Documento | Objetivo |
|-----------|----------|
| [Plano Caffeine Studio IDE](caffeine-studio-ide.md) | Programa de quatro milestones para o editor |
| [RFC de capacidades runtime](engine-runtime-capabilities-rfc.md) | Lacunas runtime neutras (require, UI runtime, scene stack) |

## M1 — Scene Editor Foundation

| # | Documento |
|---|-----------|
| 1.1 | [EditorContext e undo/redo](m1-scene-editor-foundation/1.1-editor-context-undo-redo.md) |
| 1.2 | [Painel Hierarchy](m1-scene-editor-foundation/1.2-hierarchy-panel.md) |
| 1.3 | [Painel Inspector](m1-scene-editor-foundation/1.3-inspector-panel.md) |
| 1.4 | [Scene viewport](m1-scene-editor-foundation/1.4-scene-viewport.md) |
| 1.5 | [Asset browser v1](m1-scene-editor-foundation/1.5-asset-browser-v1.md) |
| 1.6 | [Orquestrador do scene editor](m1-scene-editor-foundation/1.6-scene-editor-orchestrator.md) |
| 1.7 | [Guardar e carregar cena](m1-scene-editor-foundation/1.7-save-load-scene.md) |

## M2 — Edição visual e assets

| # | Documento |
|---|-----------|
| 2.1 | [Transform gizmos](m2-visual-editing-assets/2.1-transform-gizmos.md) |
| 2.2 | [Drag and drop](m2-visual-editing-assets/2.2-drag-and-drop.md) |
| 2.3 | [Integração do asset pipeline](m2-visual-editing-assets/2.3-asset-pipeline-integration.md) |
| 2.4 | [Hot reload de assets](m2-visual-editing-assets/2.4-hot-reload-assets.md) |
| 2.5 | [Project manager](m2-visual-editing-assets/2.5-project-manager.md) |
| 2.6 | [Asset browser v2](m2-visual-editing-assets/2.6-asset-browser-v2.md) |
| 2.7 | [Múltiplas tabs de cena](m2-visual-editing-assets/2.7-multiple-scene-tabs.md) |

## M3 — Scripting e runtime

| # | Documento |
|---|-----------|
| 3.1 | [Lua VM](m3-scripting-runtime/3.1-lua-vm.md) |
| 3.2 | [Componente e sistema de script](m3-scripting-runtime/3.2-script-component-system.md) |
| 3.3 | [Bindings ECS em Lua](m3-scripting-runtime/3.3-ecs-lua-bindings.md) |
| 3.4 | [Sandboxing](m3-scripting-runtime/3.4-sandboxing.md) |
| 3.5 | [Script watcher](m3-scripting-runtime/3.5-script-watcher.md) |
| 3.6 | [Integração de scripts no editor](m3-scripting-runtime/3.6-editor-script-integration.md) |
| 3.7 | [Sistema de partículas](m3-scripting-runtime/3.7-particle-system.md) |

## M4 — Ferramentas avançadas e polish

| # | Documento |
|---|-----------|
| 4.1 | [Animation timeline](m4-advanced-tools-polish/4.1-animation-timeline.md) |
| 4.2 | [Tilemap editor](m4-advanced-tools-polish/4.2-tilemap-editor.md) |
| 4.3 | [Material e shader editor](m4-advanced-tools-polish/4.3-material-shader-editor.md) |
| 4.4 | [Audio preview e colocação espacial](m4-advanced-tools-polish/4.4-audio-preview-spatial.md) |
| 4.5 | [Integração do build system](m4-advanced-tools-polish/4.5-build-system.md) |
| 4.6 | [Prefab system](m4-advanced-tools-polish/4.6-prefab-system.md) |
| 4.7 | [Entity debugger](m4-advanced-tools-polish/4.7-entity-debugger.md) |
| 4.8 | [Sistema de extensões e plugins](m4-advanced-tools-polish/4.8-plugin-system.md) |

## Terreno

| Documento | Objetivo |
|-----------|----------|
| [Visão geral do terreno](terrain/README.md) | Âmbito e estado |
| [7.1 Módulos adicionais](terrain/7.1-modulos-adicionais.md) | Módulos reutilizáveis |
| [7.2 Combinadores booleanos](terrain/7.2-combinadores-booleanos.md) | Composição tipo CSG |
| [7.3 Brush de geração](terrain/7.3-brush-de-geracao.md) | Fluxo de escultura |
| [7.4 Undo de geração](terrain/7.4-undo-de-geracao.md) | Integração com histórico |
| [7.5 GPU compute](terrain/7.5-gpu-compute.md) | Backend compute |
| [7.6 Import PNG](terrain/7.6-import-png.md) | Import de heightmap |
| [7.7 Colisão física](terrain/7.7-colisao-fisica.md) | Malhas de colisão |

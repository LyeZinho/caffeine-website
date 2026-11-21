# Scripting API reference

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
</div>

<p class="doc-lede">Every function the engine exposes to scripts, grouped like a standard library. Lua names are shown as caffeine.&lt;namespace&gt;.&lt;function&gt;; the Dryad native is shown when one exists.</p>

232 functions across 29 namespaces.

## Core

| Namespace | Functions | Description |
|---|---|---|
| [Component](component.md) | 14 | Generic access to every component the reflection registry describes: list, add, remove, read and write fields by name. |
| [Core](core.md) | 1 | Top-level helpers of the caffeine table. |
| [Debug](debug.md) | 3 | Logging to the engine console. |
| [Entity](entity.md) | 5 | Names and lookup. Entities are plain numeric ids; a name is optional and need not be unique. |
| [Hierarchy](hierarchy.md) | 6 | Parent and child links between entities. A child's transform is composed with its parent's. |
| [Math](math.md) | 23 | Vector tables ({x, y[, z]}), scalar helpers and angle conversion. Also defines the constants caffeine.math.pi and caffeine.math.epsilon (1e-5). |
| [Random](random.md) | 5 | A deterministic generator: the same seed always gives the same sequence, on every platform. |
| [Time](time.md) | 11 | The play clock: scaled and unscaled frame time, the fixed step, pause and the deterministic random seed. |
| [World](world.md) | 27 | Create and destroy entities, move them, and read or write transforms, 2D physics, sprites and particle emitters. Dryad adds position and scale natives. |

## Input

| Namespace | Functions | Description |
|---|---|---|
| [Input](input.md) | 11 | Keyboard, mapped axes and actions, and the mouse. Dryad mirrors them with caffeine_input_* natives. |
| [Pick](pick.md) | 8 | Find the entity under a point, a screen position, the mouse or a 3D ray, and register custom pickers. |

## Physics

| Namespace | Functions | Description |
|---|---|---|
| [Physics 3D](physics3d.md) | 7 | Ray queries and forces on the Bullet 3D world. Everything is a safe no-op (false or nil) when the host runs without 3D physics. Forces and velocity only affect dynamic bodies. |

## Game

| Namespace | Functions | Description |
|---|---|---|
| [Assets](assets.md) | 1 | Read project assets from scripts. |
| [Audio](audio.md) | 13 | Plays WAV files from the project. Play returns a handle you use to control that sound while it is playing. Without an audio device every call is a safe no-op (0 or false). Handles are only valid while the sound plays: after it ends, the slot may be reused by another sound. |
| [Events](events.md) | 3 | A simple named-event bus: subscribe, emit and unsubscribe. |
| [Game state](gameState.md) | 5 | An optional push/pop stack of named game states. |
| [Native modules](native.md) | 2 | Load and call native modules through JSON. |
| [Scene](scene.md) | 4 | Switching between scenes. A request is deferred: the world is replaced after the current frame's scripts finish, so call it freely from any hook. The runtime app handles requests; other hosts may not. A scene change removes every entity, so keep data you need in `caffeine.session`. |
| [Session](session.md) | 5 | A key-value store that survives scene changes for as long as the game runs (score, settings, choices). Values are numbers, booleans or text. It is not saved to disk. |

## World

| Namespace | Functions | Description |
|---|---|---|
| [Map](map.md) | 1 | Hooks for map surface chunk requests. |
| [Navigation](navigation.md) | 5 | Navigation agents: destinations, patrol points, follow targets and behaviour scripts. |
| [Procedural](procedural.md) | 12 | Deterministic noise, chunk streaming and terrain generation helpers for procedural worlds. |

## Rendering

| Namespace | Functions | Description |
|---|---|---|
| [Animation](animation.md) | 7 | Clip, state-machine, skinned-mesh and sprite-sheet animation control. |
| [Effects](effects.md) | 6 | Effect components on entities: particles, volumetric light, reflective surfaces, material shades and fog. |
| [Forward render](forwardrender.md) | 6 | Per-entity forward renderer features: instancing, image-based lighting, occlusion, reflections and volumetrics. |
| [Particles](particles.md) | 1 | Manual particle emission on entities that have a particle emitter. |
| [Post-process](postprocess.md) | 29 | Per-entity post-process effects such as bloom, vignette, colour grading and fog, with presets and path-based field access. |

## UI

| Namespace | Functions | Description |
|---|---|---|
| [Draw 2D](draw2d.md) | 5 | Immediate-mode 2D overlay shapes (lines, circles, rectangles, polylines) in world or screen space. |
| [UI](ui.md) | 6 | Create canvases, labels and buttons, update them and hit-test screen positions. |

## How this page is built

Generated from the API registry in the engine repository; a test fails when a binding is undocumented. Do not edit by hand.

# Procedural

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">World</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 12 · Dryad 0</span>
</div>

<p class="doc-lede">Deterministic noise, chunk streaming and terrain generation helpers for procedural worlds.</p>

[All namespaces](index.md)

Namespace: `caffeine.procedural`

## hash

Lua: `caffeine.procedural.hash`

```
hash(x, z, seed, salt) -> number
```

Deterministic hash of a cell, seed and salt.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>x</code></td><td>number</td><td>Integer X.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Integer Z.</td></tr>
<tr><td><code>seed</code></td><td>number</td><td>Seed.</td></tr>
<tr><td><code>salt</code></td><td>number</td><td>Extra salt.</td></tr>
</tbody>
</table>

**Returns:** `number`. Hash value (named hash01 in the engine).

**Example**

```lua
local r = caffeine.procedural.hash(3, 4, 42, 0)
```

## noise2d

Lua: `caffeine.procedural.noise2d`

```
noise2d(x, z, seed) -> number
```

2D value noise.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>x</code></td><td>number</td><td>X coordinate.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Z coordinate.</td></tr>
<tr><td><code>seed</code></td><td>number</td><td>Seed.</td></tr>
</tbody>
</table>

**Returns:** `number`. Noise value.

**Example**

```lua
local n = caffeine.procedural.noise2d(1.5, 2.5, 42)
```

## fbm2d

Lua: `caffeine.procedural.fbm2d`

```
fbm2d(x, z, seed, octaves, lacunarity, persistence) -> number
```

2D fractal Brownian motion noise.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>x</code></td><td>number</td><td>X coordinate.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Z coordinate.</td></tr>
<tr><td><code>seed</code></td><td>number</td><td>Seed.</td></tr>
<tr><td><code>octaves</code></td><td>number</td><td>Octave count.</td></tr>
<tr><td><code>lacunarity</code></td><td>number</td><td>Frequency multiplier per octave.</td></tr>
<tr><td><code>persistence</code></td><td>number</td><td>Amplitude multiplier per octave.</td></tr>
</tbody>
</table>

**Returns:** `number`. Noise value.

**Example**

```lua
local h = caffeine.procedural.fbm2d(x * 0.02, z * 0.02, 42, 5, 2.0, 0.5)
```

## worldToChunk

Lua: `caffeine.procedural.worldToChunk`

```
worldToChunk(worldCoord, chunkSize) -> number
```

Converts a world coordinate to a chunk index.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>worldCoord</code></td><td>number</td><td>World coordinate.</td></tr>
<tr><td><code>chunkSize</code></td><td>number</td><td>Chunk size in world units.</td></tr>
</tbody>
</table>

**Returns:** `number`. Chunk index.

**Example**

```lua
local cx = caffeine.procedural.worldToChunk(pos.x, 64)
```

## findTerrain

Lua: `caffeine.procedural.findTerrain`

```
findTerrain() -> number
```

Finds the terrain entity.

**Returns:** `number`. Terrain entity id, or 0 if none.

**Example**

```lua
local t = caffeine.procedural.findTerrain()
```

## getFocusChunk

Lua: `caffeine.procedural.getFocusChunk`

```
getFocusChunk(directorId, chunkSize, focusId) -> table
```

Returns the chunk the focus entity is in.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>directorId</code></td><td>number</td><td>Entity id of the procedural world director.</td></tr>
<tr><td><code>chunkSize</code></td><td>number</td><td>Chunk size, used if the director has no procedural settings.</td></tr>
<tr><td><code>focusId</code></td><td>number</td><td>Focus entity id. Optional.</td></tr>
</tbody>
</table>

**Returns:** `table`. Table with `cx` and `cz` (0, 0 if unavailable).

**Example**

```lua
local c = caffeine.procedural.getFocusChunk(dir, 64, player)
print(c.cx, c.cz)
```

## isChunkLoaded

Lua: `caffeine.procedural.isChunkLoaded`

```
isChunkLoaded(directorId, cx, cz) -> boolean
```

Checks whether a chunk is loaded for the director.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>directorId</code></td><td>number</td><td>Entity id of the procedural world director.</td></tr>
<tr><td><code>cx</code></td><td>number</td><td>Chunk X index.</td></tr>
<tr><td><code>cz</code></td><td>number</td><td>Chunk Z index.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true if the chunk is loaded.

**Example**

```lua
print(caffeine.procedural.isChunkLoaded(dir, 0, 0))
```

## unloadChunk

Lua: `caffeine.procedural.unloadChunk`

```
unloadChunk(directorId, cx, cz)
```

Unloads a chunk of the director.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>directorId</code></td><td>number</td><td>Entity id of the procedural world director.</td></tr>
<tr><td><code>cx</code></td><td>number</td><td>Chunk X index.</td></tr>
<tr><td><code>cz</code></td><td>number</td><td>Chunk Z index.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.procedural.unloadChunk(dir, 0, 0)
```

## stream

Lua: `caffeine.procedural.stream`

```
stream(directorId, terrainId, cx, cz, preset)
```

Streams chunks around the given chunk, adding procedural settings to the director if needed.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>directorId</code></td><td>number</td><td>Entity id of the procedural world director.</td></tr>
<tr><td><code>terrainId</code></td><td>number</td><td>Terrain entity id. Optional.</td></tr>
<tr><td><code>cx</code></td><td>number</td><td>Chunk X index.</td></tr>
<tr><td><code>cz</code></td><td>number</td><td>Chunk Z index.</td></tr>
<tr><td><code>preset</code></td><td>string</td><td>Preset name. Optional.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.procedural.stream(dir, caffeine.procedural.findTerrain(), 0, 0)
```

## generateTerrainChunk

Lua: `caffeine.procedural.generateTerrainChunk`

```
generateTerrainChunk(terrainId, cx, cz, seed, preset)
```

Generates one terrain chunk.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>terrainId</code></td><td>number</td><td>Terrain entity id.</td></tr>
<tr><td><code>cx</code></td><td>number</td><td>Chunk X index.</td></tr>
<tr><td><code>cz</code></td><td>number</td><td>Chunk Z index.</td></tr>
<tr><td><code>seed</code></td><td>number</td><td>Seed.</td></tr>
<tr><td><code>preset</code></td><td>string</td><td>Preset name. Optional.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.procedural.generateTerrainChunk(terrain, 0, 0, 42)
```

## spawnCube

Lua: `caffeine.procedural.spawnCube`

```
spawnCube(directorId, cx, cz, x, y, z, sx, sy, sz) -> number
```

Spawns a cube entity tagged with the director and chunk.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>directorId</code></td><td>number</td><td>Entity id of the procedural world director.</td></tr>
<tr><td><code>cx</code></td><td>number</td><td>Chunk X index.</td></tr>
<tr><td><code>cz</code></td><td>number</td><td>Chunk Z index.</td></tr>
<tr><td><code>x</code></td><td>number</td><td>World X.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>World Y.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>World Z.</td></tr>
<tr><td><code>sx</code></td><td>number</td><td>Scale X.</td></tr>
<tr><td><code>sy</code></td><td>number</td><td>Scale Y.</td></tr>
<tr><td><code>sz</code></td><td>number</td><td>Scale Z.</td></tr>
</tbody>
</table>

**Returns:** `number`. Id of the new entity, or 0 if no world.

**Example**

```lua
local c = caffeine.procedural.spawnCube(dir, 0, 0, 1, 0.5, 1, 1, 1, 1)
```

## fillTerrainNoise

Lua: `caffeine.procedural.fillTerrainNoise`

```
fillTerrainNoise(terrainId, seed, amplitude)
```

Fills the terrain heightmap with fractal noise.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>terrainId</code></td><td>number</td><td>Terrain entity id.</td></tr>
<tr><td><code>seed</code></td><td>number</td><td>Seed.</td></tr>
<tr><td><code>amplitude</code></td><td>number</td><td>Height multiplier; results are clamped to 0..1.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.procedural.fillTerrainNoise(terrain, 42, 1.0)
```

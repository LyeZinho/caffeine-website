# Procedural

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">World</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 12 · Dryad 0</span>
</div>

<p class="doc-lede">Auxiliares de ruído determinístico, streaming de chunks e geração de terreno para mundos procedurais.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.procedural`

## hash

Lua: `caffeine.procedural.hash`

```
hash(x, z, seed, salt) -> number
```

Hash determinístico de uma célula, semente e sal.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>x</code></td><td>number</td><td>X inteiro.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Z inteiro.</td></tr>
<tr><td><code>seed</code></td><td>number</td><td>Semente.</td></tr>
<tr><td><code>salt</code></td><td>number</td><td>Sal adicional.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Valor de hash (chamado hash01 no motor).

**Exemplo**

```lua
local r = caffeine.procedural.hash(3, 4, 42, 0)
```

## noise2d

Lua: `caffeine.procedural.noise2d`

```
noise2d(x, z, seed) -> number
```

Ruído de valor 2D.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>x</code></td><td>number</td><td>Coordenada X.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Coordenada Z.</td></tr>
<tr><td><code>seed</code></td><td>number</td><td>Semente.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Valor de ruído.

**Exemplo**

```lua
local n = caffeine.procedural.noise2d(1.5, 2.5, 42)
```

## fbm2d

Lua: `caffeine.procedural.fbm2d`

```
fbm2d(x, z, seed, octaves, lacunarity, persistence) -> number
```

Ruído fractal Brownian motion 2D.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>x</code></td><td>number</td><td>Coordenada X.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Coordenada Z.</td></tr>
<tr><td><code>seed</code></td><td>number</td><td>Semente.</td></tr>
<tr><td><code>octaves</code></td><td>number</td><td>Número de oitavas.</td></tr>
<tr><td><code>lacunarity</code></td><td>number</td><td>Multiplicador de frequência por oitava.</td></tr>
<tr><td><code>persistence</code></td><td>number</td><td>Multiplicador de amplitude por oitava.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Valor de ruído.

**Exemplo**

```lua
local h = caffeine.procedural.fbm2d(x * 0.02, z * 0.02, 42, 5, 2.0, 0.5)
```

## worldToChunk

Lua: `caffeine.procedural.worldToChunk`

```
worldToChunk(worldCoord, chunkSize) -> number
```

Converte uma coordenada do mundo num índice de chunk.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>worldCoord</code></td><td>number</td><td>Coordenada do mundo.</td></tr>
<tr><td><code>chunkSize</code></td><td>number</td><td>Tamanho do chunk em unidades do mundo.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Índice do chunk.

**Exemplo**

```lua
local cx = caffeine.procedural.worldToChunk(pos.x, 64)
```

## findTerrain

Lua: `caffeine.procedural.findTerrain`

```
findTerrain() -> number
```

Procura a entidade de terreno.

**Devolve:** `number`. Id da entidade de terreno, ou 0 se não houver.

**Exemplo**

```lua
local t = caffeine.procedural.findTerrain()
```

## getFocusChunk

Lua: `caffeine.procedural.getFocusChunk`

```
getFocusChunk(directorId, chunkSize, focusId) -> table
```

Devolve o chunk onde está a entidade de foco.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>directorId</code></td><td>number</td><td>Id da entidade diretora do mundo procedural.</td></tr>
<tr><td><code>chunkSize</code></td><td>number</td><td>Tamanho do chunk, usado se o diretor não tiver definições procedurais.</td></tr>
<tr><td><code>focusId</code></td><td>number</td><td>Id da entidade de foco. Opcional.</td></tr>
</tbody>
</table>

**Devolve:** `table`. Tabela com `cx` e `cz` (0, 0 se indisponível).

**Exemplo**

```lua
local c = caffeine.procedural.getFocusChunk(dir, 64, player)
print(c.cx, c.cz)
```

## isChunkLoaded

Lua: `caffeine.procedural.isChunkLoaded`

```
isChunkLoaded(directorId, cx, cz) -> boolean
```

Verifica se um chunk está carregado para o diretor.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>directorId</code></td><td>number</td><td>Id da entidade diretora do mundo procedural.</td></tr>
<tr><td><code>cx</code></td><td>number</td><td>Índice X do chunk.</td></tr>
<tr><td><code>cz</code></td><td>number</td><td>Índice Z do chunk.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true se o chunk estiver carregado.

**Exemplo**

```lua
print(caffeine.procedural.isChunkLoaded(dir, 0, 0))
```

## unloadChunk

Lua: `caffeine.procedural.unloadChunk`

```
unloadChunk(directorId, cx, cz)
```

Descarrega um chunk do diretor.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>directorId</code></td><td>number</td><td>Id da entidade diretora do mundo procedural.</td></tr>
<tr><td><code>cx</code></td><td>number</td><td>Índice X do chunk.</td></tr>
<tr><td><code>cz</code></td><td>number</td><td>Índice Z do chunk.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.procedural.unloadChunk(dir, 0, 0)
```

## stream

Lua: `caffeine.procedural.stream`

```
stream(directorId, terrainId, cx, cz, preset)
```

Faz streaming de chunks em redor do chunk indicado, adicionando definições procedurais ao diretor se necessário.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>directorId</code></td><td>number</td><td>Id da entidade diretora do mundo procedural.</td></tr>
<tr><td><code>terrainId</code></td><td>number</td><td>Id da entidade de terreno. Opcional.</td></tr>
<tr><td><code>cx</code></td><td>number</td><td>Índice X do chunk.</td></tr>
<tr><td><code>cz</code></td><td>number</td><td>Índice Z do chunk.</td></tr>
<tr><td><code>preset</code></td><td>string</td><td>Nome do preset. Opcional.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.procedural.stream(dir, caffeine.procedural.findTerrain(), 0, 0)
```

## generateTerrainChunk

Lua: `caffeine.procedural.generateTerrainChunk`

```
generateTerrainChunk(terrainId, cx, cz, seed, preset)
```

Gera um chunk de terreno.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>terrainId</code></td><td>number</td><td>Id da entidade de terreno.</td></tr>
<tr><td><code>cx</code></td><td>number</td><td>Índice X do chunk.</td></tr>
<tr><td><code>cz</code></td><td>number</td><td>Índice Z do chunk.</td></tr>
<tr><td><code>seed</code></td><td>number</td><td>Semente.</td></tr>
<tr><td><code>preset</code></td><td>string</td><td>Nome do preset. Opcional.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.procedural.generateTerrainChunk(terrain, 0, 0, 42)
```

## spawnCube

Lua: `caffeine.procedural.spawnCube`

```
spawnCube(directorId, cx, cz, x, y, z, sx, sy, sz) -> number
```

Cria uma entidade cubo marcada com o diretor e o chunk.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>directorId</code></td><td>number</td><td>Id da entidade diretora do mundo procedural.</td></tr>
<tr><td><code>cx</code></td><td>number</td><td>Índice X do chunk.</td></tr>
<tr><td><code>cz</code></td><td>number</td><td>Índice Z do chunk.</td></tr>
<tr><td><code>x</code></td><td>number</td><td>X no mundo.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Y no mundo.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Z no mundo.</td></tr>
<tr><td><code>sx</code></td><td>number</td><td>Escala X.</td></tr>
<tr><td><code>sy</code></td><td>number</td><td>Escala Y.</td></tr>
<tr><td><code>sz</code></td><td>number</td><td>Escala Z.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Id da nova entidade, ou 0 se não houver mundo.

**Exemplo**

```lua
local c = caffeine.procedural.spawnCube(dir, 0, 0, 1, 0.5, 1, 1, 1, 1)
```

## fillTerrainNoise

Lua: `caffeine.procedural.fillTerrainNoise`

```
fillTerrainNoise(terrainId, seed, amplitude)
```

Preenche o heightmap do terreno com ruído fractal.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>terrainId</code></td><td>number</td><td>Id da entidade de terreno.</td></tr>
<tr><td><code>seed</code></td><td>number</td><td>Semente.</td></tr>
<tr><td><code>amplitude</code></td><td>number</td><td>Multiplicador de altura; os resultados são limitados a 0..1.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.procedural.fillTerrainNoise(terrain, 42, 1.0)
```

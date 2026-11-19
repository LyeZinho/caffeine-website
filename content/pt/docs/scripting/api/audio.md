# Áudio

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Game</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 13 · Dryad 13</span>
</div>

<p class="doc-lede">Reproduz ficheiros WAV do projeto. O play devolve um handle para controlar esse som enquanto toca. Sem dispositivo de áudio, todas as chamadas são no-ops seguros (0 ou false). Os handles só são válidos enquanto o som toca: depois de acabar, o espaço pode ser reutilizado por outro som.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.audio` · Dryad prefix: `caffeine_audio_`

## isAvailable

Lua: `caffeine.audio.isAvailable` · Dryad: `caffeine_audio_available`

```
isAvailable() -> boolean
```

Indica se é possível reproduzir som.

**Devolve:** `boolean`. true quando há um dispositivo de reprodução aberto.

**Exemplo**

```lua
if not caffeine.audio.isAvailable() then caffeine.debug.warn("no sound") end
```

## play

Lua: `caffeine.audio.play` · Dryad: `caffeine_audio_play`

```
play(path[, volume[, pan[, loop]]]) -> number
```

Toca um som. O ficheiro é descodificado uma vez e fica em cache.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>path</code></td><td>string</td><td>Ficheiro WAV, relativo à raiz do projeto.</td></tr>
<tr><td><code>volume</code></td><td>number</td><td>0 a 1, por omissão 1.</td></tr>
<tr><td><code>pan</code></td><td>number</td><td>-1 esquerda a 1 direita, por omissão 0.</td></tr>
<tr><td><code>loop</code></td><td>boolean</td><td>Repetir até parar, por omissão false.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Um handle maior que 0, ou 0 quando o som não pôde tocar (sem dispositivo, ficheiro em falta, 32 canais ocupados).

**Exemplo**

```lua
local h = caffeine.audio.play("audio/jump.wav", 0.8)
```

## playAt

Lua: `caffeine.audio.playAt` · Dryad: `caffeine_audio_play_at`

```
playAt(path, x, y[, maxDistance[, volume]]) -> number
```

Toca um som cujo volume e panning esquerda/direita seguem a distância ao ouvinte (ver setListener).

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>path</code></td><td>string</td><td>Ficheiro WAV, relativo à raiz do projeto.</td></tr>
<tr><td><code>x, y</code></td><td>number</td><td>Posição do som no mundo 2D.</td></tr>
<tr><td><code>maxDistance</code></td><td>number</td><td>Distância a que o som fica mudo, por omissão 500.</td></tr>
<tr><td><code>volume</code></td><td>number</td><td>Ganho extra, por omissão 1.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Um handle, ou 0 se não pôde tocar.

**Exemplo**

```lua
caffeine.audio.playAt("audio/boom.wav", 120, 40, 300)
```

## stop

Lua: `caffeine.audio.stop` · Dryad: `caffeine_audio_stop`

```
stop(handle) -> boolean
```

Para um som.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>handle</code></td><td>number</td><td>Handle devolvido por play ou playAt.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. false se o handle for desconhecido ou o som já tiver terminado.

**Exemplo**

```lua
caffeine.audio.stop(h)
```

## pause

Lua: `caffeine.audio.pause` · Dryad: `caffeine_audio_pause`

```
pause(handle) -> boolean
```

Pausa um som; o resume continua-o.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>handle</code></td><td>number</td><td>Handle devolvido por play ou playAt.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. false se o handle for desconhecido ou o som já tiver terminado.

**Exemplo**

```lua
caffeine.audio.pause(h)
```

## resume

Lua: `caffeine.audio.resume` · Dryad: `caffeine_audio_resume`

```
resume(handle) -> boolean
```

Retoma um som em pausa.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>handle</code></td><td>number</td><td>Handle devolvido por play ou playAt.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. false se o handle for desconhecido ou o som já tiver terminado.

**Exemplo**

```lua
caffeine.audio.resume(h)
```

## setVolume

Lua: `caffeine.audio.setVolume` · Dryad: `caffeine_audio_set_volume`

```
setVolume(handle, volume) -> boolean
```

Altera o volume de um som a tocar.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>handle</code></td><td>number</td><td>Handle devolvido por play ou playAt.</td></tr>
<tr><td><code>volume</code></td><td>number</td><td>0 a 1.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. false se o handle for desconhecido ou o som já tiver terminado.

**Exemplo**

```lua
caffeine.audio.setVolume(h, 0.3)
```

## setLoop

Lua: `caffeine.audio.setLoop` · Dryad: `caffeine_audio_set_loop`

```
setLoop(handle, loop) -> boolean
```

Liga ou desliga a repetição de um som a tocar.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>handle</code></td><td>number</td><td>Handle devolvido por play ou playAt.</td></tr>
<tr><td><code>loop</code></td><td>boolean</td><td>true para repetir.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. false se o handle for desconhecido ou o som já tiver terminado.

**Exemplo**

```lua
caffeine.audio.setLoop(h, false)
```

## isPlaying

Lua: `caffeine.audio.isPlaying` · Dryad: `caffeine_audio_is_playing`

```
isPlaying(handle) -> boolean
```

Indica se um som ainda está a tocar.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>handle</code></td><td>number</td><td>Handle devolvido por play ou playAt.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. true enquanto o som toca (não em pausa, não terminado).

**Exemplo**

```lua
if not caffeine.audio.isPlaying(h) then h = caffeine.audio.play("audio/loop.wav") end
```

## stopAll

Lua: `caffeine.audio.stopAll` · Dryad: `caffeine_audio_stop_all`

```
stopAll()
```

Para todos os sons. As mudanças de cena fazem-no automaticamente.

**Devolve:** nada

**Exemplo**

```lua
caffeine.audio.stopAll()
```

## setMasterVolume

Lua: `caffeine.audio.setMasterVolume` · Dryad: `caffeine_audio_set_master_volume`

```
setMasterVolume(volume)
```

Define o volume aplicado aos sons iniciados depois.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>volume</code></td><td>number</td><td>0 a 1.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.audio.setMasterVolume(0.5)
```

## masterVolume

Lua: `caffeine.audio.masterVolume` · Dryad: `caffeine_audio_master_volume`

```
masterVolume() -> number
```

Lê o volume geral.

**Devolve:** `number`. O volume geral, 0 a 1 (0 sem áudio).

**Exemplo**

```lua
local v = caffeine.audio.masterVolume()
```

## setListener

Lua: `caffeine.audio.setListener` · Dryad: `caffeine_audio_set_listener`

```
setListener(x, y)
```

Define o ponto de onde o playAt mede a distância, normalmente o jogador ou a câmara.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>x, y</code></td><td>number</td><td>Posição do ouvinte no mundo 2D.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.audio.setListener(player_x, player_y)
```

# Audio

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Game</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 13 · Dryad 13</span>
</div>

<p class="doc-lede">Plays WAV files from the project. Play returns a handle you use to control that sound while it is playing. Without an audio device every call is a safe no-op (0 or false). Handles are only valid while the sound plays: after it ends, the slot may be reused by another sound.</p>

[All namespaces](index.md)

Namespace: `caffeine.audio` · Dryad prefix: `caffeine_audio_`

## isAvailable

Lua: `caffeine.audio.isAvailable` · Dryad: `caffeine_audio_available`

```
isAvailable() -> boolean
```

Tells whether sound can be played.

**Returns:** `boolean`. true when a playback device is open.

**Example**

```lua
if not caffeine.audio.isAvailable() then caffeine.debug.warn("no sound") end
```

## play

Lua: `caffeine.audio.play` · Dryad: `caffeine_audio_play`

```
play(path[, volume[, pan[, loop]]]) -> number
```

Plays a sound. The file is decoded once and cached.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>path</code></td><td>string</td><td>WAV file, relative to the project root.</td></tr>
<tr><td><code>volume</code></td><td>number</td><td>0 to 1, default 1.</td></tr>
<tr><td><code>pan</code></td><td>number</td><td>-1 left to 1 right, default 0.</td></tr>
<tr><td><code>loop</code></td><td>boolean</td><td>Repeat until stopped, default false.</td></tr>
</tbody>
</table>

**Returns:** `number`. A handle greater than 0, or 0 when the sound could not play (no device, missing file, all 32 channels busy).

**Example**

```lua
local h = caffeine.audio.play("audio/jump.wav", 0.8)
```

## playAt

Lua: `caffeine.audio.playAt` · Dryad: `caffeine_audio_play_at`

```
playAt(path, x, y[, maxDistance[, volume]]) -> number
```

Plays a sound whose volume and left/right pan follow its distance to the listener (see setListener).

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>path</code></td><td>string</td><td>WAV file, relative to the project root.</td></tr>
<tr><td><code>x, y</code></td><td>number</td><td>Sound position in the 2D world.</td></tr>
<tr><td><code>maxDistance</code></td><td>number</td><td>Distance at which the sound is silent, default 500.</td></tr>
<tr><td><code>volume</code></td><td>number</td><td>Extra gain, default 1.</td></tr>
</tbody>
</table>

**Returns:** `number`. A handle, or 0 when it could not play.

**Example**

```lua
caffeine.audio.playAt("audio/boom.wav", 120, 40, 300)
```

## stop

Lua: `caffeine.audio.stop` · Dryad: `caffeine_audio_stop`

```
stop(handle) -> boolean
```

Stops a sound.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>handle</code></td><td>number</td><td>Handle returned by play or playAt.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. false when the handle is unknown or the sound has already ended.

**Example**

```lua
caffeine.audio.stop(h)
```

## pause

Lua: `caffeine.audio.pause` · Dryad: `caffeine_audio_pause`

```
pause(handle) -> boolean
```

Pauses a sound; resume continues it.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>handle</code></td><td>number</td><td>Handle returned by play or playAt.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. false when the handle is unknown or the sound has already ended.

**Example**

```lua
caffeine.audio.pause(h)
```

## resume

Lua: `caffeine.audio.resume` · Dryad: `caffeine_audio_resume`

```
resume(handle) -> boolean
```

Resumes a paused sound.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>handle</code></td><td>number</td><td>Handle returned by play or playAt.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. false when the handle is unknown or the sound has already ended.

**Example**

```lua
caffeine.audio.resume(h)
```

## setVolume

Lua: `caffeine.audio.setVolume` · Dryad: `caffeine_audio_set_volume`

```
setVolume(handle, volume) -> boolean
```

Changes the volume of a playing sound.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>handle</code></td><td>number</td><td>Handle returned by play or playAt.</td></tr>
<tr><td><code>volume</code></td><td>number</td><td>0 to 1.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. false when the handle is unknown or the sound has already ended.

**Example**

```lua
caffeine.audio.setVolume(h, 0.3)
```

## setLoop

Lua: `caffeine.audio.setLoop` · Dryad: `caffeine_audio_set_loop`

```
setLoop(handle, loop) -> boolean
```

Turns looping on or off for a playing sound.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>handle</code></td><td>number</td><td>Handle returned by play or playAt.</td></tr>
<tr><td><code>loop</code></td><td>boolean</td><td>true to repeat.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. false when the handle is unknown or the sound has already ended.

**Example**

```lua
caffeine.audio.setLoop(h, false)
```

## isPlaying

Lua: `caffeine.audio.isPlaying` · Dryad: `caffeine_audio_is_playing`

```
isPlaying(handle) -> boolean
```

Tells whether a sound is still playing.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>handle</code></td><td>number</td><td>Handle returned by play or playAt.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true while the sound plays (not paused, not ended).

**Example**

```lua
if not caffeine.audio.isPlaying(h) then h = caffeine.audio.play("audio/loop.wav") end
```

## stopAll

Lua: `caffeine.audio.stopAll` · Dryad: `caffeine_audio_stop_all`

```
stopAll()
```

Stops every sound. Scene changes do this automatically.

**Returns:** none

**Example**

```lua
caffeine.audio.stopAll()
```

## setMasterVolume

Lua: `caffeine.audio.setMasterVolume` · Dryad: `caffeine_audio_set_master_volume`

```
setMasterVolume(volume)
```

Sets the volume applied to sounds started afterwards.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>volume</code></td><td>number</td><td>0 to 1.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.audio.setMasterVolume(0.5)
```

## masterVolume

Lua: `caffeine.audio.masterVolume` · Dryad: `caffeine_audio_master_volume`

```
masterVolume() -> number
```

Reads the master volume.

**Returns:** `number`. The master volume, 0 to 1 (0 without audio).

**Example**

```lua
local v = caffeine.audio.masterVolume()
```

## setListener

Lua: `caffeine.audio.setListener` · Dryad: `caffeine_audio_set_listener`

```
setListener(x, y)
```

Sets where playAt measures distance from, usually the player or camera.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>x, y</code></td><td>number</td><td>Listener position in the 2D world.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.audio.setListener(player_x, player_y)
```

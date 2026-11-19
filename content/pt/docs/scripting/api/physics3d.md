# Física 3D

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Physics</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 7 · Dryad 7</span>
</div>

<p class="doc-lede">Consultas por raio e forças no mundo 3D Bullet. Tudo é um no-op seguro (false ou nil) quando o host corre sem física 3D. Forças e velocidade só afetam corpos dinâmicos.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.physics3d` · Dryad prefix: `caffeine_physics3d_`

## isAvailable

Lua: `caffeine.physics3d.isAvailable` · Dryad: `caffeine_physics3d_available`

```
isAvailable() -> boolean
```

Indica se a física 3D pode ser usada.

**Devolve:** `boolean`. true quando há um mundo de física 3D e o backend Bullet está compilado.

**Exemplo**

```lua
if not caffeine.physics3d.isAvailable() then caffeine.debug.warn("no 3D physics") end
```

## setGravity

Lua: `caffeine.physics3d.setGravity` · Dryad: `caffeine_physics3d_set_gravity`

```
setGravity(x, y, z)
```

Define o vetor de gravidade em metros por segundo ao quadrado (por omissão 0, -9.81, 0).

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>x</code></td><td>number</td><td>Componente X.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Componente Y.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Componente Z.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.physics3d.setGravity(0, -3.7, 0) -- Mars
```

## raycast

Lua: `caffeine.physics3d.raycast` · Dryad: `caffeine_physics3d_raycast`

```
raycast(ox, oy, oz, dx, dy, dz, maxDistance) -> table | nil
```

Lança um raio e devolve o primeiro corpo sólido que atinge, com o ponto de impacto e a normal da superfície.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>ox, oy, oz</code></td><td>number</td><td>Origem do raio no espaço do mundo.</td></tr>
<tr><td><code>dx, dy, dz</code></td><td>number</td><td>Direção; não precisa de estar normalizada.</td></tr>
<tr><td><code>maxDistance</code></td><td>number</td><td>Comprimento máximo em metros.</td></tr>
</tbody>
</table>

**Devolve:** `table | nil`. { entity, x, y, z, nx, ny, nz, distance } para o corpo mais próximo atingido, ou nil. Os triggers são ignorados.

**Exemplo**

```lua
local hit = caffeine.physics3d.raycast(0, 10, 0, 0, -1, 0, 100)
if hit then caffeine.debug.log(hit.entity .. " at " .. hit.distance) end
```

## addForce

Lua: `caffeine.physics3d.addForce` · Dryad: `caffeine_physics3d_add_force`

```
addForce(entity, x, y, z) -> boolean
```

Aplica uma força (newtons) no centro de massa no próximo passo de física.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Um corpo com RigidBody3D e Collider3D.</td></tr>
<tr><td><code>x</code></td><td>number</td><td>Componente X.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Componente Y.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Componente Z.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. false para um corpo desconhecido ou não dinâmico.

**Exemplo**

```lua
caffeine.physics3d.addForce(eid, 0, 50, 0)
```

## addImpulse

Lua: `caffeine.physics3d.addImpulse` · Dryad: `caffeine_physics3d_add_impulse`

```
addImpulse(entity, x, y, z) -> boolean
```

Aplica uma mudança instantânea de momento (newton-segundos) no centro de massa, por exemplo um salto.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Um corpo com RigidBody3D e Collider3D.</td></tr>
<tr><td><code>x</code></td><td>number</td><td>Componente X.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Componente Y.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Componente Z.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. false para um corpo desconhecido ou não dinâmico.

**Exemplo**

```lua
caffeine.physics3d.addImpulse(eid, 0, 6, 0)
```

## setVelocity

Lua: `caffeine.physics3d.setVelocity` · Dryad: `caffeine_physics3d_set_velocity`

```
setVelocity(entity, x, y, z) -> boolean
```

Define a velocidade linear em metros por segundo.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Um corpo com RigidBody3D e Collider3D.</td></tr>
<tr><td><code>x</code></td><td>number</td><td>Componente X.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Componente Y.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Componente Z.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. false para um corpo desconhecido ou não dinâmico.

**Exemplo**

```lua
caffeine.physics3d.setVelocity(eid, 4, 0, 0)
```

## velocity

Lua: `caffeine.physics3d.velocity` · Dryad: `caffeine_physics3d_velocity`

```
velocity(entity) -> table | nil
```

Lê a velocidade linear de um corpo.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>number</td><td>Um corpo com RigidBody3D e Collider3D.</td></tr>
</tbody>
</table>

**Devolve:** `table | nil`. { x, y, z } em metros por segundo, ou nil para um corpo desconhecido ou não dinâmico.

**Exemplo**

```lua
local v = caffeine.physics3d.velocity(eid)
```

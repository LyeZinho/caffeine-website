# Mundo

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Core</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 17 · Dryad 13</span>
</div>

<p class="doc-lede">Criar e destruir entidades, movê-las e ler ou escrever transformações, física 2D, sprites e emissores de partículas. O Dryad acrescenta natives de posição e escala.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.world` · Dryad prefix: `caffeine_world_`

## create

Lua: `caffeine.world.create` · Dryad: `caffeine_world_create`

```
create() -> integer
```

Cria uma entidade com o nome "LuaEntity".

**Devolve:** `integer`. O id da nova entidade, ou 0 se não houver mundo.

**Exemplo**

```lua
local e = caffeine.world.create()
```

## destroy

Lua: `caffeine.world.destroy` · Dryad: `caffeine_world_destroy`

```
destroy(entity)
```

Destrói uma entidade. Não faz nada se não houver mundo.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.world.destroy(e)
```

## hasComponent

Lua: `caffeine.world.hasComponent`

```
hasComponent(entity, type) -> boolean
```

Verifica um de quatro tipos de componente incorporados. "Transform" também é verdadeiro para Position3D. Para outros componentes use `caffeine.component.has`.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>type</code></td><td>string</td><td>Um de "Transform", "Sprite", "RigidBody2D", "Collider2D".</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. Verdadeiro se a entidade o tiver; falso para qualquer outro nome.

**Exemplo**

```lua
if caffeine.world.hasComponent(e, 'Sprite') then end
```

## getTransform

Lua: `caffeine.world.getTransform`

```
getTransform(entity) -> table
```

Lê a posição da entidade (de Position3D ou Transform); a rotação e a escala vêm de Transform.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `table`. {x, y, z, rotation, scaleX, scaleY}; por omissão 0 e escala 1.

**Exemplo**

```lua
local t = caffeine.world.getTransform(e)
caffeine.debug.log(t.x .. ', ' .. t.y)
```

## setTransform

Lua: `caffeine.world.setTransform`

```
setTransform(entity, t)
```

Escreve a posição (e rotação/escala num Transform). Cria um Transform se a entidade não tiver Transform nem Position3D.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>t</code></td><td>table</td><td>Campos x, y, z, rotation, scaleX, scaleY; os campos em falta mantêm o valor atual.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.world.setTransform(e, { x = 1, y = 2 })
```

## addTransform

Lua: `caffeine.world.addTransform`

```
addTransform(entity, t)
```

Alias de `caffeine.world.setTransform`.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>t</code></td><td>table</td><td>Os mesmos campos que setTransform.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.world.addTransform(e, { x = 0, y = 0 })
```

## distanceTo

Lua: `caffeine.world.distanceTo` · Dryad: `caffeine_world_distance`

```
distanceTo(a, b) -> number
```

Distância em linha reta entre duas entidades.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>a</code></td><td>integer</td><td>Id da primeira entidade.</td></tr>
<tr><td><code>b</code></td><td>integer</td><td>Id da segunda entidade.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Distância em unidades do mundo; 1e9 se alguma entidade não tiver posição ou não houver mundo.

**Exemplo**

```lua
local d = caffeine.world.distanceTo(e, target)
```

## findNearest

Lua: `caffeine.world.findNearest`

```
findNearest(from, maxDist) -> integer
```

Encontra a entidade mais próxima, com Position3D ou Transform, dentro de maxDist.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>from</code></td><td>integer</td><td>Entidade à volta da qual procurar.</td></tr>
<tr><td><code>maxDist</code></td><td>number</td><td>Raio de pesquisa; tem de ser maior que 0.</td></tr>
</tbody>
</table>

**Devolve:** `integer`. Id da entidade mais próxima com posição, ou 0.

**Exemplo**

```lua
local near = caffeine.world.findNearest(e, 10)
```

## setYawPitch

Lua: `caffeine.world.setYawPitch`

```
setYawPitch(entity, yaw, pitch)
```

Define uma rotação 3D (quaternião de Rotation3D, roll 0). Se a entidade tiver Transform, a rotação x/y também é escrita em graus.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>yaw</code></td><td>number</td><td>Guinada em radianos.</td></tr>
<tr><td><code>pitch</code></td><td>number</td><td>Inclinação em radianos.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.world.setYawPitch(e, caffeine.math.radians(90), 0)
```

## getRigidBody2D

Lua: `caffeine.world.getRigidBody2D`

```
getRigidBody2D(entity) -> table
```

Lê o corpo rígido 2D de uma entidade.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `table`. {mass, restitution, friction, linearDamping, isKinematic, lockRotation, velocityX, velocityY}; vazia se não houver RigidBody2D.

**Exemplo**

```lua
local rb = caffeine.world.getRigidBody2D(e)
```

## setRigidBody2D

Lua: `caffeine.world.setRigidBody2D`

```
setRigidBody2D(entity, t)
```

Adiciona um RigidBody2D se não existir e escreve-o. Os campos omitidos voltam aos valores por omissão indicados, exceto velocityX/velocityY, que mantêm o valor.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>t</code></td><td>table</td><td>Campos mass (1), restitution (0.3), friction (0.5), linearDamping (0), isKinematic (false), lockRotation (true), velocityX, velocityY.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.world.setRigidBody2D(e, { mass = 2, friction = 0.8 })
```

## getVelocity

Lua: `caffeine.world.getVelocity`

```
getVelocity(entity) -> table
```

Lê a velocidade 2D do corpo rígido.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `table`. {x, y}; 0 se não houver RigidBody2D.

**Exemplo**

```lua
local v = caffeine.world.getVelocity(e)
```

## setVelocity

Lua: `caffeine.world.setVelocity`

```
setVelocity(entity, v)
```

Define a velocidade 2D (adiciona um RigidBody2D se não existir) e acorda o corpo.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>v</code></td><td>table</td><td>{x, y}; os campos em falta mantêm o valor atual.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.world.setVelocity(e, { x = 5, y = 0 })
```

## getSprite

Lua: `caffeine.world.getSprite`

```
getSprite(entity) -> table
```

Lê o nome e o índice de frame do sprite.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `table`. {name, frameIndex}; vazia se não houver Sprite.

**Exemplo**

```lua
local s = caffeine.world.getSprite(e)
```

## setSprite

Lua: `caffeine.world.setSprite`

```
setSprite(entity, t)
```

Adiciona um Sprite se não existir e escreve o nome e o índice de frame.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>t</code></td><td>table</td><td>Campos name (texto, por omissão "") e frameIndex (por omissão 0).</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.world.setSprite(e, { name = 'hero', frameIndex = 2 })
```

## addSprite

Lua: `caffeine.world.addSprite`

```
addSprite(entity, t)
```

Alias de `caffeine.world.setSprite`.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>t</code></td><td>table</td><td>Os mesmos campos que setSprite.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.world.addSprite(e, { name = 'hero' })
```

## addParticleEmitter

Lua: `caffeine.world.addParticleEmitter`

```
addParticleEmitter(entity, t)
```

Adiciona um componente emissor de partículas à entidade (e um Transform se não existir).

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>t</code></td><td>table</td><td>Campos maxParticles (100), emissionRate (10), lifetime (2), startSize (1), endSize (0), startColor e endColor ({r,g,b,a} em 0..1).</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
caffeine.world.addParticleEmitter(e, { emissionRate = 30, lifetime = 1.5 })
```

## caffeine_world_is_alive

Lua: indisponível · Dryad: `caffeine_world_is_alive`

```
caffeine_world_is_alive(entity) -> boolean
```

Apenas Dryad: verifica se um id ainda corresponde a uma entidade viva.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `boolean`. Verdadeiro se a entidade existir.

**Exemplo**

```dryad
function onUpdate(entity, dt) {
  if (caffeine_world_is_alive(entity)) { caffeine_translate(entity, 0, dt, 0); }
}
```

## caffeine_set_position

Lua: indisponível · Dryad: `caffeine_set_position`

```
caffeine_set_position(entity, x, y, z)
```

Apenas Dryad: define a posição de uma entidade (Position3D e/ou Transform; é criado um Transform se não tiver nenhum).

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>x</code></td><td>number</td><td>X.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Y.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Z.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```dryad
caffeine_set_position(entity, 0, 1, 0);
```

## caffeine_translate

Lua: indisponível · Dryad: `caffeine_translate`

```
caffeine_translate(entity, dx, dy, dz)
```

Apenas Dryad: move uma entidade por um deslocamento.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>dx</code></td><td>number</td><td>Deslocamento em X.</td></tr>
<tr><td><code>dy</code></td><td>number</td><td>Deslocamento em Y.</td></tr>
<tr><td><code>dz</code></td><td>number</td><td>Deslocamento em Z.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```dryad
caffeine_translate(entity, 1 * dt, 0, 0);
```

## caffeine_get_position_x

Lua: indisponível · Dryad: `caffeine_get_position_x`

```
caffeine_get_position_x(entity) -> number
```

Apenas Dryad: lê a posição X de uma entidade.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Posição em X; 0 se a entidade não tiver.

**Exemplo**

```dryad
let p = caffeine_get_position_x(entity);
```

## caffeine_get_position_y

Lua: indisponível · Dryad: `caffeine_get_position_y`

```
caffeine_get_position_y(entity) -> number
```

Apenas Dryad: lê a posição Y de uma entidade.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Posição em Y; 0 se a entidade não tiver.

**Exemplo**

```dryad
let p = caffeine_get_position_y(entity);
```

## caffeine_get_position_z

Lua: indisponível · Dryad: `caffeine_get_position_z`

```
caffeine_get_position_z(entity) -> number
```

Apenas Dryad: lê a posição Z de uma entidade.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Posição em Z; 0 se a entidade não tiver.

**Exemplo**

```dryad
let p = caffeine_get_position_z(entity);
```

## caffeine_set_scale

Lua: indisponível · Dryad: `caffeine_set_scale`

```
caffeine_set_scale(entity, x, y, z)
```

Apenas Dryad: define a escala de uma entidade (Scale3D ou Transform).

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
<tr><td><code>x</code></td><td>number</td><td>Escala em X.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Escala em Y.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Escala em Z.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```dryad
caffeine_set_scale(entity, 2, 2, 2);
```

## caffeine_get_scale_x

Lua: indisponível · Dryad: `caffeine_get_scale_x`

```
caffeine_get_scale_x(entity) -> number
```

Apenas Dryad: lê a escala X de uma entidade.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Escala em X; 1 se a entidade não tiver.

**Exemplo**

```dryad
let s = caffeine_get_scale_x(entity);
```

## caffeine_get_scale_y

Lua: indisponível · Dryad: `caffeine_get_scale_y`

```
caffeine_get_scale_y(entity) -> number
```

Apenas Dryad: lê a escala Y de uma entidade.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Escala em Y; 1 se a entidade não tiver.

**Exemplo**

```dryad
let s = caffeine_get_scale_y(entity);
```

## caffeine_get_scale_z

Lua: indisponível · Dryad: `caffeine_get_scale_z`

```
caffeine_get_scale_z(entity) -> number
```

Apenas Dryad: lê a escala Z de uma entidade.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Id da entidade.</td></tr>
</tbody>
</table>

**Devolve:** `number`. Escala em Z; 1 se a entidade não tiver.

**Exemplo**

```dryad
let s = caffeine_get_scale_z(entity);
```

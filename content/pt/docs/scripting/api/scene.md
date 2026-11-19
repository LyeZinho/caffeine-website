# Cena

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Game</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 4 · Dryad 4</span>
</div>

<p class="doc-lede">Mudança entre cenas. O pedido é diferido: o mundo é substituído depois dos scripts do frame atual, por isso pode chamá-lo de qualquer hook. A aplicação runtime trata os pedidos; outros hosts podem não tratar. Uma mudança de cena remove todas as entidades, por isso guarde em `caffeine.session` os dados de que precisa.</p>

[Todos os namespaces](index.md)

Namespace: `caffeine.scene` · Dryad prefix: `caffeine_scene_`

## load

Lua: `caffeine.scene.load` · Dryad: `caffeine_scene_load`

```
load(path)
```

Pede ao host para carregar uma cena, substituindo a atual. Um ficheiro em falta ou ilegível é reportado e a cena atual mantém-se.

<table>
<thead><tr><th>Parâmetros</th><th>Tipo</th><th>Descrição</th></tr></thead>
<tbody>
<tr><td><code>path</code></td><td>string</td><td>Ficheiro de cena, relativo à raiz do projeto ou absoluto.</td></tr>
</tbody>
</table>

**Devolve:** nada

**Exemplo**

```lua
if caffeine.session.get("coins") >= 10 then caffeine.scene.load("scenes/win.scene") end
```

## reload

Lua: `caffeine.scene.reload` · Dryad: `caffeine_scene_reload`

```
reload()
```

Recarrega a cena atual do disco, repondo o seu estado guardado.

**Devolve:** nada

**Exemplo**

```lua
caffeine.scene.reload() -- restart the level
```

## current

Lua: `caffeine.scene.current` · Dryad: `caffeine_scene_current`

```
current() -> string
```

Devolve a cena carregada.

**Devolve:** `string`. O caminho da cena carregada tal como foi dado ao host (vazio se desconhecido).

**Exemplo**

```lua
caffeine.debug.log(caffeine.scene.current())
```

## isLoading

Lua: `caffeine.scene.isLoading` · Dryad: `caffeine_scene_is_loading`

```
isLoading() -> boolean
```

Indica se há uma mudança de cena à espera de acontecer.

**Devolve:** `boolean`. true depois de load ou reload serem pedidos e antes de o host os tratar.

**Exemplo**

```lua
if caffeine.scene.isLoading() then return end
```

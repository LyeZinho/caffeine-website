# Component

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span class="doc-badge">Core</span>
  <span>Last updated: <time datetime="2026-11-19">2026-11-19</time></span>
  <span>Lua 9 · Dryad 14</span>
</div>

<p class="doc-lede">Generic access to every component the reflection registry describes: list, add, remove, read and write fields by name.</p>

[All namespaces](index.md)

Namespace: `caffeine.component` · Dryad prefix: `caffeine_component_`

## list

Lua: `caffeine.component.list` · Dryad: `caffeine_component_list`

```
list() -> table
```

Lists every component type the reflection registry describes, with its fields. In Dryad it returns only the names.

**Returns:** `table`. Array of {name, id, fields}; each field has name, kind, min, max and options (enums).

**Example**

```lua
for _, c in ipairs(caffeine.component.list()) do caffeine.debug.log(c.name) end
```

## names

Lua: `caffeine.component.names` · Dryad: `caffeine_component_names`

```
names(entity) -> table
```

Lists the components the entity has. Errors when the entity does not exist.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
</tbody>
</table>

**Returns:** `table`. Array of component names.

**Example**

```lua
local names = caffeine.component.names(e)
```

## has

Lua: `caffeine.component.has` · Dryad: `caffeine_component_has`

```
has(entity, name) -> boolean
```

Checks whether an entity has a component. Errors on an unknown component name.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Component name as listed by `caffeine.component.list()`.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. True when the entity has the component.

**Example**

```lua
if caffeine.component.has(e, 'Rigid Body 3D') then end
```

## add

Lua: `caffeine.component.add` · Dryad: `caffeine_component_add`

```
add(entity, name) -> boolean
```

Adds a component with default values; does nothing if the entity already has it. In Dryad it returns false and logs an error on failure.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Component name as listed by `caffeine.component.list()`.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. true on success.

**Example**

```lua
caffeine.component.add(e, 'Rigid Body 3D')
```

## remove

Lua: `caffeine.component.remove` · Dryad: `caffeine_component_remove`

```
remove(entity, name) -> boolean
```

Removes a component from an entity.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Component name as listed by `caffeine.component.list()`.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. True when the component was removed, false when the entity did not have it.

**Example**

```lua
caffeine.component.remove(e, 'Rigid Body 3D')
```

## get

Lua: `caffeine.component.get` · Dryad: `caffeine_component_get`

```
get(entity, name) -> table|nil
```

Reads all fields of a component. Vectors are {x, y, z}; colours and 4D vectors also carry r, g, b, a; enums are option names.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Component name as listed by `caffeine.component.list()`.</td></tr>
</tbody>
</table>

**Returns:** `table`. Table of every field, or nil when the entity lacks the component.

**Example**

```lua
local rb = caffeine.component.get(e, 'Rigid Body 3D')
```

## getField

Lua: `caffeine.component.getField` · Dryad: `caffeine_component_get_field`

```
getField(entity, name, field) -> any
```

Reads one field. Errors on an unknown component or field, or when the entity lacks the component (Dryad logs the error and returns null).

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Component name as listed by `caffeine.component.list()`.</td></tr>
<tr><td><code>field</code></td><td>string</td><td>Field name.</td></tr>
</tbody>
</table>

**Returns:** `any`. The field value.

**Example**

```lua
local mass = caffeine.component.getField(e, 'Rigid Body 3D', 'Mass')
```

## setField

Lua: `caffeine.component.setField` · Dryad: `caffeine_component_set_field`

```
setField(entity, name, field, value)
```

Writes one field. The entity must already have the component (use `caffeine.component.add`); a wrong value type raises an error.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Component name as listed by `caffeine.component.list()`.</td></tr>
<tr><td><code>field</code></td><td>string</td><td>Field name.</td></tr>
<tr><td><code>value</code></td><td>any</td><td>New value: number, boolean, text, enum option name or index, or a vector table.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.component.setField(e, 'Rigid Body 3D', 'Mass', 7.5)
```

## set

Lua: `caffeine.component.set` · Dryad: `caffeine_component_set`

```
set(entity, name, values)
```

Adds the component when missing and writes the given fields.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Component name as listed by `caffeine.component.list()`.</td></tr>
<tr><td><code>values</code></td><td>table</td><td>Map of field name to value; omitted fields keep their value.</td></tr>
</tbody>
</table>

**Returns:** none

**Example**

```lua
caffeine.component.set(e, 'Rigid Body 3D', { Mass = 3 })
```

## caffeine_component_get_number

Lua: not available · Dryad: `caffeine_component_get_number`

```
caffeine_component_get_number(entity, name, field[, index]) -> number
```

Dryad only: reads a numeric, boolean or enum field, or one part of a vector.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Component name as listed by `caffeine.component.list()`.</td></tr>
<tr><td><code>field</code></td><td>string</td><td>Field name.</td></tr>
<tr><td><code>index</code></td><td>integer</td><td>Vector part (0 = x); default 0.</td></tr>
</tbody>
</table>

**Returns:** `number`. Number; integers, enum indices and bools come back as integer/boolean. null on error.

**Example**

```dryad
let mass = caffeine_component_get_number(entity, "Rigid Body 3D", "Mass");
```

## caffeine_component_set_number

Lua: not available · Dryad: `caffeine_component_set_number`

```
caffeine_component_set_number(entity, name, field, value[, index]) -> boolean
```

Dryad only: writes a numeric, boolean or enum-index field, or one part of a vector.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Component name as listed by `caffeine.component.list()`.</td></tr>
<tr><td><code>field</code></td><td>string</td><td>Field name.</td></tr>
<tr><td><code>value</code></td><td>number</td><td>Number (or boolean).</td></tr>
<tr><td><code>index</code></td><td>integer</td><td>Vector part (0 = x); default 0.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. True on success.

**Example**

```dryad
caffeine_component_set_number(entity, "Rigid Body 3D", "Mass", 7.5);
```

## caffeine_component_set_vec

Lua: not available · Dryad: `caffeine_component_set_vec`

```
caffeine_component_set_vec(entity, name, field, x, y[, z[, w]]) -> boolean
```

Dryad only: writes a whole vector or colour field from its parts.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Component name as listed by `caffeine.component.list()`.</td></tr>
<tr><td><code>field</code></td><td>string</td><td>Field name.</td></tr>
<tr><td><code>x</code></td><td>number</td><td>First part.</td></tr>
<tr><td><code>y</code></td><td>number</td><td>Second part.</td></tr>
<tr><td><code>z</code></td><td>number</td><td>Third part (optional).</td></tr>
<tr><td><code>w</code></td><td>number</td><td>Fourth part (optional).</td></tr>
</tbody>
</table>

**Returns:** `boolean`. True when every part was written.

**Example**

```dryad
caffeine_component_set_vec(entity, "Position 3D", "Position", 4, 5, 6);
```

## caffeine_component_get_text

Lua: not available · Dryad: `caffeine_component_get_text`

```
caffeine_component_get_text(entity, name, field) -> string
```

Dryad only: reads a string field or an enum option name.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Component name as listed by `caffeine.component.list()`.</td></tr>
<tr><td><code>field</code></td><td>string</td><td>Field name.</td></tr>
</tbody>
</table>

**Returns:** `string`. Text or enum label; null on error.

**Example**

```dryad
let kind = caffeine_component_get_text(entity, "Mesh Filter", "Primitive");
```

## caffeine_component_set_text

Lua: not available · Dryad: `caffeine_component_set_text`

```
caffeine_component_set_text(entity, name, field, text) -> boolean
```

Dryad only: writes a string field or sets an enum by option name.

<table>
<thead><tr><th>Parameters</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
<tr><td><code>entity</code></td><td>integer</td><td>Entity id.</td></tr>
<tr><td><code>name</code></td><td>string</td><td>Component name as listed by `caffeine.component.list()`.</td></tr>
<tr><td><code>field</code></td><td>string</td><td>Field name.</td></tr>
<tr><td><code>text</code></td><td>string</td><td>Text or enum option name.</td></tr>
</tbody>
</table>

**Returns:** `boolean`. True on success.

**Example**

```dryad
caffeine_component_set_text(entity, "Mesh Filter", "Primitive", "Cone");
```

# Referência da UI do Doppio

Gerado por `cargo test -p doppio-ui capture_ui_gallery -- --ignored`. As descrições vivem em `doppio/docs/ui-captions.json`.

## `editor.toolbar.undo`

![editor.toolbar.undo](../images/ui-reference/editor-toolbar-undo.png)

Desfaz o último passo do editor.

## `editor.toolbar.redo`

![editor.toolbar.redo](../images/ui-reference/editor-toolbar-redo.png)

Refaz o último passo desfeito.

## `editor.toolbar.add_entity`

![editor.toolbar.add_entity](../images/ui-reference/editor-toolbar-add_entity.png)

Cria uma entidade nova na cena atual e seleciona-a.

## `editor.toolbar.toggle_play`

![editor.toolbar.toggle_play](../images/ui-reference/editor-toolbar-toggle_play.png)

Inicia ou para o modo de jogo e avança o motor.

## `editor.toolbar.save`

![editor.toolbar.save](../images/ui-reference/editor-toolbar-save.png)

Guarda a cena .caf atual e limpa o marcador de alterações.

## `editor.toolbar.render`

![editor.toolbar.render](../images/ui-reference/editor-toolbar-render.png)

Pede um render offscreen do viewport.

## `editor.toolbar.log`

![editor.toolbar.log](../images/ui-reference/editor-toolbar-log.png)

Escreve uma linha de exemplo no console (auxiliar de testes).

## `editor.pane.hierarchy`

![editor.pane.hierarchy](../images/ui-reference/editor-pane-hierarchy.png)

Hierarquia da cena: lista as entidades e permite selecionar.

## `editor.pane.assets`

![editor.pane.assets](../images/ui-reference/editor-pane-assets.png)

Assets do projeto encontrados na raiz de assets carregada.

## `editor.pane.viewport`

![editor.pane.viewport](../images/ui-reference/editor-pane-viewport.png)

Render do motor para a cena atual, com controlos de câmara.

## `editor.pane.inspector`

![editor.pane.inspector](../images/ui-reference/editor-pane-inspector.png)

Transformação e ações da entidade selecionada.

## `editor.pane.console`

![editor.pane.console](../images/ui-reference/editor-pane-console.png)

Registo do editor: seleções, edições, gravação e frames.

## `viewport.canvas.surface`

![viewport.canvas.surface](../images/ui-reference/viewport-canvas-surface.png)

Imagem do motor apresentada dentro do painel de viewport.

## `viewport.camera.orbit_left`

![viewport.camera.orbit_left](../images/ui-reference/viewport-camera-orbit_left.png)

Roda a câmara do viewport para a esquerda.

## `viewport.camera.orbit_right`

![viewport.camera.orbit_right](../images/ui-reference/viewport-camera-orbit_right.png)

Roda a câmara do viewport para a direita.

## `viewport.camera.zoom_in`

![viewport.camera.zoom_in](../images/ui-reference/viewport-camera-zoom_in.png)

Aproxima a câmara do ponto de foco.

## `viewport.camera.zoom_out`

![viewport.camera.zoom_out](../images/ui-reference/viewport-camera-zoom_out.png)

Afasta a câmara do ponto de foco.

## `viewport.camera.reset`

![viewport.camera.reset](../images/ui-reference/viewport-camera-reset.png)

Repõe a posição de câmara predefinida.

## `inspector.entity.name`

![inspector.entity.name](../images/ui-reference/inspector-entity-name.png)

Nome editável da entidade selecionada; chega ao motor.

## `inspector.entity.delete`

![inspector.entity.delete](../images/ui-reference/inspector-entity-delete.png)

Destrói a entidade selecionada no mundo do motor.

## `inspector.add_component`

![inspector.add_component](../images/ui-reference/inspector-add_component.png)

Adiciona um componente à entidade selecionada.

## `hierarchy.list.entity_row.0`

![hierarchy.list.entity_row.0](../images/ui-reference/entity-row-0.png)

A row in the hierarchy list; rows use the .N suffix.

## `hierarchy.list.entity_row.1`

![hierarchy.list.entity_row.1](../images/ui-reference/entity-row-1.png)

A row in the hierarchy list; rows use the .N suffix.

## `annotated.inspector`

![annotated.inspector](../images/ui-reference/annotated-inspector.png)

Controlos do inspector, numerados para documentação.


# Referência da API de scripting

<div class="doc-meta">
  <span class="doc-badge doc-badge--reference">Reference</span>
  <span>Última atualização: <time datetime="2026-11-19">2026-11-19</time></span>
</div>

<p class="doc-lede">Todas as funções que o engine expõe aos scripts, agrupadas como uma biblioteca padrão. Os nomes Lua aparecem como caffeine.&lt;namespace&gt;.&lt;função&gt;; o native Dryad é mostrado quando existe.</p>

210 funções em 26 namespaces.

## Core

| Namespace | Funções | Descrição |
|---|---|---|
| [Componente](component.md) | 14 | Acesso genérico a todos os componentes descritos no registo de reflexão: listar, adicionar, remover, ler e escrever campos pelo nome. |
| [Núcleo](core.md) | 1 | Auxiliares de topo da tabela caffeine. |
| [Depuração](debug.md) | 3 | Registo na consola do motor. |
| [Entidade](entity.md) | 5 | Nomes e procura. As entidades são ids numéricos; o nome é opcional e não tem de ser único. |
| [Hierarquia](hierarchy.md) | 6 | Ligações pai e filho entre entidades. O transform do filho compõe-se com o do pai. |
| [Matemática](math.md) | 23 | Tabelas de vetor ({x, y[, z]}), auxiliares escalares e conversão de ângulos. Define também as constantes caffeine.math.pi e caffeine.math.epsilon (1e-5). |
| [Aleatório](random.md) | 5 | Um gerador determinístico: a mesma semente dá sempre a mesma sequência, em todas as plataformas. |
| [Tempo](time.md) | 11 | O relógio de jogo: tempo de frame com e sem escala, o passo fixo, pausa e a semente aleatória determinística. |
| [Mundo](world.md) | 27 | Criar e destruir entidades, movê-las e ler ou escrever transformações, física 2D, sprites e emissores de partículas. O Dryad acrescenta natives de posição e escala. |

## Input

| Namespace | Funções | Descrição |
|---|---|---|
| [Entrada](input.md) | 11 | Teclado, eixos e ações mapeados e o rato. O Dryad espelha-os com as natives caffeine_input_*. |
| [Seleção](pick.md) | 8 | Encontrar a entidade sob um ponto, uma posição do ecrã, o rato ou um raio 3D, e registar seletores personalizados. |

## Physics

| Namespace | Funções | Descrição |
|---|---|---|
| [Física 3D](physics3d.md) | 7 | Consultas por raio e forças no mundo 3D Bullet. Tudo é um no-op seguro (false ou nil) quando o host corre sem física 3D. Forças e velocidade só afetam corpos dinâmicos. |

## Game

| Namespace | Funções | Descrição |
|---|---|---|
| [Recursos](assets.md) | 1 | Ler recursos do projeto a partir de scripts. |
| [Eventos](events.md) | 3 | Um barramento simples de eventos nomeados: subscrever, emitir e cancelar a subscrição. |
| [Estado de jogo](gameState.md) | 5 | Uma pilha opcional de estados de jogo nomeados. |
| [Módulos nativos](native.md) | 2 | Carregar e chamar módulos nativos através de JSON. |

## World

| Namespace | Funções | Descrição |
|---|---|---|
| [Mapa](map.md) | 1 | Ganchos para pedidos de chunks de superfícies de mapa. |
| [Navegação](navigation.md) | 5 | Agentes de navegação: destinos, pontos de patrulha, alvos a seguir e scripts de comportamento. |
| [Procedural](procedural.md) | 12 | Auxiliares de ruído determinístico, streaming de chunks e geração de terreno para mundos procedurais. |

## Rendering

| Namespace | Funções | Descrição |
|---|---|---|
| [Animação](animation.md) | 7 | Controlo de animação por clips, máquina de estados, malhas com skin e sprite sheets. |
| [Efeitos](effects.md) | 6 | Componentes de efeitos em entidades: partículas, luz volumétrica, superfícies refletoras, sombreados de material e nevoeiro. |
| [Render forward](forwardrender.md) | 6 | Funcionalidades do renderer forward por entidade: instancing, iluminação baseada em imagem, oclusão, reflexos e volumétricos. |
| [Partículas](particles.md) | 1 | Emissão manual de partículas em entidades com um emissor de partículas. |
| [Pós-processamento](postprocess.md) | 29 | Efeitos de pós-processamento por entidade, como bloom, vinheta, correção de cor e nevoeiro, com presets e acesso a campos por caminho. |

## UI

| Namespace | Funções | Descrição |
|---|---|---|
| [Desenho 2D](draw2d.md) | 5 | Formas 2D de sobreposição em modo imediato (linhas, círculos, retângulos, polilinhas) em espaço de mundo ou de ecrã. |
| [Interface](ui.md) | 6 | Criar canvases, rótulos e botões, atualizá-los e testar acertos em posições do ecrã. |

## Como esta página é construída

Gerada a partir do registo da API no repositório do engine; um teste falha quando um binding não está documentado. Não editar à mão.

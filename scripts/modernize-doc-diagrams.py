#!/usr/bin/env python3
"""Modernize ASCII diagrams in all content/**/*.md → Mermaid or structured Markdown."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"

BOX_HEAVY = re.compile(r"[╔╗╚╝║╠╣╬]")
BOX_LIGHT = re.compile(r"[┌┐└┘├┤┬┴┼─│╭╮╰╯▼►◄]")
FENCE = re.compile(r"```([^\n]*)\n([\s\S]*?)```", re.MULTILINE)
CODE_HINT = re.compile(
    r"(#include|namespace\s+\w|std::|template\s*<|^\s*(void|class|struct|enum)\s|\{\s*$|;\s*$|//\s*──)",
    re.MULTILINE,
)
SKIP_LANG = {
    "cpp",
    "c",
    "c++",
    "hpp",
    "hlsl",
    "glsl",
    "json",
    "bash",
    "sh",
    "cmake",
    "python",
    "py",
    "lua",
    "rust",
    "java",
    "typescript",
    "ts",
    "javascript",
    "js",
    "mermaid",
    "svg",
    "xml",
    "yaml",
    "yml",
}


def strip_box(line: str) -> str:
    return re.sub(r"\s{2,}", " ", BOX_LIGHT.sub(" ", line)).strip()


def esc_mermaid(label: str) -> str:
    return label.replace('"', "'").replace("\n", " ").strip()[:120]


def box_block_to_callout(body: str) -> str:
    lines = [strip_box(l) for l in body.splitlines()]
    lines = [l for l in lines if l]
    return "\n".join(f"> {l}" for l in lines) if lines else body


def tree_to_markdown_list(body: str) -> str | None:
    if not any(x in body for x in ("├──", "└──", "│")):
        return None
    lines = [l.rstrip() for l in body.splitlines() if l.strip()]
    tree_lines = sum(1 for l in lines if "├──" in l or "└──" in l)
    if tree_lines < 2:
        return None
    bullets: list[str] = []
    for line in lines:
        depth = line.count("│")
        if "├──" in line or "└──" in line:
            depth += 1
        name = re.sub(r"^[\s│├└─]+", "", line).strip()
        if not name:
            continue
        bullets.append(f"{'  ' * depth}- `{name}`")
    return "\n".join(bullets) if bullets else None


def vertical_state_diagram(body: str) -> str | None:
    if "▼" not in body and not re.search(r"^\s*[│|]\s*$", body, re.M):
        return None
    if CODE_HINT.search(body):
        return None
    nodes: list[str] = []
    for line in body.splitlines():
        t = strip_box(line)
        if not t or t in {"|", "▼"}:
            continue
        if re.search(r"[──►→◄]", t):
            parts = re.split(r"\s*[──►→◄]+\s*", t)
            nodes.extend(p.strip() for p in parts if p.strip())
        else:
            nodes.append(t)
    nodes = [n for n in nodes if n]
    if len(nodes) < 2:
        return None
    lines = ["```mermaid", "stateDiagram-v2"]
    for i in range(len(nodes) - 1):
        lines.append(f"  {nodes[i]} --> {nodes[i+1]}")
    lines.append("```")
    return "\n".join(lines)


def horizontal_state_diagram(body: str) -> str | None:
    lines = [l.strip() for l in body.splitlines() if l.strip()]
    if not lines or len(lines) > 3:
        return None
    joined = " ".join(lines)
    if not re.search(r"(──►|->|→|◄──►)", joined):
        return None
    if BOX_HEAVY.search(body):
        return None
    text = joined.replace("◄──►", " <-> ").replace("──►", " -> ").replace("→", " -> ")
    tokens = re.split(r"\s+(?:->|<->)\s+", text)
    tokens = [t.strip() for t in tokens if t.strip()]
    if len(tokens) < 2:
        return None
    out = ["```mermaid", "stateDiagram-v2"]
    for i in range(len(tokens) - 1):
        out.append(f"  {tokens[i]} --> {tokens[i+1]}")
    if "<->" in joined:
        out.append(f"  {tokens[1]} --> {tokens[0]}")
    out.append("```")
    return "\n".join(out)


def arrow_flow_to_mermaid(body: str) -> str | None:
    if CODE_HINT.search(body):
        return None
    lines = [l.rstrip() for l in body.splitlines() if l.strip()]
    if len(lines) < 2:
        return None
    if not any("→" in l or "->" in l for l in lines):
        return None
    if any(x in body for x in ("├──", "└──")) and tree_to_markdown_list(body):
        return tree_to_markdown_list(body)
    edges: list[tuple[str, str]] = []
    prev: str | None = None
    for line in lines:
        raw = line.strip()
        if "→" in raw:
            parts = [p.strip() for p in re.split(r"\s*→\s*", raw) if p.strip()]
            if not parts:
                continue
            if prev and parts[0] != prev:
                edges.append((prev, parts[0]))
            for i in range(len(parts) - 1):
                edges.append((parts[i], parts[i + 1]))
            prev = parts[-1]
        else:
            label = re.sub(r"^[├└│\s]+", "", raw).strip()
            if prev and label:
                edges.append((prev, label))
                prev = label
            elif label:
                prev = label
    if not edges:
        return None
    out = ["```mermaid", "flowchart TD"]
    seen: set[tuple[str, str]] = set()
    for i, (a, b) in enumerate(edges):
        if (a, b) in seen:
            continue
        seen.add((a, b))
        aid, bid = f"n{i}a", f"n{i}b"
        out.append(f'  {aid}["{esc_mermaid(a)}"] --> {bid}["{esc_mermaid(b)}"]')
    out.append("```")
    return "\n".join(out)


def box_diagram_to_mermaid(body: str) -> str | None:
    if not BOX_HEAVY.search(body) and sum(1 for l in body.splitlines() if BOX_LIGHT.search(l)) < 3:
        return None
    rows = []
    for line in body.splitlines():
        t = strip_box(line)
        if t and not re.fullmatch(r"[\-+_=|]+", t):
            rows.append(t)
    if len(rows) < 2:
        return box_block_to_callout(body)
    out = ["```mermaid", "flowchart TB"]
    for i, row in enumerate(rows):
        nid = f"r{i}"
        out.append(f'  {nid}["{esc_mermaid(row)}"]')
        if i:
            out.append(f"  r{i-1} --> {nid}")
    out.append("```")
    return "\n".join(out)


def transform_body(body: str, lang: str | None) -> str | None:
    if lang and lang.lower() in SKIP_LANG:
        return None
    tree = tree_to_markdown_list(body)
    if tree:
        return tree
    if CODE_HINT.search(body) and "→" not in body:
        return None
    if BOX_HEAVY.search(body):
        return box_diagram_to_mermaid(body) or box_block_to_callout(body)
    for fn in (
        vertical_state_diagram,
        horizontal_state_diagram,
        arrow_flow_to_mermaid,
    ):
        out = fn(body)
        if out:
            return out
    if sum(1 for l in body.splitlines() if BOX_LIGHT.search(l)) >= 3 and not CODE_HINT.search(body):
        return box_diagram_to_mermaid(body) or box_block_to_callout(body)
    return None


def process_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    changed = False

    def repl(m: re.Match[str]) -> str:
        nonlocal changed
        lang = (m.group(1) or "").strip()
        body = m.group(2)
        new = transform_body(body, lang or None)
        if new and new != body:
            changed = True
            return new + "\n"
        return m.group(0)

    new_text = FENCE.sub(repl, text)
    if changed:
        path.write_text(new_text, encoding="utf-8")
    return changed


def main() -> None:
    if not CONTENT.is_dir():
        print("missing content/", file=sys.stderr)
        sys.exit(1)
    n = 0
    for md in sorted(CONTENT.rglob("*.md")):
        if process_file(md):
            n += 1
            print(f"updated {md.relative_to(ROOT)}")
    print(f"Done. {n} files updated under content/")


if __name__ == "__main__":
    main()

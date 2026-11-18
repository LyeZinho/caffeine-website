#!/usr/bin/env python3
"""Modernise documentation pages to the HTML-first standard.

- Converts a leading `> **Key:** value` block into a `doc-meta` HTML strip with
  status badges.
- Inserts a metadata strip (status + last updated) when a page has none.
- Converts standalone Markdown images into `<figure>`/`<figcaption>` blocks.
- Leaves generated pages and fenced code untouched.

    python3 scripts/modernize-docs.py            # dry run
    python3 scripts/modernize-docs.py --apply
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = ROOT.parent
TODAY = "2026-11-18"
GENERATED = {"editor/ui-reference.md"}

META_LINE = re.compile(r"^>\s*\*\*(?P<key>[^*]+?):?\*\*\s*(?P<value>.*)$")
IMAGE_LINE = re.compile(r"^\s*!\[(?P<alt>[^\]]+)]\((?P<src>[^)\s]+)(?:\s+\"[^\"]*\")?\)\s*$")
FENCE = re.compile(r"^\s*```")
META_KEYS = {
    "phase", "fase", "namespace", "files", "file", "ficheiro", "arquivo", "arquivos",
    "status", "estado", "rfs", "rf", "milestone", "source", "fonte", "core", "plugin",
    "panel", "painel", "script", "shader", "version", "versão", "platform", "platforms",
    "target", "targets", "category", "owner", "last updated", "atualizado",
}


def status_badge(text: str, rel: str) -> tuple[str, str]:
    value = text.lower()
    if "historical" in value or "histórico" in value:
        return "Historical", "historical"
    if any(word in value for word in ("plano", "planned", "planead", "📅")):
        return "Planned", "planned"
    if any(word in value for word in ("beta", "experimental")):
        return "Experimental", "experimental"
    if any(word in value for word in ("implemented", "complete", "conclu", "✅", "done")):
        return "Stable", "stable"
    if rel.startswith("plans/"):
        return "Historical", "historical"
    if rel.startswith("analysis/") or rel in {
        "AUDIT_REPORT.md",
        "architecture_specs.md",
        "MASTER.md",
        "HISTORY.md",
    }:
        return "Historical", "historical"
    if rel in GENERATED:
        return "Generated", "generated"
    return "Reference", "reference"


def doc_meta(lines: list[str], rel: str, lang: str) -> tuple[list[str], int]:
    """Return the metadata block and the number of leading quote lines consumed."""
    block: list[tuple[str, str]] = []
    consumed = 0
    for line in lines:
        if not line.startswith(">"):
            break
        match = META_LINE.match(line)
        if not match:
            break
        key = match.group("key").strip().rstrip(":")
        if key.lower() not in META_KEYS:
            break
        block.append((key, match.group("value").strip()))
        consumed += 1
        if len(block) >= 8:
            break
    if consumed == 0:
        return [], 0

    status = next(
        (value for key, value in block if key.lower() in {"status", "estado"}), ""
    )
    label, kind = status_badge(status, rel)
    out = ['<div class="doc-meta">', f'  <span class="doc-badge doc-badge--{kind}">{label}</span>']
    for key, value in block:
        if key.lower() in {"status", "estado"}:
            continue
        if not value:
            continue
        out.append(f"  <span><strong>{key}:</strong> {value}</span>")
    date_label = "Last updated" if lang == "en" else "Atualizado"
    out.append(f'  <span>{date_label}: <time datetime="{TODAY}">{TODAY}</time></span>')
    out.append("</div>")
    return out, consumed


def insert_meta(path: Path, text: str, rel: str, lang: str) -> tuple[str, bool]:
    lines = text.splitlines()
    if any("<div class=\"doc-meta\">" in line for line in lines[:12]):
        return text, False

    # Find the first Markdown title.
    title_at = next((i for i, line in enumerate(lines) if line.startswith("# ")), None)
    if title_at is None:
        return text, False

    after = title_at + 1
    while after < len(lines) and not lines[after].strip():
        after += 1
    meta, consumed = doc_meta(lines[after:], rel, lang)
    if consumed:
        end = after + consumed
        replacement = lines[:after] + meta + lines[end:]
        return "\n".join(replacement) + "\n", True

    label, kind = status_badge("", rel)
    date_label = "Last updated" if lang == "en" else "Atualizado"
    meta = [
        '<div class="doc-meta">',
        f'  <span class="doc-badge doc-badge--{kind}">{label}</span>',
        f'  <span>{date_label}: <time datetime="{TODAY}">{TODAY}</time></span>',
        "</div>",
    ]
    replacement = lines[:after] + meta + [""] + lines[after:]
    return "\n".join(replacement) + "\n", True


def convert_images(text: str, lang: str) -> tuple[str, int]:
    lines = text.splitlines()
    out: list[str] = []
    changed = 0
    in_fence = False
    for line in lines:
        if FENCE.match(line):
            in_fence = not in_fence
            out.append(line)
            continue
        match = IMAGE_LINE.match(line) if not in_fence else None
        if not match:
            out.append(line)
            continue
        alt = match.group("alt").strip()
        src = match.group("src").strip()
        if not alt:
            out.append(line)
            continue
        # Keep a blank line before the block so Markdown renderers start HTML cleanly.
        if out and out[-1].strip():
            out.append("")
        out.extend(
            [
                f'<figure class="doc-figure">',
                f'  <img src="{src}" alt="{alt}" loading="lazy">',
                f"  <figcaption>{alt}</figcaption>",
                "</figure>",
                "",
            ]
        )
        changed += 1
    return "\n".join(out) + ("\n" if text.endswith("\n") else ""), changed


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    roots = [
        ROOT / "content" / "en" / "docs",
        ROOT / "content" / "pt" / "docs",
        ENGINE / "doppio" / "docs",
    ]
    files = images = 0
    for root in roots:
        for path in sorted(root.rglob("*.md")):
            rel = path.name if root.name == "docs" and root.parent.name == "doppio" else str(
                path.relative_to(root)
            )
            if rel in GENERATED:
                continue
            text = path.read_text(encoding="utf-8")
            lang = "en" if "/en/" in str(path) or root.name == "docs" else "pt"
            new, meta_changed = insert_meta(path, text, rel, lang)
            new, image_changed = convert_images(new, lang)
            if meta_changed or image_changed:
                files += 1
                images += image_changed
                if args.apply:
                    path.write_text(new, encoding="utf-8")
    print(
        f"{'updated' if args.apply else 'would update'} {files} page(s), "
        f"{images} image(s)"
    )


if __name__ == "__main__":
    main()

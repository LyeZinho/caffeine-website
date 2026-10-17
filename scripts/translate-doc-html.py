#!/usr/bin/env python3
"""Translate text in doc HTML (skips pre/code). Batches strings to respect API limits."""
from __future__ import annotations

import re
import sys
import time
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString, Tag
from deep_translator import GoogleTranslator

SKIP_TAGS = {"pre", "code", "script", "style"}
BATCH = 40
PAUSE_SEC = 1.2


def in_skipped_tree(node: Tag) -> bool:
    for parent in node.parents:
        if isinstance(parent, Tag) and parent.name in SKIP_TAGS:
            return True
    return False


def needs_translation(text: str) -> bool:
    text = text.strip()
    if not text:
        return False
    return bool(re.search(r"[À-ÿ]", text)) or bool(
        re.search(
            r"\b(dos|das|para|não|está|são|como|este|esta|todos|todas|uso|fase|completo|planejado)\b",
            text,
            re.I,
        ),
    )


def translate_batch(strings: list[str], translator: GoogleTranslator) -> list[str]:
    for attempt in range(5):
        try:
            return translator.translate_batch(strings)
        except Exception as exc:  # noqa: BLE001
            wait = PAUSE_SEC * (attempt + 2)
            print(f"batch retry in {wait}s: {exc}", file=sys.stderr)
            time.sleep(wait)
    return strings


def main() -> None:
    if len(sys.argv) != 4:
        print("usage: translate-doc-html.py <src.html> <dest.html> <en|es>", file=sys.stderr)
        sys.exit(1)
    src, dest, lang = sys.argv[1], sys.argv[2], sys.argv[3]
    translator = GoogleTranslator(source="pt", target=lang)
    html = Path(src).read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "html.parser")

    nodes: list[NavigableString] = []
    originals: list[str] = []
    for node in soup.descendants:
        if not isinstance(node, NavigableString):
            continue
        if isinstance(node.parent, Tag) and in_skipped_tree(node.parent):
            continue
        raw = str(node)
        if not needs_translation(raw):
            continue
        nodes.append(node)
        originals.append(raw)

    print(f"Translating {len(originals)} fragments in batches of {BATCH}...", file=sys.stderr)
    translated: list[str] = []
    for i in range(0, len(originals), BATCH):
        chunk = originals[i : i + BATCH]
        translated.extend(translate_batch(chunk, translator))
        time.sleep(PAUSE_SEC)

    for node, before, after in zip(nodes, originals, translated, strict=True):
        if after and after != before:
            node.replace_with(after)

    Path(dest).parent.mkdir(parents=True, exist_ok=True)
    Path(dest).write_text(str(soup), encoding="utf-8")
    print(f"Wrote {dest}")


if __name__ == "__main__":
    main()

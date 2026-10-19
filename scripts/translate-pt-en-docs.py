#!/usr/bin/env python3
"""Mirror content/pt/docs -> content/en/docs; translate .md via Argos pt->en."""
from __future__ import annotations

import re
import shutil
import sys
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PT = ROOT / "content" / "pt" / "docs"
EN = ROOT / "content" / "en" / "docs"

PT_HINT = re.compile(
    r"[À-ÿ]|\b(não|nao|ção|ções|também|apenas|através|implementado|módulo|arquivo|"
    r"testes|visão|geral|fase|arquivos|status|referências|histórico)\b",
    re.IGNORECASE,
)
HEADING = re.compile(r"^(#{1,6})\s+(.*)$")
BLOCKQUOTE = re.compile(r"^(>\s*)(.*)$")
LIST_ITEM = re.compile(r"^(\s*(?:[-*+]|\d+\.)\s+)(.*)$")
HR = re.compile(r"^---+\s*$")
META = re.compile(r"^(\*\*[^*]+\*\*:\s*)(.*)$")
BAD_TRANSLATION = re.compile(r"==References==|==External")


@lru_cache(maxsize=50_000)
def translate_text(text: str) -> str:
    from argostranslate.translate import translate as argos_translate

    text = text.strip()
    if not text:
        return text
    if not PT_HINT.search(text) and re.fullmatch(
        r"[\s\w\./:#\-_+=<>()\[\]{}|*`'\",!?@&;]+", text
    ):
        return text
    chunk_size = 380
    if len(text) <= chunk_size:
        try:
            out = argos_translate(text, "pt", "en")
            if not out.strip() or BAD_TRANSLATION.search(out):
                return text
            return out
        except Exception:
            return text
    parts: list[str] = []
    buf = ""
    for piece in re.split(r"(\.\s+|\n)", text):
        if not piece:
            continue
        if len(buf) + len(piece) > chunk_size and buf.strip():
            parts.append(_translate_chunk(buf))
            buf = piece
        else:
            buf += piece
    if buf.strip():
        parts.append(_translate_chunk(buf))
    return "".join(parts)


def _translate_chunk(text: str) -> str:
    from argostranslate.translate import translate as argos_translate

    text = text.strip()
    if not text:
        return text
    try:
        return argos_translate(text, "pt", "en")
    except Exception:
        return text


def fix_backtick_spacing(text: str) -> str:
    text = re.sub(r"([a-zA-ZÀ-ÿ0-9])`", r"\1 `", text)
    return re.sub(r"`([a-zA-ZÀ-ÿ0-9])", r"` \1", text)


def translate_heading_text(text: str) -> str:
    stripped = text.strip()
    m = re.match(r"^(\S+\s+)(.+)$", stripped)
    if m and not m.group(1)[0].isalnum():
        rest = translate_text(m.group(2))
        body = rest if rest.strip() else m.group(2)
        return f"{m.group(1)}{body}"
    out = translate_inline(stripped)
    return out if out.strip() else stripped


def translate_inline(text: str) -> str:
    if not text:
        return text
    parts = re.split(r"(`[^`\n]+`)", text)
    out: list[str] = []
    for i, part in enumerate(parts):
        if i % 2 == 1:
            out.append(part)
        elif PT_HINT.search(part) or (
            part.strip() and re.search(r"[A-Za-z]{4,}", part) and "http" not in part
        ):
            out.append(translate_text(part))
        else:
            out.append(part)
    return "".join(out)


def translate_markdown_line(line: str) -> str:
    if not line.strip():
        return line
    if HR.match(line):
        return line

    m = META.match(line)
    if m:
        val = translate_inline(m.group(2)) if m.group(2).strip() else m.group(2)
        return f"{m.group(1)}{val}"

    m = HEADING.match(line)
    if m:
        return f"{m.group(1)} {translate_heading_text(m.group(2))}"

    m = BLOCKQUOTE.match(line)
    if m:
        return f"{m.group(1)}{translate_inline(m.group(2))}"

    m = LIST_ITEM.match(line)
    if m:
        return f"{m.group(1)}{translate_inline(m.group(2))}"

    if line.strip().startswith("|"):
        cells = line.split("|")
        translated: list[str] = []
        for cell in cells:
            stripped = cell.strip()
            if not stripped or re.fullmatch(r"[-: ]+", stripped):
                translated.append(cell)
            else:
                pad_l = len(cell) - len(cell.lstrip())
                pad_r = len(cell) - len(cell.rstrip())
                core = translate_inline(stripped)
                translated.append(" " * pad_l + core + " " * pad_r)
        return "|".join(translated)

    return translate_inline(line)


def translate_markdown(body: str) -> str:
    lines = body.splitlines(keepends=True)
    out: list[str] = []
    in_fence = False
    for line in lines:
        bare = line.rstrip("\n\r")
        if bare.startswith("```"):
            in_fence = not in_fence
            out.append(line)
            continue
        if in_fence:
            out.append(line)
            continue
        newline = "\n" if line.endswith("\n") else ""
        if line.endswith("\r\n"):
            newline = "\r\n"
        out.append(translate_markdown_line(bare) + newline)
    return "".join(out)


def main() -> None:
    force = "--force" in sys.argv
    if not PT.is_dir():
        print(f"missing {PT}", file=sys.stderr)
        sys.exit(1)

    md_files = sorted(PT.rglob("*.md"))
    for src in md_files:
        rel = src.relative_to(PT)
        dest = EN / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        if dest.exists() and not force and dest.stat().st_mtime >= src.stat().st_mtime:
            continue
        print(f"translate {rel}")
        dest.write_text(
            translate_markdown(src.read_text(encoding="utf-8")), encoding="utf-8"
        )

    for src in PT.rglob("*"):
        if not src.is_file() or src.suffix.lower() == ".md":
            continue
        rel = src.relative_to(PT)
        dest = EN / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        if dest.exists() and not force and dest.stat().st_mtime >= src.stat().st_mtime:
            continue
        shutil.copy2(src, dest)

    print(f"Done. {len(md_files)} markdown files under {EN}")


if __name__ == "__main__":
    main()

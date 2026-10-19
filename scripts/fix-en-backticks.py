#!/usr/bin/env python3
"""Normalize backtick spacing in content/en/docs markdown (post-translation cleanup)."""
from __future__ import annotations

import re
from pathlib import Path

EN = Path(__file__).resolve().parents[1] / "content" / "en" / "docs"
INLINE = re.compile(r"`([^`\n]+)`")


def normalize_line(line: str) -> str:
    if line.strip().startswith("```"):
        return line

    def repl(m: re.Match[str]) -> str:
        inner = m.group(1).strip()
        return f"`{inner}`"

    return INLINE.sub(repl, line)


def main() -> None:
    n = 0
    for path in sorted(EN.rglob("*.md")):
        text = path.read_text(encoding="utf-8")
        lines = text.splitlines(keepends=True)
        new_lines = [normalize_line(l.rstrip("\n\r")) + ("\n" if l.endswith("\n") else "") for l in lines]
        new_text = "".join(new_lines)
        if new_text != text:
            path.write_text(new_text, encoding="utf-8")
            n += 1
    print(f"Normalized backticks in {n} files.")


if __name__ == "__main__":
    main()

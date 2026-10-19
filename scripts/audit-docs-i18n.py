#!/usr/bin/env python3
"""Compare content/pt/docs vs content/en/docs structure (headings, fences)."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PT = ROOT / "content" / "pt" / "docs"
EN = ROOT / "content" / "en" / "docs"


def metrics(text: str) -> dict[str, int]:
    return {
        "h2": len(re.findall(r"^## ", text, re.M)),
        "h3": len(re.findall(r"^### ", text, re.M)),
        "fences": text.count("```"),
    }


def main() -> None:
    if not PT.is_dir() or not EN.is_dir():
        print("missing pt/docs or en/docs", file=sys.stderr)
        sys.exit(1)

    issues: list[str] = []
    for pt in sorted(PT.rglob("*.md")):
        rel = pt.relative_to(PT)
        en = EN / rel
        if not en.exists():
            issues.append(f"{rel}: missing EN")
            continue
        pt_t = pt.read_text(encoding="utf-8")
        en_t = en.read_text(encoding="utf-8")
        if len(pt_t.splitlines()) != len(en_t.splitlines()):
            issues.append(f"{rel}: line count mismatch")
        pm, em = metrics(pt_t), metrics(en_t)
        if pm != em:
            issues.append(f"{rel}: metrics pt={pm} en={em}")
        if re.search(r"^##\s*$", en_t, re.M):
            issues.append(f"{rel}: empty ## heading")
        if "==References==" in en_t:
            issues.append(f"{rel}: corrupted translation marker")

    print(f"Checked {len(list(PT.rglob('*.md')))} files; {len(issues)} issue(s).")
    for line in issues:
        print(line)
    sys.exit(1 if issues else 0)


if __name__ == "__main__":
    main()

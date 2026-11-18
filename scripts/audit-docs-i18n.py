#!/usr/bin/env python3
"""Compare content/pt/docs with content/en/docs structure.

Translations may wrap lines differently, so this checks the structure a reader
navigates — headings, code fences and images — instead of exact line counts.

    python3 scripts/audit-docs-i18n.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PT = ROOT / "content" / "pt" / "docs"
EN = ROOT / "content" / "en" / "docs"

HEADING = re.compile(r"^(#{1,6})\s+", re.M)
FENCE = re.compile(r"^```([A-Za-z0-9_+.-]*)", re.M)
IMAGE = re.compile(r"!\[[^\]]*]\(([^)\s]+)")


def metrics(text: str) -> dict[str, list[str]]:
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    return {
        "headings": [str(len(level)) for level in HEADING.findall(text)],
        "fences": [lang.lower() for lang in FENCE.findall(text)],
        "images": sorted(Path(target).name for target in IMAGE.findall(text)),
    }


def main() -> None:
    if not PT.is_dir() or not EN.is_dir():
        print("missing pt/docs or en/docs", file=sys.stderr)
        sys.exit(1)

    issues: list[str] = []
    en_files = {p.relative_to(EN) for p in EN.rglob("*.md")}
    pt_files = {p.relative_to(PT) for p in PT.rglob("*.md")}

    for rel in sorted(pt_files - en_files):
        issues.append(f"{rel}: PT page has no EN source")
    for rel in sorted(en_files - pt_files):
        issues.append(f"{rel}: missing PT translation")

    for rel in sorted(en_files & pt_files):
        en_t = (EN / rel).read_text(encoding="utf-8")
        pt_t = (PT / rel).read_text(encoding="utf-8")
        em, pm = metrics(en_t), metrics(pt_t)
        if em["headings"] != pm["headings"]:
            issues.append(
                f"{rel}: heading structure differs (EN {len(em['headings'])} headings, "
                f"PT {len(pm['headings'])})"
            )
        if em["fences"] != pm["fences"]:
            issues.append(
                f"{rel}: code-fence languages differ (EN {em['fences']}, PT {pm['fences']})"
            )
        if em["images"] != pm["images"]:
            issues.append(
                f"{rel}: image list differs (EN {em['images']}, PT {pm['images']})"
            )
        if re.search(r"^##\s*$", en_t, re.M) or re.search(r"^##\s*$", pt_t, re.M):
            issues.append(f"{rel}: empty ## heading")
        if "==References==" in en_t or "==References==" in pt_t:
            issues.append(f"{rel}: corrupted translation marker")

    print(f"Checked {len(en_files)} page(s); {len(issues)} issue(s).")
    for line in issues:
        print(line)
    sys.exit(1 if issues else 0)


if __name__ == "__main__":
    main()

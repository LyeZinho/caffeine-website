#!/usr/bin/env python3
"""Repair source references in documentation.

The engine moved to `src/caffeine/`; the old C++ Doppio editor is frozen under
`doppio-archived/src/doppio/editor/`. This script rewrites inline code spans and
links to the real path (or to GitHub for links), and reports references that
have no current counterpart.

    python3 scripts/fix-doc-paths.py            # dry run
    python3 scripts/fix-doc-paths.py --apply    # write changes
"""
from __future__ import annotations

import argparse
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = ROOT.parent
CONTENT = ROOT / "content"
ENGINE_DOCS = ENGINE / "doppio" / "docs"
GITHUB = "https://github.com/devscafecommunity/caffeine/blob/main"

CODE = re.compile(r"`(src/[^`\n]+)`")
LINK = re.compile(r"(\[[^\]]*]\()((?:\.\./)+src/[^)\s]+)(\))")

IGNORE_PARTS = ("/build/", "/target/", "/.git/")


def source_files() -> dict[str, list[Path]]:
    index: dict[str, list[Path]] = defaultdict(list)
    for base in (ENGINE / "src" / "caffeine", ENGINE / "include" / "caffeine"):
        for path in base.rglob("*"):
            if path.is_file():
                index[path.name].append(path.relative_to(ENGINE))
    for path in (ENGINE / "doppio-archived" / "src" / "doppio" / "editor").rglob("*"):
        if path.is_file():
            index[path.name].append(path.relative_to(ENGINE))
    return index


def clean_reference(ref: str) -> str:
    ref = ref.split("#", 1)[0]
    ref = re.sub(r":\d+(?:[-–,]\d+)*$", "", ref)
    while ref.startswith("../"):
        ref = ref[3:]
    return ref


def candidates(ref: str) -> list[str]:
    """Candidate real paths for a stale reference, most specific first."""
    raw = ref.strip()
    clean = clean_reference(raw).rstrip("/")
    out: list[str] = []

    # 1. The reference may already point to the real tree.
    if (ENGINE / clean).exists():
        return [clean]

    parts = clean.split("/")
    if len(parts) < 2:
        return out

    # 2. src/<module>/... -> src/caffeine/<module>/...
    if parts[0] == "src" and parts[1] != "caffeine":
        out.append("src/caffeine/" + "/".join(parts[1:]))

    # 3. Old scripting module -> script.
    if parts[:2] == ["src", "scripting"]:
        out.append("src/caffeine/script/" + "/".join(parts[2:]))

    # 4. Old editor -> archived C++ Doppio.
    if parts[:2] == ["src", "editor"]:
        out.append("doppio-archived/src/doppio/editor/" + "/".join(parts[2:]))

    # 5. Public header.
    if parts[0] == "src" and len(parts) > 1:
        out.append("include/caffeine/" + "/".join(parts[1:]))

    # 6. Resolve by unique basename (handles moved files and wildcard/brace refs).
    base = Path(parts[-1]).name
    base = re.sub(r"[{},*?].*$", "", base)
    base = re.sub(r"\.(hpp|cpp|h|c)$", "", base)
    return out


def resolve(ref: str, index: dict[str, list[Path]]) -> str | None:
    clean = clean_reference(ref).rstrip("/")
    for candidate in candidates(ref):
        candidate_path = ENGINE / candidate
        if candidate_path.exists():
            return candidate
        if candidate.endswith(".hpp/.cpp"):
            return None
    # Basename fallback.
    base = Path(clean).name
    base = re.sub(r"[{},*?].*$", "", base)
    stem = re.sub(r"\.(hpp|cpp|h|c)$", "", base)
    matches = index.get(base) or index.get(stem + ".hpp") or index.get(stem + ".cpp")
    if matches:
        # Prefer a file in the same module when one is present.
        module = clean.split("/")[1] if clean.startswith("src/") and "/" in clean else ""
        preferred = [m for m in matches if f"/{module}/" in m.as_posix()]
        return str((preferred or matches)[0])
    return None


def rewrite_text(text: str, index: dict[str, list[Path]], unresolved: set[str]) -> tuple[str, int]:
    changed = 0

    def code_repl(match: re.Match[str]) -> str:
        nonlocal changed
        ref = match.group(1)
        if not ref.startswith("src/"):
            return match.group(0)
        if (ENGINE / clean_reference(ref)).exists():
            return match.group(0)
        real = resolve(ref, index)
        if not real:
            unresolved.add(ref)
            return match.group(0)
        changed += 1
        return f"`{real}`"

    text = CODE.sub(code_repl, text)

    def link_repl(match: re.Match[str]) -> str:
        nonlocal changed
        prefix, target, suffix = match.groups()
        real = resolve(target, index)
        if not real:
            unresolved.add(target)
            return match.group(0)
        changed += 1
        return f"{prefix}{GITHUB}/{real}{suffix}"

    text = LINK.sub(link_repl, text)
    return text, changed


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    index = source_files()
    roots = [
        CONTENT / "en" / "docs",
        CONTENT / "pt" / "docs",
        ENGINE_DOCS,
    ]
    total = 0
    unresolved: set[str] = set()
    for root in roots:
        for path in sorted(root.rglob("*.md")):
            text = path.read_text(encoding="utf-8")
            new, changed = rewrite_text(text, index, unresolved)
            if changed:
                total += changed
                print(f"{path.relative_to(ENGINE)}: {changed} reference(s)")
                if args.apply:
                    path.write_text(new, encoding="utf-8")

    print(f"\n{'rewrote' if args.apply else 'would rewrite'} {total} reference(s)")
    if unresolved:
        print(f"{len(unresolved)} unresolved reference(s):")
        for ref in sorted(unresolved):
            print(f"  {ref}")


if __name__ == "__main__":
    main()

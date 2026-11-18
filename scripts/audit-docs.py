#!/usr/bin/env python3
"""Audit the documentation tree.

Checks that every Markdown page follows DOCS_STYLE.md and that links, images and
source references still resolve. Run from `caffeine-website/`:

    python3 scripts/audit-docs.py
    python3 scripts/audit-docs.py --include-engine
    python3 scripts/audit-docs.py --fix-source-paths

Exit code 0 means no errors (warnings do not fail).
"""
from __future__ import annotations

import argparse
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
EN = ROOT / "content" / "en" / "docs"
PT = ROOT / "content" / "pt" / "docs"
ENGINE = ROOT.parent
ENGINE_DOCS = ENGINE / "doppio" / "docs"

LINK = re.compile(r"!?\[[^\]]*]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)")
HTML_URL = re.compile(r"(?:src|href)=\"([^\"]+)\"")
HTML_IMG = re.compile(r"<img\b[^>]*>", re.I)
CODE_SPAN = re.compile(r"`([^`\n]+)`")
H1 = re.compile(r"^#\s+\S", re.M)
HEADING = re.compile(r"^(#{1,6})\s+(.*)$", re.M)
FENCE_LANG = re.compile(r"^```([A-Za-z0-9_+.-]*)", re.M)
OLD_SOURCE = re.compile(
    r"(?<![\w/])(?:src/(?!caffeine(?:/|\b))|apps/doppio/|src/doppio/)"
)
SKIP_SCHEMES = ("http://", "https://", "mailto:", "tel:", "data:", "#", "//")

# Files whose links intentionally point at generated images or live outside the docs tree.
GENERATED = {"editor/ui-reference.md"}
HISTORICAL_PREFIXES = ("plans/", "analysis/")
HISTORICAL_FILES = {"AUDIT_REPORT.md", "architecture_specs.md", "MASTER.md", "HISTORY.md"}


def strip_fences(text: str) -> str:
    """Blank out fenced code while preserving line numbers."""
    return re.sub(
        r"```.*?```",
        lambda match: "\n" * match.group(0).count("\n"),
        text,
        flags=re.S,
    )


def rel(path: Path, base: Path) -> str:
    try:
        return str(path.relative_to(base))
    except ValueError:
        return str(path)


def is_historical(rel_path: str) -> bool:
    return rel_path.startswith(HISTORICAL_PREFIXES) or rel_path in HISTORICAL_FILES


def is_generated(path: Path) -> bool:
    return rel(path, ROOT / "content" / "en" / "docs") in GENERATED or rel(
        path, ROOT / "content" / "pt" / "docs"
    ) in GENERATED


def resolve_target(source: Path, target: str) -> Path | None:
    target = unquote(target.split("#", 1)[0].split("?", 1)[0])
    if not target or target.startswith(SKIP_SCHEMES):
        return None
    candidate = (source.parent / target).resolve()
    return candidate


def audit_links(
    path: Path, text: str, errors: list[str], warnings: list[str], allowed_root: Path
) -> int:
    checked = 0
    prose = strip_fences(text)
    for match in LINK.finditer(prose):
        target = match.group(1)
        resolved = resolve_target(path, target)
        if resolved is None:
            continue
        checked += 1
        line = prose[: match.start()].count("\n") + 1
        if not resolved.exists():
            errors.append(f"{path}:{line}: missing link target {target}")
            continue
        try:
            resolved.relative_to(allowed_root)
        except ValueError:
            errors.append(
                f"{path}:{line}: link escapes the docs tree ({target}); use a GitHub URL"
            )
    for match in HTML_URL.finditer(prose):
        target = match.group(1)
        resolved = resolve_target(path, target)
        if resolved is None:
            continue
        checked += 1
        if not resolved.exists():
            line = text[: match.start()].count("\n") + 1
            errors.append(f"{path}:{line}: missing HTML target {target}")
    return checked


def audit_images(path: Path, text: str, errors: list[str]) -> int:
    checked = 0
    prose = strip_fences(text)
    for match in re.finditer(r"!\[([^\]]*)]\(([^)\s]+)", prose):
        alt, target = match.group(1).strip(), match.group(2)
        checked += 1
        line = text[: match.start()].count("\n") + 1
        if not alt:
            errors.append(f"{path}:{line}: image has no alt text")
        resolved = resolve_target(path, target)
        if resolved and not resolved.exists():
            errors.append(f"{path}:{line}: missing image {target}")
    for match in HTML_IMG.finditer(text):
        tag = match.group(0)
        checked += 1
        line = text[: match.start()].count("\n") + 1
        if not re.search(r"\balt=\"[^\"]+\"", tag, re.I):
            errors.append(f"{path}:{line}: <img> has no non-empty alt")
        if not re.search(r"\bloading=", tag, re.I):
            errors.append(f"{path}:{line}: <img> is missing loading=\"lazy\"")
    return checked


def audit_source_refs(path: Path, text: str, errors: list[str]) -> None:
    for match in CODE_SPAN.finditer(text):
        value = match.group(1)
        if not OLD_SOURCE.search(value):
            continue
        line = text[: match.start()].count("\n") + 1
        errors.append(f"{path}:{line}: stale source path `{value}`")
    for match in LINK.finditer(text):
        value = match.group(1)
        if not OLD_SOURCE.search(value):
            continue
        line = text[: match.start()].count("\n") + 1
        errors.append(f"{path}:{line}: stale source link `{value}`")


def audit_html(path: Path, text: str, errors: list[str]) -> None:
    # Code examples may contain scripts or event handlers on purpose; only the
    # prose and HTML blocks are subject to the authoring rules.
    prose = re.sub(r"```.*?```", "", text, flags=re.S)
    for tag in ("details", "figure", "table", "dl"):
        opened = len(re.findall(rf"<{tag}\b", prose, re.I))
        closed = len(re.findall(rf"</{tag}>", prose, re.I))
        if opened != closed:
            errors.append(
                f"{path}: unbalanced <{tag}> ({opened} opened, {closed} closed)"
            )
    if re.search(r"<h1\b", prose, re.I):
        errors.append(f"{path}: use a Markdown `#` heading instead of <h1>")
    if re.search(r"<script\b|<style\b|\son\w+=", prose, re.I):
        errors.append(f"{path}: scripts, styles and inline handlers are not allowed")
    if re.search(r"<img\b(?![^>]*\bsrc=)", prose, re.I):
        errors.append(f"{path}: <img> without src")


def audit_structure(path: Path, text: str, errors: list[str]) -> None:
    lines = [line for line in text.splitlines() if line.strip()]
    if not lines:
        errors.append(f"{path}: empty page")
        return
    if not H1.search(text):
        errors.append(f"{path}: no Markdown `#` title")
    if re.search(r"^\s*>?\s*\*\*\s*Status:\s*\*\*\s*$", text, re.M):
        errors.append(f"{path}: empty status metadata; use a doc-badge")
    prose = re.sub(r"```.*?```", "", text, flags=re.S)
    if re.search(r"\bTODO\b|\bTBD\b", prose):
        parts = path.as_posix()
        if not any(f"/{prefix}" in parts for prefix in ("plans/", "analysis/")):
            rel_path = rel(path, ROOT / "content" / "en" / "docs")
        else:
            rel_path = "plans/x"
        if not is_historical(rel_path):
            errors.append(f"{path}: unresolved TODO/TBD marker")


def headings(text: str) -> list[str]:
    return [f"{len(level)}:{title.strip()}" for level, title in HEADING.findall(text)]


def fence_langs(text: str) -> list[str]:
    return [lang.lower() for lang in FENCE_LANG.findall(text)]


def structural_metrics(text: str) -> dict:
    text = strip_fences(text)
    return {
        "headings": [len(level) for level in re.findall(r"^(#{1,6})\s+", text, re.M)],
        "fences": fence_langs(text),
        "images": sorted(
            Path(target).name
            for target in re.findall(r"!\[[^\]]*]\(([^)\s]+)", text)
        ),
    }


def audit_pair(en: Path, pt: Path, errors: list[str]) -> None:
    if not pt.exists():
        errors.append(f"{rel(pt, PT)}: missing Portuguese mirror of {rel(en, EN)}")
        return
    en_text, pt_text = en.read_text(encoding="utf-8"), pt.read_text(encoding="utf-8")
    em, pm = structural_metrics(en_text), structural_metrics(pt_text)
    if em["headings"] != pm["headings"]:
        errors.append(
            f"{rel(en, EN)}: heading levels differ from PT "
            f"(EN {em['headings']} vs PT {pm['headings']})"
        )
    if em["fences"] != pm["fences"]:
        errors.append(
            f"{rel(en, EN)}: code-fence languages differ from PT "
            f"(EN {em['fences']} vs PT {pm['fences']})"
        )
    if em["images"] != pm["images"]:
        errors.append(
            f"{rel(en, EN)}: image list differs from PT "
            f"(EN {em['images']} vs PT {pm['images']})"
        )


def fix_source_paths(roots: list[Path]) -> int:
    changed = 0
    mapping = re.compile(r"(?<![\w/])src/(?!caffeine(?:/|\b))")
    for root in roots:
        for path in sorted(root.rglob("*.md")):
            text = path.read_text(encoding="utf-8")
            new = mapping.sub("src/caffeine/", text)
            if new != text:
                path.write_text(new, encoding="utf-8")
                changed += 1
    return changed


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--include-engine", action="store_true", help="also audit doppio/docs")
    parser.add_argument(
        "--fix-source-paths",
        action="store_true",
        help="rewrite `src/<module>` to `src/caffeine/<module>`",
    )
    parser.add_argument("--strict", action="store_true", help="treat warnings as errors")
    args = parser.parse_args()

    if not EN.is_dir() or not PT.is_dir():
        print("missing content/en/docs or content/pt/docs", file=sys.stderr)
        sys.exit(2)

    if args.fix_source_paths:
        changed = fix_source_paths([EN, PT] + ([ENGINE_DOCS] if args.include_engine else []))
        print(f"rewrote source paths in {changed} file(s)")

    errors: list[str] = []
    warnings: list[str] = []
    counts = Counter()

    for lang_root in (EN, PT):
        for path in sorted(lang_root.rglob("*.md")):
            text = path.read_text(encoding="utf-8")
            counts["files"] += 1
            counts["links"] += audit_links(path, text, errors, warnings, ROOT / "content")
            counts["images"] += audit_images(path, text, errors)
            audit_html(path, text, errors)
            audit_structure(path, text, errors)
            if not is_generated(path):
                rel_path = rel(path, lang_root)
                if not is_historical(rel_path):
                    audit_source_refs(path, text, errors)

    for en in sorted(EN.rglob("*.md")):
        audit_pair(en, PT / en.relative_to(EN), errors)

    if args.include_engine and ENGINE_DOCS.is_dir():
        for path in sorted(ENGINE_DOCS.rglob("*.md")):
            text = path.read_text(encoding="utf-8")
            counts["engine_files"] += 1
            counts["links"] += audit_links(path, text, errors, warnings, ENGINE_DOCS)
            counts["images"] += audit_images(path, text, errors)
            audit_html(path, text, errors)
            audit_structure(path, text, errors)
            if not is_historical(rel(path, ENGINE_DOCS)):
                audit_source_refs(path, text, errors)

    print(
        f"audited {counts['files']} content page(s), "
        f"{counts.get('engine_files', 0)} engine page(s), "
        f"{counts['links']} link(s), {counts['images']} image(s)"
    )
    by_kind: dict[str, int] = defaultdict(int)
    for error in errors:
        key = error.split(": ", 1)[-1].split(" ")[0]
        by_kind[key] += 1

    for error in errors:
        print(error)
    for warning in warnings:
        print(f"warning: {warning}")

    if errors:
        print(f"\n{len(errors)} error(s)")
        sys.exit(1 if args.strict or errors else 0)
    print("ok")


if __name__ == "__main__":
    main()

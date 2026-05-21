#!/usr/bin/env python3
"""
Batch-translate markdown files to Brazilian Portuguese, preserving code fences and YAML name:.
Requires: pip install deep-translator
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "tools" / "translation-manifest.json"

try:
    from deep_translator import GoogleTranslator
except ImportError:
    print("Install: pip install deep-translator", file=sys.stderr)
    sys.exit(1)

translator = GoogleTranslator(source="en", target="pt")
FENCE_RE = re.compile(r"(^```[\s\S]*?^```\s*$|^~~~[\s\S]*?^~~~\s*$)", re.MULTILINE)

BRAND = [
    ("Tech Leads Club", "Controllato Club"),
    ("TECH LEADS CLUB", "CONTROLLATO CLUB"),
    ("tech leads club", "controllato club"),
]

DESC_MARKERS = [
    (re.compile(r"Use when", re.I), "Use quando"),
    (re.compile(r"Do NOT use for", re.I), "NÃO use para"),
    (re.compile(r"Triggers on", re.I), "Aciona em"),
]


def split_fences(text: str) -> list[tuple[str, str]]:
    parts: list[tuple[str, str]] = []
    last = 0
    for m in FENCE_RE.finditer(text):
        if m.start() > last:
            parts.append(("prose", text[last : m.start()]))
        parts.append(("fence", m.group(0)))
        last = m.end()
    if last < len(text):
        parts.append(("prose", text[last:]))
    return parts


def apply_brand(text: str) -> str:
    for a, b in BRAND:
        text = text.replace(a, b)
    return text


def normalize_skill_fm(text: str) -> str:
    if not text.startswith("---\n"):
        return text
    end = text.find("\n---\n", 4)
    if end == -1:
        return text
    fm, body = text[4:end], text[end + 5 :]
    for pat, repl in DESC_MARKERS:
        fm = pat.sub(repl, fm)
    return f"---\n{fm}\n---\n{body}"


def translate_chunk(chunk: str, max_len: int = 4500) -> str:
    if not chunk.strip():
        return chunk
    if len(chunk) <= max_len:
        try:
            return translator.translate(chunk)
        except Exception:
            time.sleep(0.5)
            return translator.translate(chunk)
    # split by paragraphs
    paras = chunk.split("\n\n")
    out = []
    buf = ""
    for p in paras:
        if len(buf) + len(p) + 2 > max_len and buf.strip():
            out.append(translate_chunk(buf, max_len))
            buf = ""
        buf += ("\n\n" if buf else "") + p
    if buf.strip():
        out.append(translate_chunk(buf, max_len))
    return "\n\n".join(out)


def translate_file(path: Path) -> str:
    raw = path.read_text(encoding="utf-8")
    if path.name == "SKILL.md":
        raw = normalize_skill_fm(raw)
    pieces = []
    for kind, seg in split_fences(raw):
        if kind == "fence":
            pieces.append(seg)
        else:
            pieces.append(translate_chunk(seg))
    return apply_brand("".join(pieces))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--phase", choices=["P1", "P2", "P3"])
    ap.add_argument("--workstream")
    ap.add_argument("--file", action="append")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    entries = manifest["entries"]

    if args.file:
        paths = args.file
    else:
        paths = [
            e["path"]
            for e in entries
            if e.get("status") != "done"
            and (not args.phase or e["phase"] == args.phase)
            and (not args.workstream or e.get("workstream") == args.workstream)
        ]

    if args.limit:
        paths = paths[: args.limit]

    print(f"Translating {len(paths)} file(s)...")
    for i, rel in enumerate(paths, 1):
        abs_path = ROOT / rel
        if args.dry_run:
            print(f"  [{i}/{len(paths)}] {rel}")
            continue
        try:
            pt = translate_file(abs_path)
            abs_path.write_text(pt, encoding="utf-8")
            for e in entries:
                if e["path"] == rel:
                    e["status"] = "done"
            print(f"  [{i}/{len(paths)}] OK {rel}")
        except Exception as ex:
            print(f"  [{i}/{len(paths)}] FAIL {rel}: {ex}", file=sys.stderr)
        time.sleep(0.15)

    if not args.dry_run:
        MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print("Done.")


if __name__ == "__main__":
    main()

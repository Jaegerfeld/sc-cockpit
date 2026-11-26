# =============================================================================
# Autor:          Robert Seebauer
# Repository:     https://github.com/Jaegerfeld/sc-cockpit
# KI-Unterstützung: Erstellt mit Unterstützung von Claude (Anthropic)
# Erstellt:       26.11.2026
# Geändert:       26.11.2026
# Lizenz:         BSD-3-Clause (siehe LICENSE)
#
# Fachliche Funktion:
#   Baut das SC Cockpit in den Ordner cockpit/: die Startdatei SC_Cockpit.html
#   (Hülle, Design, gemeinsame Daten, Anleitung, Changelog) und je Bereich eine
#   Datei bereiche/<schlüssel>.js. Der Ordner ist zugleich das Offline-Paket:
#   Die Startdatei läuft per Doppelklick, solange „bereiche“ daneben liegt.
#   Mit --zip entsteht zusätzlich SC_Cockpit_Offline.zip (für GitHub Pages).
#
#   Der Bau braucht kein Netz und nur die Standardbibliothek. Daten von UEX
#   oder dem Wiki holt das Cockpit in dieser Ausbaustufe nicht; das kommt mit
#   den Bereichen, die einziehen.
#
#   kopfzeile.py kennt das Cockpit noch nicht (die Datei liegt byte-gleich in
#   den fünf Tool-Repos). Deshalb setzt der Bau den Changelog-Link des
#   „Was ist neu?“-Dialogs hier auf dieses Repo, statt kopfzeile.py zu ändern.
# =============================================================================
"""Build the SC Cockpit: start page plus one lazily loaded script per area."""
from __future__ import annotations

import json
import sys
import zipfile
from pathlib import Path

import cockpit_bereiche as cb
import cockpit_daten as cd
import cockpit_seite as cs
import flotte as fl
import kopfzeile as kz
import sc_design as sd
from version import VERSION

HERE = Path(__file__).resolve().parent
#: Output folder; also the offline package.
OUT = HERE / "cockpit"
#: Name of the start file inside the output folder (GitHub Pages serves a copy as index.html).
START = "SC_Cockpit.html"
REPO = "https://github.com/Jaegerfeld/sc-cockpit"


def nav_html() -> str:
    """Return the sidebar links, one per area, plus the jump to the reminders for narrow screens."""
    links = "".join(
        f'<a href="#/{key}" data-key="{key}"><span class="ck-ico" aria-hidden="true">{ico}</span>'
        f"{kz.bi(de, en)}</a>" for key, ico, de, en in cs.AREAS)
    return (links + '<a href="#ck-rail" class="ck-tomerker"><span class="ck-ico" aria-hidden="true">☑</span>'
            + kz.bi("Merker", "Reminders") + ' <span class="ck-n"></span></a>')


def page() -> str:
    """Assemble the start page from the template, the shared kits and the cockpit modules.

    Returns:
        The complete HTML of the start file.
    """
    areas = [{"key": k, "de": de, "en": en} for k, _ico, de, en in cs.AREAS]
    js = (kz.JS + sd.JS + fl.FLOTTE_JS + cd.DATEN_JS
          + cs.JS.replace("/*CK_VER*/'0'", json.dumps(VERSION))
          .replace("/*CK_AREAS*/[]", json.dumps(areas, ensure_ascii=False)))
    # Screen-reader-only text and the bilingual spans of this page use the header kit's classes.
    css = sd.CSS + kz.CSS + cs.CSS + "\n.ck-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}\n"
    dialog = (kz.dialog_html("cockpit", VERSION).replace("https://github.com/Jaegerfeld/blob/", REPO + "/blob/")
              + "\n" + kz.changelog_script(HERE / "CHANGELOG.md"))
    settings = kz.lang_seg() + kz.theme_btn() + kz.manual_btn() + kz.news_btn()
    html = cs.TEMPLATE
    for mark, value in [
        ("<!--SD_FONTS-->", sd.FONTS), ("/*CK_CSS*/", css), ("<!--CK_VERSION-->", VERSION),
        ("<!--CK_NAV-->", nav_html()), ("<!--CK_SETTINGS-->", settings),
        ("<!--CK_OFFLINE-->", kz.bi("Offline-Paket", "Offline package")),
        ("<!--CK_MERKER-->", kz.bi("Merker", "Reminders")), ("<!--CK_MNEW-->", kz.bi("Neuer Merker", "New reminder")),
        ("<!--CK_MADD-->", kz.bi("Hinzufügen", "Add")), ("<!--FH_DIALOG-->", dialog), ("/*CK_JS*/", js),
    ]:
        if html.count(mark) != 1:
            raise ValueError(f"Platzhalter {mark} fehlt oder ist doppelt")
        html = html.replace(mark, value)
    return html


def build(make_zip: bool = False) -> list[Path]:
    """Write the start page and the area scripts; optionally the offline zip.

    Args:
        make_zip: Also write ``SC_Cockpit_Offline.zip`` next to the output folder.

    Returns:
        The files written.

    Raises:
        ValueError: If a sidebar area has no script, a script has no area, or a template mark is wrong.
    """
    scripts = cb.scripts()
    keys = [k for k, *_ in cs.AREAS]
    if sorted(scripts) != sorted(keys):
        raise ValueError(f"Bereiche und Seitenleiste passen nicht zusammen: {sorted(scripts)} / {sorted(keys)}")
    (OUT / "bereiche").mkdir(parents=True, exist_ok=True)
    for old in (OUT / "bereiche").glob("*.js"):
        if old.stem not in scripts:
            old.unlink()
    written = [OUT / START]
    (OUT / START).write_text(page(), encoding="utf-8", newline="\n")
    for key, js in scripts.items():
        f = OUT / "bereiche" / f"{key}.js"
        f.write_text(js, encoding="utf-8", newline="\n")
        written.append(f)
    if make_zip:
        z = HERE / "SC_Cockpit_Offline.zip"
        with zipfile.ZipFile(z, "w", zipfile.ZIP_DEFLATED) as zf:
            for f in written:
                zf.write(f, Path("SC_Cockpit") / f.relative_to(OUT))
        written.append(z)
    return written


def main(argv: list[str]) -> int:
    """Build the cockpit and print what was written.

    Args:
        argv: Command-line arguments (``--zip``).

    Returns:
        Exit code: 0 on success, 1 if the build is inconsistent.
    """
    try:
        files = build("--zip" in argv)
    except ValueError as e:
        print(f"FEHLER: {e}", file=sys.stderr)
        return 1
    size = (OUT / START).stat().st_size // 1024
    print(f"Geschrieben: cockpit/{START} ({size} KB), {len(cb.scripts())} Bereiche, Version {VERSION}.")
    for f in files[1:]:
        print(f"  {f.relative_to(HERE)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

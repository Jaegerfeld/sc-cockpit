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
#   Der Bereich Flotte enthält den Komponenten-Planer. Dessen Quelle liegt im
#   Repo StarCitizen-Schiffskauf-Planer und bleibt dort, damit neue Schiffe nur
#   an einer Stelle gepflegt werden. Der Bau sucht dieses Repo in der Umgebungs-
#   variable SC_SCHIFFSKAUF, sonst im Ordner _schiffskauf (so legt es der
#   Workflow ab), sonst neben diesem Repo. Er holt die Spieldaten wie der
#   Schiffskauf-Planer vom Star Citizen Wiki und die Schiffsliste von UEX; mit
#   --cache nimmt er dessen lokale Zwischenspeicher. Klappt das nicht, baut er
#   die Flotte als Wegweiser und meldet es, statt abzubrechen.
#
#   Genauso der Bereich Fracht: Das Fracht-Logbuch kommt aus dem Repo
#   StarCitizen-Handels-Planer (SC_HANDEL, _handel, Nachbarordner), seine
#   Stammdaten (Orte, Waren, Schiffe mit Laderaum) von UEX. Der Ordner
#   eigene_daten des Handels-Planers wird dabei nie gelesen.
#
#   kopfzeile.py kennt das Cockpit noch nicht (die Datei liegt byte-gleich in
#   den fünf Tool-Repos). Deshalb setzt der Bau den Changelog-Link des
#   „Was ist neu?“-Dialogs hier auf dieses Repo, statt kopfzeile.py zu ändern.
# =============================================================================
"""Build the SC Cockpit: start page plus one lazily loaded script per area."""
from __future__ import annotations

import importlib
import json
import os
import sys
import urllib.request
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
#: UEX vehicle list; gives the fleet its model ids (same source as the Schiffskauf-Planer).
UEX_VEHICLES = "https://api.uexcorp.space/2.0/vehicles"


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
        ("<!--CK_MADD-->", kz.bi("Hinzufügen", "Add")), ("<!--CK_MSHIP-->", kz.bi("Schiff (optional)", "Ship (optional)")),
        ("<!--CK_SETSUM-->", "⚙ " + kz.bi("Einstellungen", "Settings")),
        ("<!--CK_RAILOFF-->", kz.bi("Einklappen", "Collapse")), ("<!--CK_RAILON-->", kz.bi("Merker", "Reminders")), ("<!--FH_DIALOG-->", dialog), ("/*CK_JS*/", js),
    ]:
        if html.count(mark) != 1:
            raise ValueError(f"Platzhalter {mark} fehlt oder ist doppelt")
        html = html.replace(mark, value)
    return html


def source_dir(env: str, folder: str, repo: str, probe: str) -> Path | None:
    """Find the sources of a tool that lends an area to the cockpit.

    Args:
        env: Environment variable that may name the folder.
        folder: Folder inside this repo where the workflow checks the tool out.
        repo: Name of the tool's repo, looked for next to this repo.
        probe: A file that must exist in the folder.

    Returns:
        The folder, or None if the tool is not there.
    """
    for c in (os.environ.get(env), HERE / folder, HERE.parent / repo):
        if c and (Path(c) / probe).exists():
            return Path(c)
    return None


def schiffskauf_dir() -> Path | None:
    """Find the StarCitizen-Schiffskauf-Planer sources (see the header for the search order)."""
    return source_dir("SC_SCHIFFSKAUF", "_schiffskauf", "StarCitizen-Schiffskauf-Planer", "komponenten_seite.py")


def fracht_js(use_cache: bool) -> str:
    """Build the cargo area script with the cargo ledger from the Handels-Planer sources.

    Args:
        use_cache: Use that repo's ``logbuch_cache.json`` instead of calling UEX.

    Returns:
        JavaScript source of ``bereiche/fracht.js``.

    Raises:
        OSError, ValueError, KeyError, ImportError: If the sources or the data are unavailable.
    """
    src = source_dir("SC_HANDEL", "_handel", "StarCitizen-Handels-Planer", "logbuch_seite.py")
    if not src:
        raise ImportError("Quelle StarCitizen-Handels-Planer nicht gefunden")
    if str(src) not in sys.path:
        sys.path.append(str(src))
    daten = importlib.import_module("logbuch_daten")
    seite = importlib.import_module("logbuch_seite")
    data = daten.build(use_cache=use_cache)
    if not data.get("places"):
        raise ValueError("Logbuch-Stammdaten ohne Orte")
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    print(f"  Fracht: {len(data['places'])} Orte, {len(data['wares'])} Waren, {len(data['ships'])} Schiffe mit Laderaum.")
    return cb.fracht_script(seite.LB_HTML, seite.LB_CSS, seite.LB_JS.replace("/*__LB__*/null", payload))


def flotte_js(use_cache: bool) -> str:
    """Build the fleet area script with the component planner from the Schiffskauf-Planer sources.

    Args:
        use_cache: Use that repo's local caches instead of calling the Wiki API and UEX.

    Returns:
        JavaScript source of ``bereiche/flotte.js``.

    Raises:
        OSError, ValueError, KeyError, ImportError: If the sources or the data are unavailable.
    """
    src = schiffskauf_dir()
    if not src:
        raise ImportError("Quelle StarCitizen-Schiffskauf-Planer nicht gefunden")
    # Appended, so this repo's own kopfzeile/sc_design/flotte/version keep winning.
    if str(src) not in sys.path:
        sys.path.append(str(src))
    kp = importlib.import_module("komponenten")
    seite = importlib.import_module("komponenten_seite")
    data = kp.build(use_cache=use_cache)
    if use_cache:
        vehicles = json.loads((src / "uex_cache.json").read_text(encoding="utf-8"))["vehicles"]
    else:
        req = urllib.request.Request(UEX_VEHICLES, headers={"User-Agent": "Mozilla/5.0 sc-cockpit"})
        with urllib.request.urlopen(req, timeout=60) as r:
            body = json.loads(r.read().decode("utf-8"))
        if body.get("status") != "ok":
            raise ValueError(f"UEX vehicles: status {body.get('status')}")
        vehicles = body["data"]
    missing = kp.attach_uex(data, vehicles)
    if missing:
        print(f"  Hinweis: ohne UEX-Zuordnung (nicht in die Flotte aufnehmbar): {', '.join(missing)}")
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    print(f"  Flotte: {len(data['ships'])} Schiffe, Spielstand {data.get('patch') or '?'}.")
    return cb.flotte_script(seite.KP_HTML, seite.KP_CSS, seite.KP_JS.replace("/*__KP__*/null", payload))


def build(make_zip: bool = False, use_cache: bool = False) -> list[Path]:
    """Write the start page and the area scripts; optionally the offline zip.

    Args:
        make_zip: Also write ``SC_Cockpit_Offline.zip`` next to the output folder.
        use_cache: Build the fleet and cargo areas from the local caches of the lending tools.

    Returns:
        The files written.

    Raises:
        ValueError: If a sidebar area has no script, a script has no area, or a template mark is wrong.
    """
    scripts = cb.scripts()
    for key, make, what in (("flotte", flotte_js, "Komponenten-Planer"), ("fracht", fracht_js, "Fracht-Logbuch")):
        try:
            scripts[key] = make(use_cache)
        except (OSError, ValueError, KeyError, ImportError) as e:
            print(f"  WARNUNG: {what} nicht gebaut ({e}); der Bereich bleibt ein Wegweiser.", file=sys.stderr)
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
        argv: Command-line arguments (``--zip``, ``--cache``).

    Returns:
        Exit code: 0 on success, 1 if the build is inconsistent.
    """
    try:
        files = build("--zip" in argv, "--cache" in argv)
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

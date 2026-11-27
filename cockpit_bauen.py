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
#   eigene_daten des Handels-Planers wird dabei nie gelesen. Aus demselben
#   Repo kommen für den Bereich Pilot die Reiter Ruf und Sitzungen samt der
#   Ruf-Tabelle ruf_tabelle.json; das braucht kein Netz.
#
#   Die Werkstatt nimmt die fertigen Seiten von Bauplan- und Wikelo-Planer:
#   ohne --cache die veröffentlichte Seite (GitHub Pages, täglich frisch
#   gebaut), sonst oder als Rückfall die Datei im Nachbar-Repo. split_page()
#   zerlegt sie in Stile, Markup und Skript, shadow_css() bildet :root, html
#   und body auf das Wurzelelement im Shadow Root ab. Der Bereich Guides nimmt
#   genauso die Übersichtsseite von sc-guides; ihre Links werden absolut.
#
#   kopfzeile.py kennt das Cockpit noch nicht (die Datei liegt byte-gleich in
#   den fünf Tool-Repos). Deshalb setzt der Bau den Changelog-Link des
#   „Was ist neu?“-Dialogs hier auf dieses Repo, statt kopfzeile.py zu ändern.
# =============================================================================
"""Build the SC Cockpit: start page plus one lazily loaded script per area."""
from __future__ import annotations

import functools
import hashlib
import importlib
import json
import os
import re
import sys
import urllib.error
import urllib.request
import zipfile
from pathlib import Path

import cockpit_bereiche as cb
import cockpit_daten as cd
import cockpit_seite as cs
import cockpit_sicherung as csi
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
#: Published address; a "to the phone" link made from a copy on disk points here.
ONLINE = "https://jaegerfeld.github.io/sc-cockpit/"
#: UEX vehicle list; gives the fleet its model ids (same source as the Schiffskauf-Planer).
UEX_VEHICLES = "https://api.uexcorp.space/2.0/vehicles"


def nav_html() -> str:
    """Return the sidebar links, one per area, plus the jump to the reminders for narrow screens."""
    links = "".join(
        f'<a href="#/{key}" data-key="{key}"><span class="ck-ico" aria-hidden="true">{ico}</span>'
        f"{kz.bi(de, en)}</a>" for key, ico, de, en in cs.AREAS)
    return (links + '<a href="#ck-rail" class="ck-tomerker"><span class="ck-ico" aria-hidden="true">☑</span>'
            + kz.bi("Merker", "Reminders") + ' <span class="ck-n"></span></a>')


def handy_parts() -> tuple[str, str, str]:
    """Return markup, styles and script of "to the phone" from the Handels-Planer sources.

    The transfer (state as a compressed link and QR code) is that tool's module ``handy_seite``. Here its
    links point to the cockpit, and the cockpit itself takes an opened link over (the module's own
    receiver, which knows the tabs of the trade planner page, is switched off).

    Returns:
        ``(html, css, js)``; three empty strings if the sources are not there or do not fit. The areas
        then hide their "to the phone" buttons.
    """
    try:
        handel_dir()
        hy = importlib.import_module("handy_seite")
        js = hy.HY_JS
        for mark in ("__ONLINE__", "setTimeout(init,0);"):
            if js.count(mark) != 1:
                raise ValueError(f"Marke {mark} fehlt in handy_seite")
        return hy.HY_HTML, hy.HY_CSS, js.replace("__ONLINE__", ONLINE).replace("setTimeout(init,0);", "")
    except (ImportError, ValueError, AttributeError) as e:
        print(f"  WARNUNG: „Aufs Handy“ nicht gebaut ({e}); die Knöpfe bleiben ausgeblendet.", file=sys.stderr)
        return "", "", ""


def stamps(scripts: dict[str, str]) -> dict[str, str]:
    """Cache key per script: the first ten hex digits of the SHA-256 of its content.

    Args:
        scripts: File stem (``flotte``, ``tool_handel`` …) -> JavaScript source.

    Returns:
        File stem -> key, for the ``?v=`` of the script address.
    """
    return {k: hashlib.sha256(js.encode("utf-8")).hexdigest()[:10] for k, js in sorted(scripts.items())}


def page(stamp: dict[str, str] | None = None) -> str:
    """Assemble the start page from the template, the shared kits and the cockpit modules.

    Args:
        stamp: Cache keys of the scripts under ``bereiche/`` (see :func:`stamps`); without them
            the page falls back to the cockpit version as the key.

    Returns:
        The complete HTML of the start file.
    """
    areas = [{"key": k, "de": de, "en": en} for k, _ico, de, en in cs.AREAS]
    hy_html, hy_css, hy_js = handy_parts()
    js = (kz.JS + sd.JS + fl.FLOTTE_JS + cd.DATEN_JS + csi.SICHERUNG_JS + hy_js
          + cs.JS.replace("/*CK_VER*/'0'", json.dumps(VERSION))
          .replace("/*CK_AREAS*/[]", json.dumps(areas, ensure_ascii=False))
          .replace("/*CK_STAMP*/{}", json.dumps(stamp or {})))
    # Screen-reader-only text and the bilingual spans of this page use the header kit's classes.
    css = sd.CSS + kz.CSS + cs.CSS + hy_css + "\n.ck-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}\n"
    dialog = (kz.dialog_html("cockpit", VERSION).replace("https://github.com/Jaegerfeld/blob/", REPO + "/blob/")
              + "\n" + kz.changelog_script(HERE / "CHANGELOG.md") + hy_html)
    settings = kz.lang_seg() + kz.theme_btn() + kz.manual_btn() + kz.news_btn()
    html = cs.TEMPLATE
    for mark, value in [
        ("<!--SD_FONTS-->", sd.FONTS), ("/*CK_CSS*/", css), ("<!--CK_VERSION-->", VERSION),
        ("<!--CK_NAV-->", nav_html()), ("<!--CK_SETTINGS-->", settings),
        ("<!--CK_OFFLINE-->", kz.bi("Offline-Paket", "Offline package")),
        ("<!--CK_BACKUP-->", kz.bi("Sicherung …", "Backup …")),
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


def handel_dir() -> Path:
    """Find the StarCitizen-Handels-Planer sources and make them importable.

    Raises:
        ImportError: If the sources are not there.
    """
    src = source_dir("SC_HANDEL", "_handel", "StarCitizen-Handels-Planer", "logbuch_seite.py")
    if not src:
        raise ImportError("Quelle StarCitizen-Handels-Planer nicht gefunden")
    if str(src) not in sys.path:
        sys.path.append(str(src))
    return src


#: Published data of the workshop planners; ``--cache`` reads the local clones instead.
BAUPLAN_DATA = "https://jaegerfeld.github.io/StarCitizen-Bauplan-Planer/data.json"
WIKELO_DATA = "https://jaegerfeld.github.io/StarCitizen-Wikelo-Planer/data.json"
#: Guide to a place: words in a place name -> guide page of sc-guides (hand-made, checked against its index).
GUIDE_PLACES = [
    (["Checkmate", "Orbituary", "Ruin Station"], "SC_Pyro_Contested_Zones_Guide.html", "Pyro Contested Zones"),
    (["Onyx"], "SC_Onyx_Jorrit_Guide.html", "Onyx-Anlagen & Jorrit-Dossier"),
    (["OLP", "PAF", "Ruptura", "Vivere", "Lamina", "Attritus"], "SC_Hathor_OLP_Guide.html", "Hathor Orbital Laser Platforms"),
    (["Breaker"], "SC_QV_Breaker_Stations_Guide.html", "QV Breaker Stations"),
    (["ASD", "Lazarus", "Farro"], "SC_Pyro_ASD_Labs_Guide.html", "Pyro ASD Labs"),
    (["Ghost Hollow", "Terminus"], "SC_Loot_Locations_Guide.html", "Loot-Orte"),
]


def published_json(url: str, local: Path | None, use_cache: bool) -> dict:
    """Read a tool's data: from the local clone with ``--cache``, else from its published ``data.json``."""
    if use_cache and local and (local / "data.json").exists():
        return json.loads((local / "data.json").read_text(encoding="utf-8"))
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 sc-cockpit"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def overview_data(use_cache: bool) -> dict:
    """Data the overview needs beyond the browser storage; every part is None if its source is not there.

    - ``prices``: sell price per ledger commodity id, the same UEX price the cockpit's ledger values with.
    - ``route``: the first of the Handels-Planer's "top legal bulk routes", with the price date.
    - ``bp``: blueprint name -> costs ``[[material, min. quality, amount]]`` (Bauplan-Planer).
    - ``wk``: active Wikelo trades ``[reward, mission, [[ingredient, amount]]]`` (Wikelo-Planer).
    - ``guides``: the place-to-guide table above.

    Args:
        use_cache: Read the local caches and clones instead of the network.

    Returns:
        The data as a dict for the overview script.
    """
    out: dict = {"prices": None, "route": None, "bp": None, "wk": None,
                 "guides": [{"k": k, "f": f, "n": n} for k, f, n in GUIDE_PLACES]}
    try:
        out["prices"] = {str(w["id"]): w["ps"] for w in logbuch_data(use_cache)["wares"] if w.get("ps")}
    except (OSError, ValueError, KeyError, ImportError) as e:
        print(f"  WARNUNG: Übersicht ohne Lagerwert ({e}).", file=sys.stderr)
    try:
        d = handel_data(use_cache)
        bulk = (d.get("routes") or {}).get("bulk") or []
        if bulk:
            w = d["wares"][bulk[0]]
            out["route"] = {k: w.get(k) for k in ("w", "ko", "ks", "kp", "vo", "vs", "vp", "m")}
            out["route"].update({"min": d.get("bulk_min"), "date": str(d.get("generated") or "")[:10]})
    except (OSError, ValueError, KeyError, ImportError, IndexError) as e:
        print(f"  WARNUNG: Übersicht ohne Route ({e}).", file=sys.stderr)
    try:
        b = published_json(BAUPLAN_DATA, source_dir("SC_BAUPLAN", "_bauplan", "StarCitizen-Bauplan-Planer", "data.json"), use_cache)
        out["bp"] = {x["name"]: [[c["n"], c.get("mq", 0), c["q"]] for c in x["costs"]] for x in b["blueprints"] if x.get("costs")}
    except (OSError, ValueError, KeyError) as e:
        print(f"  WARNUNG: Übersicht ohne Baupläne ({e}).", file=sys.stderr)
    try:
        w = published_json(WIKELO_DATA, source_dir("SC_WIKELO", "_wikelo", "StarCitizen-Wikelo-Planer", "data.json"), use_cache)["wikelo"]
        recs = list(w.get("ships") or []) + list(w.get("items") or []) + ([w["intro_mission"]] if w.get("intro_mission") else [])
        def parse(s: str) -> list:
            rows = []
            for part in str(s or "").split(";"):
                part = part.strip()
                m = re.match(r"^\s*(\d+)\s*x\s+(.*\S)\s*$", part)
                if part:
                    rows.append([m.group(2), int(m.group(1))] if m else [part, 1])
            return rows
        out["wk"] = [[str(r.get("reward") or r.get("name") or "").strip(), str(r.get("mission_name") or "").strip(), parse(r.get("recipe"))]
                     for r in recs if (r.get("status") or "active") == "active"]
    except (OSError, ValueError, KeyError) as e:
        print(f"  WARNUNG: Übersicht ohne Wikelo ({e}).", file=sys.stderr)
    return out


#: Wiki API locations (all pages) give the order of planets ("Stanton I" …) and their moons ("Stanton Ia" …).
WIKI_LOCATIONS = "https://api.star-citizen.wiki/api/v2/locations"
#: Local cache of the wiki locations for ``--cache`` builds (gitignored).
KARTE_CACHE = HERE / "karte_cache.json"


def wiki_locations(use_cache: bool) -> list[dict]:
    """All locations of the wiki API (name, designation, system, type), from the cache with ``--cache``."""
    if use_cache and KARTE_CACHE.exists():
        return json.loads(KARTE_CACHE.read_text(encoding="utf-8"))
    out, page = [], 1
    while True:
        req = urllib.request.Request(f"{WIKI_LOCATIONS}?page%5Bsize%5D=200&page%5Bnumber%5D={page}",
                                     headers={"User-Agent": "Mozilla/5.0 sc-cockpit", "Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=60) as r:
            d = json.load(r)
        out += [{"n": x.get("name"), "d": x.get("designation"), "s": x.get("system"),
                 "t": (x.get("type") or {}).get("classification")} for x in d["data"]]
        if page >= (d.get("meta") or {}).get("last_page", 1):
            break
        page += 1
    if use_cache:
        KARTE_CACHE.write_text(json.dumps(out), encoding="utf-8")
    return out


def karte_data(use_cache: bool) -> dict | None:
    """Data of the map area: ledger places with planet/moon/orbit, planet order and moons per planet.

    Planets are ordered by their wiki designation (Stanton I … IV); a moon belongs to the planet whose
    designation it extends (Stanton Ia → Stanton I). UEX and wiki names are matched without case.
    Without the wiki the planets keep the order of their names.

    Args:
        use_cache: Read the local caches instead of the network.

    Returns:
        ``{"places", "order", "moons", "alias"}``, or None without ledger places.
    """
    try:
        places = [{k: p[k] for k in ("id", "n", "sys", "pl", "mo", "orb") if p.get(k)} for p in logbuch_data(use_cache)["places"]]
    except (OSError, ValueError, KeyError, ImportError) as e:
        print(f"  WARNUNG: Karte ohne Orte ({e}).", file=sys.stderr)
        return None
    systems = sorted({p["sys"] for p in places}, key=lambda s: (s != "Stanton", s))
    uex = {s: sorted({p["pl"] for p in places if p["sys"] == s and p.get("pl")}) for s in systems}
    order: dict = {s: list(uex[s]) for s in systems}
    moons: dict = {}
    alias: dict = {}
    roman = {"I": 1, "II": 2, "III": 3, "IV": 4, "V": 5, "VI": 6, "VII": 7, "VIII": 8, "IX": 9, "X": 10}
    try:
        locs = wiki_locations(use_cache)
        for s in systems:
            pat = re.compile(rf"^{re.escape(s)} ([IVX]+)([a-z]?)$")
            planets, mo = {}, {}
            for x in locs:
                m = pat.match(x.get("d") or "")
                # Only planets and moons: outposts and asteroids carry the same designations.
                if not (m and x.get("n") and m.group(1) in roman) or x.get("t") not in ("Planet", "Moon"):
                    continue
                (mo.setdefault(m.group(1), []) if x["t"] == "Moon" else planets.setdefault(m.group(1), [])).append(x["n"])
            # Several wiki entries can carry one designation (microTech/"Green"); the UEX name wins.
            by_norm = {re.sub(r"[^a-z0-9]", "", n.lower()): n for n in uex[s]}
            seq = []
            for num in sorted(planets, key=lambda k: roman[k]):
                names = planets[num]
                hit = next((by_norm[re.sub(r"[^a-z0-9]", "", n.lower())] for n in names if re.sub(r"[^a-z0-9]", "", n.lower()) in by_norm), None)
                name = hit or names[0]
                seq.append(name)
                for n in names:
                    alias[f"{s}|{re.sub(r'[^a-z0-9]', '', n.lower())}"] = name
                moons[f"{s}|{name}"] = sorted(set(mo.get(num, [])))
            if seq:
                order[s] = seq + [p for p in uex[s] if p not in seq]
    except (OSError, ValueError, KeyError) as e:
        print(f"  WARNUNG: Karte ohne Planetenreihenfolge aus dem Wiki ({e}).", file=sys.stderr)
    for s in systems:
        for n in uex[s]:
            alias.setdefault(f"{s}|{re.sub(r'[^a-z0-9]', '', n.lower())}", n)
    return {"places": places, "order": order, "moons": moons, "alias": alias}


@functools.cache
def handel_data(use_cache: bool) -> dict:
    """Routes and commodities of the Handels-Planer, built once per build (tool and overview use them)."""
    hb = foreign(handel_dir(), "handels_planer_bauen")
    rows, summary = hb.load_rows(use_cache)
    return hb.build_data(rows, summary)


@functools.cache
def logbuch_data(use_cache: bool) -> dict:
    """Master data of the cargo ledger (places, commodities, ships), fetched once per build."""
    handel_dir()
    data = importlib.import_module("logbuch_daten").build(use_cache=use_cache)
    if not data.get("places"):
        raise ValueError("Logbuch-Stammdaten ohne Orte")
    return data


def pilot_js(use_cache: bool) -> str:
    """Build the pilot area script with the reputation and sessions tabs of the Handels-Planer.

    Args:
        use_cache: Passed on to the ledger master data (the places name a session's last place).

    Returns:
        JavaScript source of ``bereiche/pilot.js``.

    Raises:
        OSError, ValueError, KeyError, ImportError: If the sources are unavailable.
    """
    src = handel_dir()
    sz = importlib.import_module("sitzungen_seite")
    rf = importlib.import_module("ruf_seite")
    table = src / "ruf_tabelle.json"
    ruf_json = table.read_text(encoding="utf-8").replace("</", "<\\/") if table.exists() else "null"
    try:
        places = logbuch_data(use_cache)["places"]
    except (OSError, ValueError, KeyError) as e:
        print(f"  Hinweis: Pilot ohne Ortsnamen aus dem Logbuch ({e}).")
        places = []
    print(f"  Pilot: Ruf-Tabelle {'vorhanden' if ruf_json != 'null' else 'FEHLT'}, {len(places)} Orte.")
    return cb.pilot_script(sz.SZ_HTML + rf.RF_HTML, sz.SZ_CSS + rf.RF_CSS, sz.SZ_JS,
                           rf.RF_JS.replace("/*__RUF__*/null", ruf_json), places)


#: Whole-page tools mounted in the workshop: key -> (repo, built page, published address, env var, folder).
WERKZEUGE = {
    "bauplan": ("StarCitizen-Bauplan-Planer", "SC_Bauplan_Planer.html",
                "https://jaegerfeld.github.io/StarCitizen-Bauplan-Planer/", "SC_BAUPLAN", "_bauplan"),
    "wikelo": ("StarCitizen-Wikelo-Planer", "SC_Wikelo_Planer.html",
               "https://jaegerfeld.github.io/StarCitizen-Wikelo-Planer/", "SC_WIKELO", "_wikelo"),
    "auswerter": ("StarCitizen-Screenshot-Auswerter", "SC_Screenshot_Auswerter.html",
                  "https://jaegerfeld.github.io/StarCitizen-Screenshot-Auswerter/", "SC_AUSWERTER", "_auswerter"),
}
#: Name of a tool's own page next to its plain address (which forwards to the cockpit).
PAGE = "app.html"
#: A fetched tool page is at least this long; anything shorter is a forwarding or error page.
MIN_PAGE = 20000
#: The two whole pages of the workshop.
WERKSTATT = ("bauplan", "wikelo")
#: Modules every tool repo has under the same name (byte-identical helpers, and each tool's own version).
SHARED = ("version", "kopfzeile", "sc_design", "flotte")


def tool_page(key: str, use_cache: bool) -> str:
    """Return the finished page of a whole-page tool.

    Args:
        key: Key in ``WERKZEUGE``.
        use_cache: Take the built file from the tool's repo next to this one instead of the published page.

    Returns:
        The page as HTML text.

    Raises:
        OSError: If neither the published page nor a local file is available.
    """
    repo, name, url, env, folder = WERKZEUGE[key]
    src = source_dir(env, folder, repo, name)
    if not use_cache:
        try:
            # The tool's own page is app.html; the plain address forwards to the cockpit. Until a tool has
            # published app.html, its plain address still is the page.
            for address in (url + PAGE, url):
                try:
                    req = urllib.request.Request(address, headers={"User-Agent": "Mozilla/5.0 sc-cockpit"})
                    with urllib.request.urlopen(req, timeout=60) as r:
                        html = r.read().decode("utf-8")
                except urllib.error.HTTPError as e:
                    if e.code != 404 or address == url:
                        raise
                    continue
                if len(html) < MIN_PAGE:
                    raise OSError(f"{address} ist keine Werkzeugseite ({len(html)} Zeichen; Weiterleitung?)")
                return html
        except OSError as e:
            if not src:
                raise
            print(f"  Hinweis: {url} nicht erreichbar ({e}); nehme die Datei aus {src.name}.")
    if not src:
        raise OSError(f"Seite von {repo} nicht gefunden")
    return (src / name).read_text(encoding="utf-8")


def shadow_css(css: str) -> str:
    """Map the document-level selectors of a page's styles to the root element inside a shadow root.

    ``:root``, ``html`` and ``body`` do not exist inside a shadow tree; the tool's root element
    ``.sc-root`` stands in for all three and carries the attributes of ``<html>`` (theme, language).

    Args:
        css: Stylesheet text of the page.

    Returns:
        The stylesheet with those selectors replaced.
    """
    css = css.replace(":root", ".sc-root")
    # "html" and "body" only as whole selector tokens: not "tbody", ".fh-dbody" or "var(--body)".
    return re.sub(r"(?<![\w.#-])(?:html|body)(?=[\s,{\[.:>+~])", ".sc-root", css)


def split_page(html: str, base: str) -> dict:
    """Split a finished tool page into the parts the workshop mounts.

    Args:
        html: The page.
        base: Published address of the tool's page; relative ``bilder/`` paths in its data are made
            absolute against its folder.

    Returns:
        ``{"css", "html", "attrs", "js", "url", "ext"}``: styles for the shadow root, body markup without
        the page scripts (JSON data blocks stay), attributes of ``<html>``, the page scripts in order, and
        the addresses of external scripts the page loads (they must be loaded before the page script).

    Raises:
        ValueError: If the page has no body or no script.
    """
    m = re.search(r"<body[^>]*>(.*)</body>", html, re.S)
    if not m:
        raise ValueError("Seite ohne <body>")
    body = m.group(1)
    script = re.compile(r"<script>(.*?)</script>", re.S)
    js = [s for s in script.findall(html) if s.strip()]
    if not js:
        raise ValueError("Seite ohne Skript")
    css = "\n".join(re.findall(r"<style[^>]*>(.*?)</style>", html, re.S))
    tag = re.search(r"<html([^>]*)>", html)
    attrs = dict(re.findall(r'([\w-]+)="([^"]*)"', tag.group(1))) if tag else {}
    folder = base.rsplit("/", 1)[0] + "/"
    absolute = lambda s: re.sub(r'(["\'`])bilder/', lambda k: k.group(1) + folder + "bilder/", s)  # noqa: E731
    return {"css": shadow_css(css), "html": absolute(script.sub("", body)), "attrs": attrs,
            "js": absolute("\n;\n".join(js)), "url": base,
            "ext": re.findall(r'<script[^>]*\ssrc="([^"]+)"', html)}


#: Published guide site; its index page becomes the guides area.
GUIDES_URL = "https://jaegerfeld.github.io/sc-guides/"


def guides_js(use_cache: bool) -> str:
    """Build the guides area script from the index page of the guide site.

    Args:
        use_cache: Take ``index.html`` from the guide repo next to this one instead of the published page.

    Returns:
        JavaScript source of ``bereiche/guides.js``.

    Raises:
        OSError, ValueError: If the page is unavailable or cannot be split.
    """
    src = source_dir("SC_GUIDES", "_guides", "sc-guides-repo", "index.html")
    html = None
    if not use_cache:
        try:
            req = urllib.request.Request(GUIDES_URL, headers={"User-Agent": "Mozilla/5.0 sc-cockpit"})
            with urllib.request.urlopen(req, timeout=60) as r:
                html = r.read().decode("utf-8")
        except OSError as e:
            if not src:
                raise
            print(f"  Hinweis: {GUIDES_URL} nicht erreichbar ({e}); nehme die Datei aus {src.name}.")
    if html is None:
        if not src:
            raise OSError("Übersicht von sc-guides nicht gefunden")
        html = (src / "index.html").read_text(encoding="utf-8")
    page = split_page(html, GUIDES_URL)
    # Links and images of the index are relative to the guide site, not to the cockpit.
    page["html"] = re.sub(r'\b(href|src)="(?!https?:|#|mailto:|data:)([^"]+)"',
                          lambda m: f'{m.group(1)}="{GUIDES_URL}{m.group(2)}"', page["html"])
    cards = len(re.findall(r'class="card"', page["html"]))
    if not cards:
        raise ValueError("Übersicht von sc-guides ohne Karten")
    print(f"  Guides: {cards} Karten.")
    return cb.guides_script(page)


def werkstatt_js(use_cache: bool) -> str:
    """Build the workshop area script from the finished pages of Bauplan- and Wikelo-Planer.

    Args:
        use_cache: Take the built files from the repos next to this one.

    Returns:
        JavaScript source of ``bereiche/werkstatt.js``.

    Raises:
        OSError, ValueError: If a page is unavailable or cannot be split.
    """
    tools = {key: split_page(tool_page(key, use_cache), WERKZEUGE[key][2] + PAGE) for key in WERKSTATT}
    sizes = ", ".join(f"{k} {len(v['js']) // 1024} KB Skript" for k, v in tools.items())
    print(f"  Werkstatt: {sizes}.")
    return cb.werkstatt_script(tools)


def foreign(src: Path, name: str):
    """Import the build module of a lending tool together with that tool's own shared modules.

    The tools' build scripts import ``version``, ``kopfzeile``, ``sc_design`` and ``flotte`` by the same
    names this repo uses. For the import the tool's folder goes first and this repo's modules step aside,
    so the tool's header carries its own version; afterwards everything is as before.

    Args:
        src: Folder of the tool's sources.
        name: Module name of its build script.

    Returns:
        The imported module.
    """
    saved = {k: sys.modules.pop(k) for k in SHARED if k in sys.modules}
    sys.path.insert(0, str(src))
    try:
        return importlib.import_module(name)
    finally:
        sys.path.remove(str(src))
        for k in SHARED:
            sys.modules.pop(k, None)
        sys.modules.update(saved)


def handel_tool(use_cache: bool) -> dict:
    """Build routes and commodities of the Handels-Planer as a whole tool.

    The parts that already live in the cockpit (cargo ledger, sessions, reputation, phone transfer) are
    left out. Private screenshot-reader exports (``eigene_daten``) are never read here.

    Args:
        use_cache: Use that repo's ``handel_cache.json`` instead of calling star-head.

    Returns:
        The tool as from ``split_page``.

    Raises:
        OSError, ValueError, KeyError, ImportError: If the sources or the data are unavailable.
    """
    hb = foreign(handel_dir(), "handels_planer_bauen")
    data = handel_data(use_cache)
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    # The page switches its views by id; the views that moved out keep an empty stand-in.
    stubs = "".join(f'<div id="view-{k}" class="hide"></div>' for k in ("ledger", "sessions", "rep"))
    html = hb.fill_header(hb.HTML_TEMPLATE)
    for mark, value in [("/*LB_CSS*/", ""), ("<!--LB_TAB-->\n", ""), ("<!--LB_HTML-->", stubs), ("/*LB_JS*/", ""),
                        ("/*SZ_CSS*/", ""), ("<!--SZ_TAB-->\n", ""), ("/*__DATA__*/{}", payload)]:
        if html.count(mark) != 1:
            raise ValueError(f"Marke {mark} fehlt in der Vorlage des Handels-Planers")
        html = html.replace(mark, value)
    html = html.replace("__DATA_URL__", hb.DATA_URL)
    print(f"  Routen und Waren: {len(data['rows'])} Preiszeilen.")
    return split_page(html, cb.URL["handel"])


def schiffskauf_tool(use_cache: bool) -> dict:
    """Build the ship purchase planner as a whole tool, without the component planner (it is the fleet area).

    Args:
        use_cache: Use that repo's ``uex_cache.json`` instead of calling UEX.

    Returns:
        The tool as from ``split_page``.

    Raises:
        OSError, ValueError, KeyError, ImportError: If the sources or the data are unavailable.
    """
    src = schiffskauf_dir()
    if not src:
        raise ImportError("Quelle StarCitizen-Schiffskauf-Planer nicht gefunden")
    sb = foreign(src, "schiffskauf_planer_bauen")
    data = sb.build_data(sb.load_raw(use_cache))
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    html = sb.fill_header(sb.bilingual(sb.HTML_TEMPLATE))
    for mark, value in [("/*KP_CSS*/", ""), ("<!--KP_PANEL-->", ""), ("/*KP_JS*/", ""), ("/*__DATA__*/{}", payload)]:
        if html.count(mark) != 1:
            raise ValueError(f"Marke {mark} fehlt in der Vorlage des Schiffskauf-Planers")
        html = html.replace(mark, value)
    html = html.replace("__DATA_URL__", sb.DATA_URL)
    print(f"  Schiffskauf: {len(data['ships'])} Fahrzeuge, {len(data['locs'])} Standorte.")
    return split_page(html, cb.URL["schiffskauf"])


def auswerter_tool(use_cache: bool) -> dict:
    """Take the finished page of the Screenshot-Auswerter as a whole tool.

    Args:
        use_cache: Take the built file from the repo next to this one instead of the published page.

    Returns:
        The tool as from ``split_page``.

    Raises:
        OSError, ValueError: If the page is unavailable or cannot be split.
    """
    tool = split_page(tool_page("auswerter", use_cache), WERKZEUGE["auswerter"][2] + PAGE)
    print(f"  Auswerter: {len(tool['js']) // 1024} KB Skript, {len(tool['ext'])} externe Bibliothek(en).")
    return tool


def fracht_js(use_cache: bool) -> str:
    """Build the cargo area script with the cargo ledger from the Handels-Planer sources.

    Args:
        use_cache: Use that repo's ``logbuch_cache.json`` instead of calling UEX.

    Returns:
        JavaScript source of ``bereiche/fracht.js``.

    Raises:
        OSError, ValueError, KeyError, ImportError: If the sources or the data are unavailable.
    """
    handel_dir()
    seite = importlib.import_module("logbuch_seite")
    data = logbuch_data(use_cache)
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
    for key, make, what in (("flotte", flotte_js, "Komponenten-Planer"), ("fracht", fracht_js, "Fracht-Logbuch"),
                            ("pilot", pilot_js, "Ruf und Sitzungen"), ("werkstatt", werkstatt_js, "Werkstatt"),
                            ("guides", guides_js, "Guides")):
        try:
            scripts[key] = make(use_cache)
        except (OSError, ValueError, KeyError, ImportError) as e:
            print(f"  WARNUNG: {what} nicht gebaut ({e}); der Bereich bleibt ein Wegweiser.", file=sys.stderr)
    kd = json.dumps(karte_data(use_cache), ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    if scripts["karte"].count("/*KARTE*/null") != 1:
        raise ValueError("Platzhalter /*KARTE*/null fehlt in der Karte")
    scripts["karte"] = scripts["karte"].replace("/*KARTE*/null", kd)
    ue = json.dumps(overview_data(use_cache), ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    if scripts["uebersicht"].count("/*UE_DATA*/null") != 1:
        raise ValueError("Platzhalter /*UE_DATA*/null fehlt in der Übersicht")
    scripts["uebersicht"] = scripts["uebersicht"].replace("/*UE_DATA*/null", ue)
    keys = [k for k, *_ in cs.AREAS]
    if sorted(scripts) != sorted(keys):
        raise ValueError(f"Bereiche und Seitenleiste passen nicht zusammen: {sorted(scripts)} / {sorted(keys)}")
    # Whole tools shown as sub-tabs: one file each, loaded on first use. A missing file is not fatal: the
    # sub-tab then says so and links to the existing tool.
    for key, make, what in (("handel", handel_tool, "Routen und Waren"), ("schiffskauf", schiffskauf_tool, "Schiffskauf"),
                            ("auswerter", auswerter_tool, "Auswerter")):
        try:
            scripts[f"tool_{key}"] = cb.tool_script(key, make(use_cache))
        except (OSError, ValueError, KeyError, ImportError, AttributeError) as e:
            print(f"  WARNUNG: {what} nicht gebaut ({e}); der Unterreiter verweist auf das bisherige Tool.", file=sys.stderr)
    (OUT / "bereiche").mkdir(parents=True, exist_ok=True)
    for old in (OUT / "bereiche").glob("*.js"):
        if old.stem not in scripts:
            old.unlink()
    written = [OUT / START]
    (OUT / START).write_text(page(stamps(scripts)), encoding="utf-8", newline="\n")
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

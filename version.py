# =============================================================================
# Autor:          Robert Seebauer
# Repository:     https://github.com/Jaegerfeld/sc-cockpit
# KI-Unterstützung: Erstellt mit Unterstützung von Claude (Anthropic)
# Erstellt:       26.11.2026
# Geändert:       26.11.2026
# Lizenz:         BSD-3-Clause (siehe LICENSE)
#
# Fachliche Funktion:
#   Einzige Quelle der Versionsnummer des SC Cockpits (SemVer). cockpit_bauen.py
#   liest sie; sie steht neben dem Titel, im „Was ist neu?“-Dialog und hängt an
#   den Adressen der Bereichsdateien, damit der Browser nach einem neuen Bau
#   keine alten Bereiche aus dem Zwischenspeicher nimmt.
# =============================================================================
"""Single source of the SC Cockpit's version number (SemVer)."""

#: Current version of the cockpit, shown next to the title and in the "What's new?" dialog.
VERSION = "0.10.0"

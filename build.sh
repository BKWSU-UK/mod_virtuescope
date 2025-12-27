#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

MODULE_SLUG="mod_virtuescope"

if ! command -v zip >/dev/null 2>&1; then
  echo "Error: zip is required to build the archive" >&2
  exit 1
fi

VERSION="$(
  sed -n 's:.*<version>\([^<]*\)</version>.*:\1:p' "mod_virtuescope.xml" \
    | head -n 1 \
    | tr -d '\r'
)"
if [[ -z "${VERSION}" ]]; then
  echo "Error: could not determine <version> from mod_virtuescope.xml" >&2
  exit 1
fi

NO_CHANGELOG=0
if [[ "${1:-}" == "--no-changelog" ]]; then
  NO_CHANGELOG=1
fi

CHANGELOG_FILE="$ROOT/CHANGELOG.md"
if [[ "${NO_CHANGELOG}" -eq 0 && -f "${CHANGELOG_FILE}" ]]; then
  if ! grep -qE "^##[[:space:]]+${VERSION//./\\.}[[:space:]]*$" "${CHANGELOG_FILE}"; then
    printf "\n## %s\n- Build.\n" "${VERSION}" >>"${CHANGELOG_FILE}"
  fi
fi

DIST_DIR="$ROOT/dist"
mkdir -p "${DIST_DIR}"

VERSIONED_ZIP="${DIST_DIR}/${MODULE_SLUG}-${VERSION}.zip"
CANON_ZIP="${ROOT}/${MODULE_SLUG}.zip"
TMP_ZIP="$(mktemp --tmpdir="${DIST_DIR}" "${MODULE_SLUG}.XXXXXX.zip")"

rm -f "${TMP_ZIP}"

zip -r -q "${TMP_ZIP}" \
  "CHANGELOG.md" \
  "mod_virtuescope.php" \
  "mod_virtuescope.xml" \
  "tmpl" \
  "language" \
  "css" \
  "js" \
  "images" \
  -x "**/.DS_Store" "**/Thumbs.db"

mv -f "${TMP_ZIP}" "${VERSIONED_ZIP}"
cp -f "${VERSIONED_ZIP}" "${CANON_ZIP}"

echo "Built: ${VERSIONED_ZIP}"
echo "Wrote: ${CANON_ZIP}"


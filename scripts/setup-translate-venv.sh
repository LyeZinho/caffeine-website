#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python3 -m venv .venv-translate
.venv-translate/bin/pip install -q argostranslate
.venv-translate/bin/python3 - <<'PY'
from argostranslate import package

package.update_package_index()
pkgs = package.get_available_packages()
pkg = next(p for p in pkgs if p.from_code == "pt" and p.to_code == "en")
path = pkg.download()
package.install_from_path(path)
print("installed pt->en")
PY

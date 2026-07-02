#!/usr/bin/env bash
set -e

echo "Polpot Sort - Python launcher"
echo

if command -v python3 >/dev/null 2>&1; then
    PYCMD=python3
elif command -v python >/dev/null 2>&1; then
    PYCMD=python
else
    echo "Python 3 was not found on this system."
    echo "Install it from https://www.python.org/downloads/ and try again."
    exit 1
fi

echo "Using: $PYCMD"
echo

# Always work inside a dedicated virtual environment. This avoids
# system-managed-Python restrictions (PEP 668) and any mismatch
# between the `python`/`pip` commands on PATH.
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment in .venv ..."
    "$PYCMD" -m venv .venv
fi

VENV_PY=".venv/bin/python"

"$VENV_PY" -m pip install --upgrade pip >/dev/null
"$VENV_PY" -m pip install -r requirements.txt

echo
echo "Generating video..."
"$VENV_PY" make_video.py

echo
echo "Done. See polpot_sort_pillow.mp4 in this folder."

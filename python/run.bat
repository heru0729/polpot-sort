@echo off
setlocal enabledelayedexpansion

echo Polpot Sort - Python launcher
echo.

set "PYCMD="

py -3 --version >nul 2>nul
if not errorlevel 1 (
    set "PYCMD=py -3"
    goto :found
)

python --version >nul 2>nul
if not errorlevel 1 (
    python -c "import sys; sys.exit(0 if sys.version_info[0]==3 else 1)" >nul 2>nul
    if not errorlevel 1 (
        set "PYCMD=python"
        goto :found
    )
)

python3 --version >nul 2>nul
if not errorlevel 1 (
    set "PYCMD=python3"
    goto :found
)

echo Python 3 was not found on this system.
echo Install it from https://www.python.org/downloads/ and try again.
pause
exit /b 1

:found
echo Using: %PYCMD%
echo.

rem Always work inside a dedicated virtual environment. This avoids the
rem classic Windows problem where `python` and `pip` silently point to
rem two different installations (e.g. MSYS2 vs python.org, or multiple
rem Python versions on PATH).
if not exist ".venv" (
    echo Creating virtual environment in .venv ...
    %PYCMD% -m venv .venv
    if errorlevel 1 (
        echo.
        echo Failed to create the virtual environment. See the error above.
        pause
        exit /b 1
    )
)

set "VENV_PY=.venv\Scripts\python.exe"

"%VENV_PY%" -m pip install --upgrade pip >nul
"%VENV_PY%" -m pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo pip install failed. See the error above.
    pause
    exit /b 1
)

echo.
echo Generating video...
"%VENV_PY%" make_video.py
if errorlevel 1 (
    echo.
    echo make_video.py failed. See the error above.
    pause
    exit /b 1
)

echo.
echo Done. See polpot_sort_pillow.mp4 in this folder.
pause

@echo off
echo Polpot Sort - JavaScript launcher
echo.

node --version >nul 2>nul
if errorlevel 1 (
    echo Node.js was not found on this system.
    echo Install it from https://nodejs.org/ and try again.
    pause
    exit /b 1
)

where ffmpeg >nul 2>nul
if errorlevel 1 (
    echo ffmpeg was not found on this system.
    echo Install it from https://ffmpeg.org/download.html and try again.
    pause
    exit /b 1
)

echo Generating video...
node make_video.js
if errorlevel 1 (
    echo.
    echo make_video.js failed. See the error above.
    pause
    exit /b 1
)

echo.
echo Done. See polpot_sort.mp4 in this folder.
pause

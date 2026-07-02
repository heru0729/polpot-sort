#!/usr/bin/env bash
set -e

echo "Polpot Sort - JavaScript launcher"
echo

if ! command -v node >/dev/null 2>&1; then
    echo "Node.js was not found on this system."
    echo "Install it from https://nodejs.org/ and try again."
    exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
    echo "ffmpeg was not found on this system."
    echo "Install it from https://ffmpeg.org/download.html and try again."
    exit 1
fi

echo "Generating video..."
node make_video.js

echo
echo "Done. See polpot_sort.mp4 in this folder."

/**
 *  make_video.js
 *
 *  Renders the Polpot Sort elimination process as an mp4 video.
 *
 *  No npm dependencies. Frames are rasterized manually into a raw RGB24
 *  pixel buffer and piped into a system `ffmpeg` process via stdin.
 *  Requires `ffmpeg` to be installed and available on PATH.
 */

'use strict';

const { spawn } = require('child_process');

const COLOR_BG = [30, 30, 30];
const COLOR_PENDING = [207, 207, 207];
const COLOR_SURVIVOR = [58, 157, 93];
const COLOR_BASELINE = [240, 190, 40];

const WIDTH = 1000;
const HEIGHT = 550;
const MARGIN_BOTTOM = 20;
const MARGIN_TOP = 20;
const BAR_GAP_RATIO = 0.15;

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sameColor(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

function buildFrames(data, rng) {
  const n = data.length;
  const display = data.slice();
  const colors = new Array(n).fill(COLOR_PENDING);
  const frames = [[display.slice(), colors.slice()]];

  const baselineIdx = Math.floor(rng() * n);
  const baselineVal = data[baselineIdx];
  const survivorsIdx = [baselineIdx];
  colors[baselineIdx] = COLOR_BASELINE;
  frames.push([display.slice(), colors.slice()]);

  for (let i = 0; i < n; i++) {
    if (i === baselineIdx) continue;
    if (data[i] <= baselineVal) {
      colors[i] = COLOR_SURVIVOR;
      survivorsIdx.push(i);
    } else {
      colors[i] = COLOR_SURVIVOR;
      display[i] = 0;
    }
    frames.push([display.slice(), colors.slice()]);
  }

  for (const idx of survivorsIdx) {
    if (rng() <= 0.2) {
      display[idx] = 0;
    }
    frames.push([display.slice(), colors.slice()]);
  }

  frames.push([display.slice(), colors.slice()]);
  frames.push([display.slice(), colors.slice()]);

  return frames;
}

function drawFrame(colors, display, maxVal) {
  const buf = Buffer.alloc(WIDTH * HEIGHT * 3);
  for (let p = 0; p < WIDTH * HEIGHT; p++) {
    buf[p * 3] = COLOR_BG[0];
    buf[p * 3 + 1] = COLOR_BG[1];
    buf[p * 3 + 2] = COLOR_BG[2];
  }

  const n = display.length;
  const chartH = HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;
  const slotW = WIDTH / n;
  const barW = Math.max(slotW * (1 - BAR_GAP_RATIO), 1);
  const baselineBarW = Math.max(barW, 4);

  for (let i = 0; i < n; i++) {
    const val = display[i];
    if (val <= 0) continue;

    const color = colors[i];
    const w = sameColor(color, COLOR_BASELINE) ? baselineBarW : barW;
    const barH = (val / maxVal) * chartH;

    const x0 = Math.round(i * slotW + (slotW - w) / 2);
    const x1 = Math.round(x0 + w);
    const y1 = HEIGHT - MARGIN_BOTTOM;
    const y0 = Math.round(y1 - barH);

    for (let y = y0; y < y1; y++) {
      if (y < 0 || y >= HEIGHT) continue;
      const rowOffset = y * WIDTH;
      for (let x = Math.max(x0, 0); x < Math.min(x1, WIDTH); x++) {
        const p = (rowOffset + x) * 3;
        buf[p] = color[0];
        buf[p + 1] = color[1];
        buf[p + 2] = color[2];
      }
    }
  }

  return buf;
}

function makeVideo(data, outputPath, {
  seed = 42,
  targetDuration = 6.0,
  fpsMin = 10,
  fpsMax = 240,
} = {}) {
  return new Promise((resolve, reject) => {
    const rng = mulberry32(seed);
    const frames = buildFrames(data, rng);
    const maxVal = Math.max(...data);

    let fps = frames.length / targetDuration;
    fps = Math.max(fpsMin, Math.min(fpsMax, fps));

    const ffmpeg = spawn('ffmpeg', [
      '-y',
      '-f', 'rawvideo',
      '-pixel_format', 'rgb24',
      '-video_size', `${WIDTH}x${HEIGHT}`,
      '-framerate', String(fps),
      '-i', '-',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      outputPath,
    ]);

    ffmpeg.stderr.on('data', () => {}); // suppress ffmpeg logs
    ffmpeg.on('error', reject);
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log(`saved: ${outputPath} (${frames.length} frames, fps=${fps.toFixed(1)}, ${(frames.length / fps).toFixed(2)}s)`);
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });

    for (const [display, colors] of frames) {
      ffmpeg.stdin.write(drawFrame(colors, display, maxVal));
    }
    ffmpeg.stdin.end();
  });
}

if (require.main === module) {
  const rng = mulberry32(1);
  const data = Array.from({ length: 300 }, () => 1 + Math.floor(rng() * 4999));

  makeVideo(data, 'polpot_sort.mp4', { seed: 42, targetDuration: 6.0 }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { PolpotSortVideo: { buildFrames, drawFrame, makeVideo } };

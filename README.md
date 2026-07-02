# Polpot Sort

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Language: Python](https://img.shields.io/badge/Language-Python-blue.svg)](https://www.python.org/)

[日本語版READMEはこちら](https://github.com/heru0729/polpot-sort/blob/main/README-ja.md)

Polpot Sort is a satirical, destructive sorting algorithm derived from
[Stalin Sort](https://github.com/gustavo-depaula/stalin-sort). It does not
guarantee a sorted output. It does not guarantee the output length. It only
guarantees that every surviving element is less than or equal to a randomly
chosen baseline value.

![Polpot Sort demo](assets/demo.gif)

## Quick Start

Just want to see the video without troubleshooting Python/Node.js
environment issues? Run the launcher script for your platform — it
finds a working interpreter, sets up an isolated environment, and
generates the video in one step.

```bash
cd python && ./run.sh      # macOS / Linux
```
```powershell
cd python; .\run.bat       # Windows
```

(The `javascript/` folder has the same `run.sh` / `run.bat` pair if you
prefer the Node.js version — it requires system `ffmpeg` but no npm
packages.)

## Algorithm

1. Pick one element from the input array at random. Fix it as the
   **baseline** for the rest of the run (it is never updated).
2. Scan the array. Any element greater than the baseline is eliminated
   on the spot. Elements less than or equal to the baseline survive.
3. Take the phase-1 survivors and independently purge each one with a
   fixed probability (default 20%), regardless of its value.

The result is a subsequence of the input, with length less than or equal
to the input length. As a sorting algorithm it is completely broken;
that is the point.

## Files

| File | Purpose |
|---|---|
| `python/polpot_sort.py` | The algorithm, as a `PolpotSort` class with a CLI demo (Python) |
| `python/make_video.py` | Renders the elimination process as an mp4 (bar chart) |
| `python/requirements.txt` | Dependencies for `make_video.py` |
| `python/run.sh` / `run.bat` | One-step launcher: creates a venv, installs deps, runs `make_video.py` |
| `javascript/polpot_sort.js` | The algorithm, as a `PolpotSort` class with a CLI demo (Node.js) |
| `javascript/make_video.js` | Renders the elimination process as an mp4 (Node.js, no npm dependencies, requires system `ffmpeg`) |
| `javascript/package.json` | Package metadata for the Node.js version |
| `javascript/run.sh` / `run.bat` | One-step launcher: checks for Node.js/ffmpeg, runs `make_video.js` |
| `assets/demo.gif` | Sample output shown above |
| `LICENSE` | MIT License |

## Installation

```bash
git clone https://github.com/<your-username>/polpot-sort.git
cd polpot-sort
```

`python/polpot_sort.py` has no third-party dependencies. `python/make_video.py`
requires the packages in `python/requirements.txt` plus a system installation
of `ffmpeg`.

```bash
cd python
pip install -r requirements.txt
```

(Or just run `./run.sh` / `run.bat`, which does this in an isolated
virtual environment automatically — see Quick Start above.)

## Usage

### As a library

```python
from python.polpot_sort import PolpotSort

data = [5, 3, 8, 1, 9, 2, 7, 4, 6, 10]
sorter = PolpotSort(purge_probability=0.2, seed=42)
result = sorter.sort(data)
print(result)
```

### From the command line

```bash
cd python
python polpot_sort.py --size 20 --low 1 --high 100 --seed 42
```

| Argument | Description | Default |
|---|---|---|
| `--size` | Number of random elements to generate | `10` |
| `--low` | Lower bound of generated values | `1` |
| `--high` | Upper bound of generated values | `100` |
| `--purge-probability` | Phase-2 purge probability | `0.2` |
| `--seed` | Random seed for reproducibility | `None` |

### JavaScript (Node.js)

```bash
cd javascript
node polpot_sort.js --size 20 --low 1 --high 100 --seed 42
```

```javascript
const { PolpotSort } = require('./javascript/polpot_sort.js');

const data = [5, 3, 8, 1, 9, 2, 7, 4, 6, 10];
const sorter = new PolpotSort({ purgeProbability: 0.2, seed: 42 });
const result = sorter.sort(data);
console.log(result);
```

Same CLI flags as the Python version: `--size`, `--low`, `--high`,
`--purge-probability`, `--seed`. No dependencies required.

### Generating a visualization

```bash
cd python
python make_video.py
```

Produces `polpot_sort_pillow.mp4` in the `python/` directory. Bar color
legend:

| Color | Meaning |
|---|---|
| Gray | Not yet processed |
| Green | Survived |
| Yellow | Baseline element |

Eliminated elements disappear immediately. Video length scales
automatically with input size so larger inputs play back faster.

A Node.js version is also available and produces an equivalent video
with zero npm dependencies (it pipes raw pixels directly into a system
`ffmpeg` process):

```bash
cd javascript
node make_video.js
```

## Related jokes

- [Stalin Sort](https://github.com/gustavo-depaula/stalin-sort) — drops
  any element that breaks a running monotonic sequence.
- Bogosort — shuffles until sorted, by chance.
- Thanos Sort — randomly deletes exactly half the elements per pass.

## License

MIT — see [LICENSE](LICENSE).

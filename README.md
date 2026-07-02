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
| `polpot_sort.py` | The algorithm, as a `PolpotSort` class with a CLI demo (Python) |
| `javascript/polpot_sort.js` | The algorithm, as a `PolpotSort` class with a CLI demo (Node.js) |
| `make_video.py` | Renders the elimination process as an mp4 (bar chart) |
| `requirements.txt` | Dependencies for `make_video.py` |
| `assets/demo.gif` | Sample output shown above |
| `LICENSE` | MIT License |

## Installation

```bash
git clone https://github.com/<your-username>/polpot-sort.git
cd polpot-sort
```

`polpot_sort.py` has no third-party dependencies. `make_video.py`
requires the packages in `requirements.txt` plus a system installation
of `ffmpeg`.

```bash
pip install -r requirements.txt
```

## Usage

### As a library

```python
from polpot_sort import PolpotSort

data = [5, 3, 8, 1, 9, 2, 7, 4, 6, 10]
sorter = PolpotSort(purge_probability=0.2, seed=42)
result = sorter.sort(data)
print(result)
```

### From the command line

```bash
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
python make_video.py
```

Produces `polpot_sort_pillow.mp4` in the current directory. Bar color
legend:

| Color | Meaning |
|---|---|
| Gray | Not yet processed |
| Green | Survived |
| Yellow | Baseline element |

Eliminated elements disappear immediately. Video length scales
automatically with input size so larger inputs play back faster.

## Related jokes

- [Stalin Sort](https://github.com/gustavo-depaula/stalin-sort) — drops
  any element that breaks a running monotonic sequence.
- Bogosort — shuffles until sorted, by chance.
- Thanos Sort — randomly deletes exactly half the elements per pass.

## License

MIT — see [LICENSE](LICENSE).

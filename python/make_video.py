import random
import numpy as np
from PIL import Image, ImageDraw
import imageio.v2 as imageio


COLOR_BG = (30, 30, 30)
COLOR_PENDING = (207, 207, 207)
COLOR_SURVIVOR = (58, 157, 93)
COLOR_BASELINE = (240, 190, 40)

WIDTH, HEIGHT = 1000, 550
MARGIN_BOTTOM = 20
MARGIN_TOP = 20
BAR_GAP_RATIO = 0.15


def build_frames(data, seed=42):
    rng = random.Random(seed)
    n = len(data)
    display = list(data)
    colors = [COLOR_PENDING] * n
    frames = [(display.copy(), colors.copy())]

    baseline_idx = rng.randrange(n)
    baseline_val = data[baseline_idx]
    survivors_idx = [baseline_idx]
    colors[baseline_idx] = COLOR_BASELINE
    frames.append((display.copy(), colors.copy()))

    for i in range(n):
        if i == baseline_idx:
            continue
        if data[i] <= baseline_val:
            colors[i] = COLOR_SURVIVOR
            survivors_idx.append(i)
        else:
            colors[i] = COLOR_SURVIVOR
            display[i] = 0
        frames.append((display.copy(), colors.copy()))

    for idx in survivors_idx:
        if rng.random() <= 0.2:
            display[idx] = 0
        frames.append((display.copy(), colors.copy()))

    frames.append((display.copy(), colors.copy()))
    frames.append((display.copy(), colors.copy()))

    return frames


def draw_frame(colors, display, max_val):
    img = Image.new("RGB", (WIDTH, HEIGHT), COLOR_BG)
    draw = ImageDraw.Draw(img)

    n = len(display)
    chart_h = HEIGHT - MARGIN_TOP - MARGIN_BOTTOM
    slot_w = WIDTH / n
    bar_w = max(slot_w * (1 - BAR_GAP_RATIO), 1)
    baseline_bar_w = max(bar_w, 4)

    for i, (val, color) in enumerate(zip(display, colors)):
        if val <= 0:
            continue
        bar_h = (val / max_val) * chart_h
        w = baseline_bar_w if color == COLOR_BASELINE else bar_w
        x0 = i * slot_w + (slot_w - w) / 2
        x1 = x0 + w
        y1 = HEIGHT - MARGIN_BOTTOM
        y0 = y1 - bar_h
        draw.rectangle([x0, y0, x1, y1], fill=color)

    return img


def make_video(data, output_path, seed=42, target_duration=6.0,
               fps_min=10, fps_max=240):
    frames = build_frames(data, seed=seed)
    max_val = max(data)

    fps = len(frames) / target_duration
    fps = max(fps_min, min(fps_max, fps))

    writer = imageio.get_writer(output_path, fps=fps, codec="libx264",
                                 quality=10, macro_block_size=1)

    for display, colors in frames:
        img = draw_frame(colors, display, max_val)
        writer.append_data(np.asarray(img))

    writer.close()
    print(f"saved: {output_path} ({len(frames)} frames, fps={fps:.1f}, "
          f"{len(frames)/fps:.2f}s)")


if __name__ == "__main__":
    data_rng = random.Random(1)
    data = data_rng.sample(range(1, 5000), 300)
    make_video(data, output_path="polpot_sort_pillow.mp4", seed=42, target_duration=6.0)

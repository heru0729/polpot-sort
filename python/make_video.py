"""
    POLPOT SORT: A Satirical, Non-Comparison, Destructive Sorting Algorithm
    Copyright (C) 2026

    This program is free software: you can redistribute it and/or modify
    it under the terms of the MIT License.

    THIS PROGRAM COMES WITH ABSOLUTELY NO GUARANTEE OF CORRECTNESS.
    Elements of the input are not guaranteed to survive.
"""
from __future__ import print_function

import argparse
import random
import time


class PolpotSort(object):
  """
  Implements Polpot Sort.

  Polpot Sort is a satirical derivative of Stalin Sort. Instead of
  scanning the array and dropping every element that breaks monotonicity,
  it fixes a single random "baseline" element up front and eliminates
  every element that exceeds it. Survivors are then subjected to a
  second, independent purge based purely on chance.

  The algorithm does not guarantee a sorted output, does not guarantee
  the output length, and does not guarantee anything at all beyond
  "every surviving element is less than or equal to the baseline".
  """

  def __init__(self, purge_probability=0.2, seed=None):
    """
    Sets key parameters for Polpot Sort.

    Parameters
    ----------
    purge_probability : float
      Probability that a phase-1 survivor is removed in phase 2.
    seed : int or None
      Random seed for reproducible runs.
    """
    self.purge_probability = purge_probability
    self.seed = seed

  def sort(self, arr):
    """
    Params:
      arr - a list or sequence of comparable elements.
    Returns:
      A list containing the surviving elements. Guaranteed non-empty
      if the input is non-empty.
    """
    if self.seed is not None:
      random.seed(self.seed)

    if not arr:
      return []

    n = len(arr)
    baseline_idx = random.randrange(n)
    baseline_val = arr[baseline_idx]

    survivors = [x for x in arr if x <= baseline_val]
    purged = [x for x in survivors if random.random() > self.purge_probability]

    return purged if purged else [baseline_val]


def parse_args():
  """Parse input arguments."""
  parser = argparse.ArgumentParser(description='Polpot Sort demo')
  parser.add_argument('--size', help='Number of random elements to generate.',
                       type=int, default=10)
  parser.add_argument('--low', help='Lower bound of generated values.',
                       type=int, default=1)
  parser.add_argument('--high', help='Upper bound of generated values.',
                       type=int, default=100)
  parser.add_argument('--purge-probability',
                       help='Probability a phase-1 survivor is purged in phase 2.',
                       type=float, default=0.2)
  parser.add_argument('--seed', help='Random seed for reproducibility.',
                       type=int, default=None)
  args = parser.parse_args()
  return args


if __name__ == '__main__':
  args = parse_args()

  rng = random.Random(args.seed)
  data = [rng.randint(args.low, args.high) for _ in range(args.size)]

  sorter = PolpotSort(purge_probability=args.purge_probability, seed=args.seed)

  start_time = time.time()
  result = sorter.sort(data)
  cycle_time = time.time() - start_time

  print('Input  (%d elements): %s' % (len(data), data))
  print('Output (%d elements): %s' % (len(result), result))
  print('Survival rate: %.1f%%' % (100.0 * len(result) / len(data)))
  print('Total sorting took: %.6f seconds' % cycle_time)

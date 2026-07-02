/**
 *  POLPOT SORT: A Satirical, Non-Comparison, Destructive Sorting Algorithm
 *  Copyright (C) 2026
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the MIT License.
 *
 *  THIS PROGRAM COMES WITH ABSOLUTELY NO GUARANTEE OF CORRECTNESS.
 *  Elements of the input are not guaranteed to survive.
 */

'use strict';

/**
 * Deterministic PRNG (mulberry32) used when a seed is provided,
 * so runs can be reproduced across languages/environments.
 */
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

class PolpotSort {
  /**
   * Implements Polpot Sort.
   *
   * Polpot Sort is a satirical derivative of Stalin Sort. Instead of
   * scanning the array and dropping every element that breaks monotonicity,
   * it fixes a single random "baseline" element up front and eliminates
   * every element that exceeds it. Survivors are then subjected to a
   * second, independent purge based purely on chance.
   *
   * @param {Object} [options]
   * @param {number} [options.purgeProbability=0.2] - Probability that a
   *   phase-1 survivor is removed in phase 2.
   * @param {number|null} [options.seed=null] - Random seed for
   *   reproducible runs. If null, Math.random() is used.
   */
  constructor({ purgeProbability = 0.2, seed = null } = {}) {
    this.purgeProbability = purgeProbability;
    this.seed = seed;
    this._rng = seed !== null ? mulberry32(seed) : Math.random;
  }

  /**
   * @param {Array} arr - Input array of comparable elements.
   * @returns {Array} Surviving elements. Guaranteed non-empty if the
   *   input is non-empty.
   */
  sort(arr) {
    if (!arr || arr.length === 0) {
      return [];
    }

    const n = arr.length;
    const baselineIdx = Math.floor(this._rng() * n);
    const baselineVal = arr[baselineIdx];

    const survivors = arr.filter((x) => x <= baselineVal);
    const purged = survivors.filter(() => this._rng() > this.purgeProbability);

    return purged.length > 0 ? purged : [baselineVal];
  }
}

function parseArgs(argv) {
  const args = {
    size: 10,
    low: 1,
    high: 100,
    purgeProbability: 0.2,
    seed: null,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => argv[++i];

    switch (arg) {
      case '--size':
        args.size = parseInt(next(), 10);
        break;
      case '--low':
        args.low = parseInt(next(), 10);
        break;
      case '--high':
        args.high = parseInt(next(), 10);
        break;
      case '--purge-probability':
        args.purgeProbability = parseFloat(next());
        break;
      case '--seed':
        args.seed = parseInt(next(), 10);
        break;
      default:
        break;
    }
  }

  return args;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));

  const genRng = args.seed !== null ? mulberry32(args.seed) : Math.random;
  const data = Array.from(
    { length: args.size },
    () => args.low + Math.floor(genRng() * (args.high - args.low + 1))
  );

  const sorter = new PolpotSort({
    purgeProbability: args.purgeProbability,
    seed: args.seed,
  });

  const start = process.hrtime.bigint();
  const result = sorter.sort(data);
  const elapsedSeconds = Number(process.hrtime.bigint() - start) / 1e9;

  console.log(`Input  (${data.length} elements): [${data.join(', ')}]`);
  console.log(`Output (${result.length} elements): [${result.join(', ')}]`);
  console.log(`Survival rate: ${((100 * result.length) / data.length).toFixed(1)}%`);
  console.log(`Total sorting took: ${elapsedSeconds.toFixed(6)} seconds`);
}

module.exports = { PolpotSort };

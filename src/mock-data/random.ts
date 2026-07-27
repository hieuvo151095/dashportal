const SEED = 20260701

function mulberry32(seed: number) {
  let a = seed
  return function random() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function createRng(offset = 0) {
  const random = mulberry32(SEED + offset)

  return {
    next: () => random(),
    int: (min: number, max: number) => min + Math.floor(random() * (max - min + 1)),
    float: (min: number, max: number) => min + random() * (max - min),
    pick: <T,>(items: readonly T[]): T => items[Math.floor(random() * items.length)],
    chance: (probability: number) => random() < probability,
    shuffle: <T,>(items: readonly T[]): T[] => {
      const copy = [...items]
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
      }
      return copy
    },
  }
}

export type Rng = ReturnType<typeof createRng>

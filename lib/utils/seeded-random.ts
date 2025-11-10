// Simple seeded random number generator for consistent mock data
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  // Generate next random number between 0 and 1
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280

    return this.seed / 233280
  }

  // Generate random integer between min and max (inclusive)
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  // Select random item from array
  nextItem<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)]
  }

  // Generate random boolean with given probability (0-1)
  nextBoolean(probability: number = 0.5): boolean {
    return this.next() < probability
  }
}

// Create a singleton instance with a fixed seed
export const seededRandom = new SeededRandom(12345)

// Utility functions
export function seededRandomNumber(min: number, max: number): number {
  return seededRandom.nextInt(min, max)
}

export function seededRandomEnum<T extends object>(enumObj: T): T[keyof T] {
  const values = Object.values(enumObj) as T[keyof T][]

  return seededRandom.nextItem(values)
}

export function seededRandomBoolean(probability: number = 0.5): boolean {
  return seededRandom.nextBoolean(probability)
}

export function seededRandomItem<T>(array: T[]): T {
  return seededRandom.nextItem(array)
}

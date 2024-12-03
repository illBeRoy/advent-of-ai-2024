export async function solver(input: string): Promise<string> {
  const reports = input.trim().split('\n');
  let safeReportCounter = 0;

  for (const report of reports) {
    const numbers = report.split(' ').map(Number);
    if (
      isStrictlyIncreasingOrDecreasing(numbers) &&
      hasValidDifferences(numbers)
    ) {
      safeReportCounter++;
    }
  }

  return safeReportCounter.toString();
}

function isStrictlyIncreasingOrDecreasing(numbers: number[]): boolean {
  let isIncreasing = true;
  let isDecreasing = true;

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] <= numbers[i - 1]) {
      isIncreasing = false;
    }
    if (numbers[i] >= numbers[i - 1]) {
      isDecreasing = false;
    }
  }
  return isIncreasing || isDecreasing;
}

function hasValidDifferences(numbers: number[]): boolean {
  for (let i = 1; i < numbers.length; i++) {
    const diff = Math.abs(numbers[i] - numbers[i - 1]);
    if (diff < 1 || diff > 3) {
      return false;
    }
  }
  return true;
}

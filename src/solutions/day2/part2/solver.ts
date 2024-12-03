export async function solver(input: string): Promise<string> {
  const lines = input.split('\n');
  let safeReportCount = 0;

  for (const line of lines) {
    const numbers = line.split(' ').map(Number);
    const isSafe = isReportSafe(numbers);
    if (isSafe) {
      safeReportCount++;
    } else {
      for (let i = 0; i < numbers.length; i++) {
        const modifiedReport = numbers.slice(0, i).concat(numbers.slice(i + 1));
        if (isReportSafe(modifiedReport)) {
          safeReportCount++;
          break;
        }
      }
    }
  }
  return safeReportCount.toString();
}

function isReportSafe(numbers: number[]): boolean {
  let increasing = true;
  let decreasing = true;

  for (let i = 1; i < numbers.length; i++) {
    const diff = Math.abs(numbers[i] - numbers[i - 1]);
    if (diff < 1 || diff > 3) {
      return false;
    }
    increasing = increasing && numbers[i] > numbers[i - 1];
    decreasing = decreasing && numbers[i] < numbers[i - 1];
  }

  return increasing || decreasing;
}

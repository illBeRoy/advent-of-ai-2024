export async function solver(input: string): Promise<string> {
  let sum = 0;
  let enabled = true;
  const validInstructions = input.match(
    /(?:mul\(\d{1,3},\d{1,3}\)|do\(\)|don\'t\(\))/g,
  );
  if (validInstructions) {
    for (const instruction of validInstructions) {
      if (instruction === 'do()') {
        enabled = true;
      } else if (instruction === "don't()") {
        enabled = false;
      } else if (enabled && /^mul\(\d{1,3},\d{1,3}\)$/.test(instruction)) {
        const [x, y] = instruction.match(/\d+/g)!.map(Number);
        sum += x * y;
      }
    }
  }
  return sum.toString();
}

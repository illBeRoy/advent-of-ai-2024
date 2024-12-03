export async function solver(input: string): Promise<string> {
  let result = 0;
  const regex = /mul\(\d{1,3},\d{1,3}\)/g;
  const matches = input.match(regex);
  if (matches) {
    for (const match of matches) {
      // Extract X and Y from the match
      const values = match.match(/\d+/g);
      if (values && values.length === 2) {
        const X = parseInt(values[0], 10);
        const Y = parseInt(values[1], 10);
        // Calculate the product and add to the result
        result += X * Y;
      }
    }
  }
  return result.toString();
}

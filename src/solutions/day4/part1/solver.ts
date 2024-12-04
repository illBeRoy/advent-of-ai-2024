export async function solver(input: string): Promise<string> {
  const targetWord = 'XMAS';
  const grid = input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const wordLength = targetWord.length;
  const numRows = grid.length;
  const numCols = grid[0].length;
  let count = 0;

  // Directions: up, down, left, right, and the four diagonals
  const directions = [
    { dr: -1, dc: 0 }, // up
    { dr: 1, dc: 0 }, // down
    { dr: 0, dc: -1 }, // left
    { dr: 0, dc: 1 }, // right
    { dr: -1, dc: -1 }, // up-left
    { dr: -1, dc: 1 }, // up-right
    { dr: 1, dc: -1 }, // down-left
    { dr: 1, dc: 1 }, // down-right
  ];

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      // Check if the current character matches the first character of 'XMAS'
      if (grid[row][col] === targetWord[0]) {
        // Check all directions
        for (const { dr, dc } of directions) {
          let match = true;
          for (let k = 0; k < wordLength; k++) {
            const newRow = row + k * dr;
            const newCol = col + k * dc;
            // Check if the new coordinates are within bounds
            if (
              newRow < 0 ||
              newRow >= numRows ||
              newCol < 0 ||
              newCol >= numCols ||
              grid[newRow][newCol] !== targetWord[k]
            ) {
              match = false;
              break;
            }
          }
          if (match) {
            count++;
          }
        }
      }
    }
  }

  return count.toString();
}

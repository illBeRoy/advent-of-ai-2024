// Parses a multiline string containing two columns of numbers into separate lists for each column.
function step1(input: string): { leftList: number[]; rightList: number[] } {
  const lines = input.trim().split('\n');
  const leftList: number[] = [];
  const rightList: number[] = [];

  for (const line of lines) {
    const [leftValue, rightValue] = line.split(/\s+/).map(Number);
    leftList.push(leftValue);
    rightList.push(rightValue);
  }

  return { leftList, rightList };
}

// The function takes an object with two arrays of numbers and sorts each array in ascending order.
function step2(input: { leftList: number[]; rightList: number[] }): {
  leftList: number[];
  rightList: number[];
} {
  const sortedLeftList = [...input.leftList].sort((a, b) => a - b);
  const sortedRightList = [...input.rightList].sort((a, b) => a - b);
  return { leftList: sortedLeftList, rightList: sortedRightList };
}

// This function calculates the total distance by summing all the absolute differences in the input array.
function calculateTotalDistanceDifferences(
  left: number[],
  right: number[],
): number {
  let total_distance = 0;
  for (let i = 0; i < left.length; i++) {
    total_distance += Math.abs(left[i] - right[i]);
  }
  return total_distance;
}

// This function calculates the total similarity score.
function calculateTotalSimilarity(left: number[], right: number[]): number {
  const rightOccurrences: { [key: number]: number } = {};
  right.forEach(
    (num) => (rightOccurrences[num] = (rightOccurrences[num] || 0) + 1),
  );

  let totalSimilarityScore = 0;
  left.forEach((l) => {
    const countInRight = rightOccurrences[l] || 0;
    totalSimilarityScore += l * countInRight;
  });

  return totalSimilarityScore;
}

export const solver = async (input: string): Promise<string> => {
  const { leftList, rightList } = step1(input);
  const sortedLists = step2({ leftList, rightList });
  const totalDistance = calculateTotalDistanceDifferences(
    sortedLists.leftList,
    sortedLists.rightList,
  );
  const totalSimilarity = calculateTotalSimilarity(
    sortedLists.leftList,
    sortedLists.rightList,
  );
  return `${totalDistance}\n${totalSimilarity}`; // Add a newline between total distance and total similarity.
};

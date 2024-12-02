// This function extracts two lists of integers from a string where two columns of numbers are separated by whitespace.
function step1(input: string): { leftList: number[]; rightList: number[] } {
  // Split the input by new lines to separate each row
  const lines = input.trim().split('\n');
  const leftList: number[] = [];
  const rightList: number[] = [];

  // Iterate over each line
  for (const line of lines) {
    // Split by whitespace to separate columns
    const [left, right] = line.trim().split(/\s+/);
    // Convert each entry to a number and add to respective list
    if (left !== undefined) {
      leftList.push(parseInt(left, 10));
    }
    if (right !== undefined) {
      rightList.push(parseInt(right, 10));
    }
  }

  return { leftList, rightList };
}

// The function takes an object with two arrays and returns an object with both arrays sorted in ascending order.
function step2({
  leftList,
  rightList,
}: {
  leftList: number[];
  rightList: number[];
}): { leftList: number[]; rightList: number[] } {
  return {
    leftList: [...leftList].sort((a, b) => a - b),
    rightList: [...rightList].sort((a, b) => a - b),
  };
}

// The function takes an object with two sorted arrays and returns an array of pairs from corresponding elements of both arrays.
function step3({
  leftList,
  rightList,
}: {
  leftList: number[];
  rightList: number[];
}): { distinguishedPairs: Array<[number, number]> } {
  const distinguishedPairs: Array<[number, number]> = [];
  const minLength = Math.min(leftList.length, rightList.length);

  for (let i = 0; i < minLength; i++) {
    distinguishedPairs.push([leftList[i], rightList[i]]);
  }

  return { distinguishedPairs };
}

// This function computes the absolute differences between pairs of numbers from two lists.
function step4(input: { distinguishedPairs: Array<[number, number]> }): {
  distinguishedPairs: Array<[number, number]>;
  differences: Array<number>;
} {
  const distinguishedPairs = input.distinguishedPairs;
  const differences = distinguishedPairs.map(([left, right]) =>
    Math.abs(left - right),
  );
  return { distinguishedPairs, differences };
}

// The function calculates the sum of absolute differences from the array to get the total distance.
function step5({
  distinguishedPairs,
  differences,
}: {
  distinguishedPairs: Array<[number, number]>;
  differences: Array<number>;
}): number {
  return differences.reduce((total, difference) => total + difference, 0);
}

// The function converts the total distance number to a string as the specification requires a string return type.
function step6(totalDistance: number): string {
  // Convert the number to a string as the specification requires a string return type
  return totalDistance.toString();
}

export const solver = async (input: string): Promise<string> => {
  const result1 = step1(input);
  const result2 = step2(result1);
  const result3 = step3(result2);
  const result4 = step4(result3);
  const result5 = step5(result4);
  const result6 = step6(result5);
  return result6;
};

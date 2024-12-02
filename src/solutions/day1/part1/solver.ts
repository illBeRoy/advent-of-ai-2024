import readline from 'readline';

export const solver = async (input: string): Promise<string> => {
  const lines = input.trim().split('\n');
  const leftList: number[] = [];
  const rightList: number[] = [];

  for (const line of lines) {
    const [left, right] = line.split(' ').map(Number);
    leftList.push(left);
    rightList.push(right);
  }

  // Sort both lists
  leftList.sort((a, b) => a - b);
  rightList.sort((a, b) => a - b);

  // Calculate total distance
  let totalDistance = 0;
  for (let i = 0; i < leftList.length; i++) {
    totalDistance += Math.abs(leftList[i] - rightList[i]);
  }

  return totalDistance.toString();
};

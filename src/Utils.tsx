function randomInteger(int: number) {
  return Math.floor(Math.random() * int)
}

function randomIntegerInRange(start: number, end: number) {
  return Math.floor(Math.random() * (end - start)) + start;
}

function shuffleArray(array: Array<any>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export {randomInteger, randomIntegerInRange, shuffleArray};
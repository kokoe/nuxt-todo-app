export function createRandomNumber() {
  return (Math.random() * 0x80000000) | 0;
}

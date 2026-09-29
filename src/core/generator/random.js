export function randomInt(min, max) {
  min = Number(min);
  max = Number(max);

  if (isNaN(min)) {
    min = 0;
  }

  if (isNaN(max)) {
    max = 100;
  }

  if (min > max) {
    const temp = min;
    min = max;
    max = temp;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomNumber(min, max, precision) {
  min = Number(min);
  max = Number(max);
  precision = Number(precision);

  if (isNaN(min)) {
    min = 0;
  }

  if (isNaN(max)) {
    max = 100;
  }

  if (isNaN(precision)) {
    precision = 2;
  }

  if (min > max) {
    const temp = min;
    min = max;
    max = temp;
  }

  const factor = Math.pow(10, precision);

  return (
    (Math.floor(Math.random() * (max * factor - min * factor + 1)) +
      min * factor) /
    factor
  );
}

export function randomEnum(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return "";
  }

  const index = Math.floor(Math.random() * values.length);

  return values[index];
}

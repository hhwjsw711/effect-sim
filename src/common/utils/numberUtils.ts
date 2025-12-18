export function getAdaptiveStep(value: number | string | undefined): number {
  const num = typeof value === "string" ? parseFloat(value) : (value ?? 0);
  const val = Math.abs(num);

  if (val === 0) return 1;

  const order = Math.floor(Math.log10(val));
  return Math.pow(10, order);
}



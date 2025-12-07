export function parsePrice(value) {
  if (value === undefined) return null;
  const n = parseFloat(value);
  return Number.isNaN(n) ? null : n;
}

export function parseDate(value, endOfDay = false) {
  if (!value) return null;

  const dateOnlyRe = /^\d{4}-\d{2}-\d{2}$/;
  let d;
  if (dateOnlyRe.test(value)) {
    const [y, m, day] = value.split("-").map(Number);
    d = new Date(y, m - 1, day); // Fixed: month is 0-indexed
  } 
  else {
    d = new Date(value);
  }
  if (isNaN(d.getTime())) return null;
  if (endOfDay) d.setHours(23, 59, 59, 999);
  return d;
}
export const istToUtc = (date, time) => {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  // Create IST timestamp manually
  const istMillis =
    Date.UTC(year, month - 1, day, hour, minute) - 5.5 * 60 * 60 * 1000;

  return new Date(istMillis);
};

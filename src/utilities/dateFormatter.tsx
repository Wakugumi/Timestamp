/**
 * Converts Javascript Date.now() to UNIX timestamp as string
 * @param {number} date
 * @returns {string}
 */
export const toUnix = (date: number) => {
  const timestamp = Math.floor(date / 1000).toString();
  return timestamp;
};

export function prettyTimestampForFilenames(useSeconds = true) {
  const now = new Date();
  const timeString = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')]
    .concat(useSeconds ? [String(now.getHours()).padStart(2, '0'), String(now.getMinutes()).padStart(2, '0'), String(now.getSeconds()).padStart(2, '0')]
      : [String(now.getHours()).padStart(2, '0'), String(now.getMinutes()).padStart(2, '0')])
    .join('-');
  return timeString; // YYYY-MM-DD_HHMM[SS] format
}

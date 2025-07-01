export function convertDate(isoString: string) {
  const date = new Date(isoString);

  // Get hours and minutes (in UTC or convert to local if needed)
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  // Get date components
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // months are 0-indexed
  const year = date.getUTCFullYear();

  const formatted = `${hours}:${minutes} ${day}-${month}-${year}`;
  return formatted;
}

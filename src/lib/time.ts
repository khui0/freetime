import pluralize from "pluralize";

export function timeToS(time: string) {
  const parts = time.split(":");
  const hours = parseInt(parts[0]) * 3600;
  const minutes = parseInt(parts[1]) * 60;
  return hours + minutes;
}

export function timeTo12Hour(time: string, dayPeriod: boolean = false) {
  if (!time) return;
  const parts = time.split(":");
  const hours = parseInt(parts[0]);
  const period = parseInt(parts[0]) >= 12 ? " PM" : " AM";
  return (hours > 12 ? hours % 12 : hours).toString() + ":" + parts[1] + (dayPeriod ? period : "");
}

export function eventDuration(from: string, to: string) {
  if (!from || !to) return;
  const seconds = timeToS(to) - timeToS(from);
  const minutes = seconds / 60;
  const hours = minutes / 60;
  return (
    (Math.floor(hours) > 0 ? pluralize("hour", Math.floor(hours), true) : "") +
    " " +
    pluralize("minute", Math.floor(minutes % 60), true)
  );
}

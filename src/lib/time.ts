import pluralize from "pluralize";

export function timeToS(time: string) {
  const parts = time.split(":");
  const hours = parseInt(parts[0]) * 3600;
  const minutes = parseInt(parts[1]) * 60;
  return hours + minutes;
}

export function timeToMs(time: string) {
  const now = new Date();
  const hours = parseInt(time.split(":")[0]);
  const minutes = parseInt(time.split(":")[1]);
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes).getTime();
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

export function timeUntil(from: string, to: string, timeOnly: boolean = false) {
  if (!from || !to) return;
  const now = Date.now();
  const start = timeToMs(from);
  const end = timeToMs(to);
  if (now < start) {
    const diff = start - now;
    const prefix = timeOnly ? "" : "Starts in ";
    return prefix + msToString(diff);
  } else if (now < end) {
    const diff = end - now;
    const prefix = timeOnly ? "" : "Ends in ";
    return prefix + msToString(diff);
  } else {
    return "";
  }
}

export function timeUntilShort(from: string, to: string) {
  if (!from || !to) return;
  const now = Date.now();
  const start = timeToMs(from);
  const end = timeToMs(to);
  let time;
  if (now < start) {
    time = msToUnits(start - now);
  } else if (now < end) {
    time = msToUnits(end - now);
  }
  if (time) return time.hours + ":" + (time.minutes + 1).toString().padStart(2, "0");
}

export function msToUnits(ms: number) {
  const seconds = Math.floor(Math.abs(ms / 1000));
  const minutes = Math.floor(Math.abs(seconds / 60));
  const hours = Math.floor(Math.abs(minutes / 60));
  return {
    hours: hours,
    minutes: minutes % 60,
    seconds: seconds % 60,
  };
}

export function msToString(ms: number) {
  const time = msToUnits(ms);
  const parts = [];
  if (time.hours > 0) {
    parts.push(pluralize("hour", time.hours, true));
  }
  parts.push(pluralize("minute", time.minutes + 1, true));
  return parts.join(" ");
}

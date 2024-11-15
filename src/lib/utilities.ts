import { locations } from "./sbu";

import Fuse from "fuse.js";

const fuse = new Fuse(Object.values(locations), {
  includeScore: true,
  shouldSort: true,
  keys: ["name"],
});

export function parse(data: string) {
  if (!data) return;
  const COURSE_REGEX = /^[A-Z]{3} [0-9]{3}/gm;
  const TIME_REGEX =
    /((?:Mo|Tu|We|Th|Fr|Sa|Su)+) ([0-9]{1,2}:[0-9]{1,2}(?:AM|PM)) - ([0-9]{1,2}:[0-9]{1,2}(?:AM|PM))/;
  const ROOM_REGEX = /(.+) ([A-Z]?[0-9-]+)/;
  const DATE_REGEX = /[0-9]{2}\/[0-9]{2}\/[0-9]{4} - [0-9]{2}\/[0-9]{2}\/[0-9]{4}/;
  // Normalize input between Chrome, Firefox, and Safari
  const normalized = data
    .trim()
    .replace(/\n\t+\n/g, "\n")
    .replace(/ \t|\t/g, " ")
    .replace(/ {2}/g, " ")
    .replace(/\n \n/g, "\n");
  // Match courses
  const courses = normalized.match(COURSE_REGEX);
  if (!courses) return; // Stop if no courses are detected
  // Split input by courses and separate each line
  const extracted = normalized
    .split(COURSE_REGEX)
    .slice(1)
    .map((item) => item.split("\n"));

  const schedule: CalendarEvent[] = [];
  for (let i = 0; i < extracted.length; i++) {
    const item = extracted[i];
    // Get the index of each occurrence of a date in MM/DD/YYYY - MM/DD/YYYY format
    const indicies = item.reduce((a: number[], e, i) => {
      if (e.match(DATE_REGEX)) a.push(i);
      return a;
    }, []);
    // Loop over each index, in case a course has multiple classes
    indicies.forEach((index) => {
      // Get information by relative index
      const type = item[index - 4];
      const times = item[index - 3].match(TIME_REGEX);
      const location = item[index - 2].match(ROOM_REGEX);
      const estimatedLocation = location && fuse.search(location[1])[0].item.name;
      const buildingCode =
        estimatedLocation &&
        Object.entries(locations).find(([, value]) => {
          return value.name === estimatedLocation;
        })?.[0];
      console.log("Found", courses[i], type, times, location, buildingCode);
      schedule.push({
        title: courses[i].split(" ")[0],
        number: courses[i].split(" ")[1],
        type: type.toLowerCase(),
        days: (times && toDays(times[1])) || [false, false, false, false, false, false, false],
        from: (times && convertTime(times[2])) || "",
        to: (times && convertTime(times[3])) || "",
        room: location?.[2] || "",
        location: buildingCode || "",
      });
    });
  }

  return schedule;

  function toDays(input: string) {
    const results = input.match(/Mo|Tu|We|Th|Fr|Sa|Su/g);
    if (!results) return;
    const days = [false, false, false, false, false, false, false];
    const reference = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    results.forEach((item) => {
      const index = reference.indexOf(item);
      days[index] = true;
    });
    return days;
  }

  function convertTime(time: string) {
    const parts = time.match(/([0-9]{1,2}):([0-9]{1,2})(AM|PM)/);
    if (!parts) return;
    let hours = parseInt(parts[1]);
    if (parts[3] === "PM" && hours !== 12) {
      hours += 12;
    }
    return hours.toString().padStart(2, "0") + ":" + parts[2];
  }
}

export function isMac(): boolean {
  try {
    return navigator.userAgent.indexOf("Mac OS X") != -1;
  } catch {
    return false;
  }
}

export function update(callback: () => unknown, interval: number = 1000) {
  callback();
  setInterval(callback, interval);
}

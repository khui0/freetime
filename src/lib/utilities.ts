import { locations } from "./sbu";

import Fuse from "fuse.js";

const fuse = new Fuse(Object.values(locations), {
  includeScore: true,
  shouldSort: true,
  keys: ["name"],
});

export function parse(data: string) {
  const courses = data.match(/^[A-Z]{3} [0-9]{3}/gm);
  if (!courses) return;
  const extracted = data
    .trim()
    .split(/^[A-Z]{3} [0-9]{3}/gm)
    .map((item) => item.split("\n").filter((line) => line.trim()))
    .filter((item) => item[0].startsWith(" - "));
  const schedule: CalendarEvent[] = [];
  for (let i = 0; i < extracted.length; i++) {
    const timeRegex =
      /((?:Mo|Tu|We|Th|Fr|Sa|Su)+) ([0-9]{1,2}:[0-9]{1,2}(?:AM|PM)) - ([0-9]{1,2}:[0-9]{1,2}(?:AM|PM))/;
    const item = extracted[i];
    const indicies = item.reduce((a: number[], e, i) => {
      if (e === "View Textbook") a.push(i);
      return a;
    }, []);
    indicies.forEach((index) => {
      const type = item[index - 5];
      const times = item[index - 4].match(timeRegex);
      const location = item[index - 3].match(/(.+) ([A-Z]?[0-9-]+)/);
      const buildingCode = Object.entries(locations).find(([, value]) => {
        return value.name === fuse.search(location?.[1] || "")[0].item.name;
      })?.[0];
      console.log(buildingCode);
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

interface CalendarEvent {
  title: string;
  number: string;
  type: string;
  days: boolean[];
  from: string;
  to: string;
  location: string;
  room: string;
}

interface Locations {
  [key: string]: {
    name: string;
    short?: string;
  };
}

interface Result {
  error?: string;
  success?: string;
}

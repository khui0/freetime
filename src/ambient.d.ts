interface CalendarEvent {
  title: string;
  number: string;
  type: string;
  days: boolean[];
  from: string;
  to: string;
  location: string;
  room: string;
  online: boolean;
}

interface Locations {
  [key: string]: {
    name: string;
    short?: string;
    maps?: string;
    lat?: string;
    lon?: string;
  };
}

interface Result {
  error?: string;
  success?: string;
}

interface TaskData {
  title: string;
  description: string;
  course: string;
  date: string;
  completed: boolean;
}

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isToday
} from 'date-fns';

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dateString: string; // YYYY-MM-DD format
}

export function generateCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDayOfMonth = startOfMonth(new Date(year, month));
  const lastDayOfMonth = endOfMonth(new Date(year, month));

  const calendarStart = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 }); // Sunday
  const calendarEnd = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });

  const days: CalendarDay[] = [];
  let currentDate = calendarStart;

  while (currentDate <= calendarEnd) {
    days.push({
      date: currentDate,
      dayNumber: currentDate.getDate(),
      isCurrentMonth: isSameMonth(currentDate, firstDayOfMonth),
      isToday: isToday(currentDate),
      dateString: format(currentDate, 'yyyy-MM-dd')
    });
    currentDate = addDays(currentDate, 1);
  }

  return days;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'yyyy-MM-dd');
}

export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'MMM d, yyyy');
}

export function isSameDateString(date1: string, date2: string): boolean {
  return date1 === date2;
}

export function compareDates(date1: string, date2: string): number {
  return new Date(date1).getTime() - new Date(date2).getTime();
}

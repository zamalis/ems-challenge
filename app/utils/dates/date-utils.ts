export const getFormattedDateTime = (date: Date): string => {
  return `${getFormattedDate(date)} ${getFormattedTime(date)}`;
};

export const getFormattedDate = (date: Date): string => {
  return `${date.getDate()} ${getMonth(date)} ${date.getFullYear()}`;
};

export const getMonth = (date: Date): string => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months[date.getMonth()];
};

export const getFormattedTime = (date: Date): string => {
  const hours = date.getHours();
  const hoursStr = hours.toString().padStart(2, "0");

  const minutes = date.getMinutes();
  const minutesStr = minutes.toString().padStart(2, "0");

  return `${hoursStr}:${minutesStr}`;
};

export const getFormattedCalendarDateTime = (date: Date): string => {
  const calendarDate = date.toISOString().split("T")[0];
  const calendarTime = getFormattedTime(date);
  return `${calendarDate} ${calendarTime}`;
};

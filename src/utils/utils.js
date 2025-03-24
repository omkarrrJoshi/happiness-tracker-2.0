function getDayOfWeek(dateString) {
  const date = new Date(dateString);
  return getDayOfWeekByDate(date);
}

function getDayOfWeekByDate(date) {
  if (isNaN(date)) {
    throw new Error("Invalid date format");
  }

  const days = [
    { name: "Sunday", index: 0 },
    { name: "Monday", index: 1 },
    { name: "Tuesday", index: 2 },
    { name: "Wednesday", index: 3 },
    { name: "Thursday", index: 4 },
    { name: "Friday", index: 5 },
    { name: "Saturday", index: 6 },
  ];

  const dayIndex = date.getDay();
  return days[dayIndex]; // Returns object { name: "Monday", index: 1 }
}

function getEndOfNextMonthWeek(dateStr) {
  // Create Date object in IST
  const date = toISTDate(dateStr);

  // Move to the first day of the next month
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  // Find the first Sunday of the next month
  const firstWeekEnd = new Date(nextMonth);
  while (firstWeekEnd.getDay() !== 0) { // 0 = Sunday
      firstWeekEnd.setDate(firstWeekEnd.getDate() + 1);
  }

  // Convert to IST manually using Intl.DateTimeFormat
  const formatter = new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Kolkata'
  });

  // Format date as YYYY-MM-DD
  const [{ value: dd }, , { value: mm }, , { value: yyyy }] = formatter.formatToParts(firstWeekEnd);
  return `${yyyy}-${mm}-${dd}`;
}

function toISTDate(dateStr) {
  const date = dateStr ? new Date(dateStr + "T00:00:00+05:30") : new Date();
  return new Date(date.getTime() + (5.5 * 60 * 60 * 1000)); // Convert to IST
};

const convertToIST = (utcDateString) => {
  const utcDate = new Date(utcDateString);
  return new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000); // Convert to IST
};

module.exports = {
  getDayOfWeek,
  getDayOfWeekByDate,
  getEndOfNextMonthWeek,
  toISTDate,
  convertToIST
}
function getDayOfWeek(dateString) {
  const date = new Date(dateString);
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

module.exports = {
  getDayOfWeek,
}
const DateIcon = ({ date, index, setHoveredRecord }) => {
  // Month display
  const getMonthColor = (dateString) => {
    const month = new Date(dateString).getMonth();
    const monthColors = [
      "bg-red-500 border-red-500", // Jan
      "bg-orange-500 border-orange-500", // Feb
      "bg-yellow-500 border-yellow-500", // Mar
      "bg-green-500 border-green-500", // Apr
      "bg-teal-500 border-teal-500", // May
      "bg-blue-500 border-blue-500", // Jun
      "bg-indigo-500 border-indigo-500", // Jul
      "bg-purple-500 border-purple-500", // Aug
      "bg-pink-500 border-pink-500", // Sep
      "bg-red-700 border-red-700", // Oct
      "bg-orange-700 border-orange-700", // Nov
      "bg-yellow-700 border-yellow-700", // Dec
    ];
    return monthColors[month];
  };

  return (
    <div
      className={`w-12 flex flex-col m-1 pt-0 border-2 border-t-0 ${getMonthColor(
        date
      )} rounded items-center justify-center relative`}
      onMouseEnter={() => setHoveredRecord(index)}
      onMouseLeave={() => setHoveredRecord(null)}
    >
      <h1 className="text-xs">
        {new Date(date).toLocaleString("default", {
          month: "short",
        })}
      </h1>
      <div className="w-full rounded bg-text">
        <h1 className="text-lg text-background">{new Date(date).getDate()}</h1>
      </div>
    </div>
  );
};

export default DateIcon;

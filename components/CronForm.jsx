"use client";

import React, { useState } from "react";
import Select from "react-select";

const options = {
  minute: Array.from({ length: 60 }, (v, k) => ({
    value: k,
    label: k.toString(),
  })),
  hour: Array.from({ length: 24 }, (v, k) => ({
    value: k,
    label: k.toString(),
  })),
  dayOfMonth: Array.from({ length: 31 }, (v, k) => ({
    value: k + 1,
    label: (k + 1).toString(),
  })),
  month: [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ],
  dayOfWeek: [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ],
};

const generateCronExpression = ({
  minute,
  hour,
  dayOfMonth,
  month,
  dayOfWeek,
}) => {
  const minutePart = minute !== null ? minute.value : "*";
  const hourPart = hour !== null ? hour.value : "*";
  const dayOfMonthPart = dayOfMonth !== null ? dayOfMonth.value : "*";
  const monthPart = month !== null ? month.value : "*";
  const dayOfWeekPart = dayOfWeek !== null ? dayOfWeek.value : "*";

  return `${minutePart} ${hourPart} ${dayOfMonthPart} ${monthPart} ${dayOfWeekPart}`;
};

const CronForm = ({ onSubmit }) => {
  const [minute, setMinute] = useState(null);
  const [hour, setHour] = useState(null);
  const [dayOfMonth, setDayOfMonth] = useState(null);
  const [month, setMonth] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [taskCommand, setTaskCommand] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const cronExpression = generateCronExpression({
      minute,
      hour,
      dayOfMonth,
      month,
      dayOfWeek,
    });
    onSubmit(cronExpression, taskName, taskCommand);
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-24 py-12">
        <h1 className="text-2xl">Get started by selecting configuration</h1>
      <form onSubmit={handleSubmit} className="flex">
        <div>
          <label>Task Name:</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>
        <div>
          <label>Task Command:</label>
          <input
            type="text"
            value={taskCommand}
            onChange={(e) => setTaskCommand(e.target.value)}
          />
        </div>
        <div>
          <label>Minute:</label>
          <Select options={options.minute} onChange={setMinute} isClearable />
        </div>
        <div>
          <label>Hour:</label>
          <Select options={options.hour} onChange={setHour} isClearable />
        </div>
        <div>
          <label>Day of Month:</label>
          <Select
            options={options.dayOfMonth}
            onChange={setDayOfMonth}
            isClearable
          />
        </div>
        <div>
          <label>Month:</label>
          <Select options={options.month} onChange={setMonth} isClearable />
        </div>
        <div>
          <label>Day of Week:</label>
          <Select
            options={options.dayOfWeek}
            onChange={setDayOfWeek}
            isClearable
          />
        </div>
        <button type="submit">Generate YAML</button>
      </form>
    </main>
  );
};

export default CronForm;

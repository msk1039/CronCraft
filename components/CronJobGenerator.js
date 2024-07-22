import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LuClipboard } from "react-icons/lu";

const CronJobGenerator = () => {
  const [schedule, setSchedule] = useState({
    minutes: { type: "every", values: [] },
    hours: { type: "every", values: [] },
    daysOfMonth: { type: "every", values: [] },
    months: { type: "every", values: [] },
    daysOfWeek: { type: "every", values: [] },
  });
  const [jobName, setJobName] = useState("");
  const [command, setCommand] = useState("");
  const [yamlOutput, setYamlOutput] = useState("");

  const updateSchedule = (field, type, value) => {
    setSchedule((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        type: type,
        values:
          type === "specific"
            ? prev[field].values.includes(value)
              ? prev[field].values.filter((v) => v !== value)
              : [...prev[field].values, value]
            : [],
      },
    }));
  };

  const generateCronExpression = () => {
    const fields = ["minutes", "hours", "daysOfMonth", "months", "daysOfWeek"];
    return fields
      .map((field) => {
        if (schedule[field].type === "every") return "*";
        if (
          schedule[field].type === "every_between" &&
          schedule[field].values.length === 2
        ) {
          return `${schedule[field].values[0]}-${schedule[field].values[1]}`;
        }
        return schedule[field].values.join(",") || "*";
      })
      .join(" ");
  };

  const generateYAML = () => {
    const cronExpression = generateCronExpression();
    const yaml = `name: ${jobName}
on:
  schedule:
    - cron: '${cronExpression}'
jobs:
  ${jobName.toLowerCase().replace(/\s+/g, "-")}:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run scheduled task
        run: ${command}`;

    setYamlOutput(yaml);
  };

  const renderFieldInputs = (field, options) => (
    <div className="space-y-2">
      <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
      <Select onValueChange={(value) => updateSchedule(field, value, "")}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${field} option`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="every">Every {field}</SelectItem>
          <SelectItem value="specific">Specific {field}</SelectItem>
          {field !== "months" && field !== "daysOfWeek" && (
            <SelectItem value="every_between">Every between</SelectItem>
          )}
        </SelectContent>
      </Select>
      {schedule[field].type === "specific" && (
        <div className="grid grid-cols-6 gap-2">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${field}-${option}`}
                checked={schedule[field].values.includes(option.toString())}
                onCheckedChange={(checked) =>
                  updateSchedule(field, "specific", option.toString())
                }
              />
              <Label htmlFor={`${field}-${option}`}>{option}</Label>
            </div>
          ))}
        </div>
      )}
      {schedule[field].type === "every_between" && (
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="From"
            min={0}
            max={field === "minutes" || field === "hours" ? 59 : 31}
            value={schedule[field].values[0] || ""}
            onChange={(e) =>
              updateSchedule(field, "every_between", e.target.value)
            }
          />
          <Input
            type="number"
            placeholder="To"
            min={0}
            max={field === "minutes" || field === "hours" ? 59 : 31}
            value={schedule[field].values[1] || ""}
            onChange={(e) =>
              updateSchedule(field, "every_between", e.target.value)
            }
          />
        </div>
      )}
    </div>
  );

  return (
    <Card className="md:w-full max-w-3xl mx-6 md:mx-auto">
      <CardHeader>
        <CardTitle>GitHub Actions Cron Job Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Job Name"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
          />
          <Input
            placeholder="Command to run"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
          />
          {renderFieldInputs(
            "minutes",
            Array.from({ length: 60 }, (_, i) => i)
          )}
          {renderFieldInputs(
            "hours",
            Array.from({ length: 24 }, (_, i) => i)
          )}
          {renderFieldInputs(
            "daysOfMonth",
            Array.from({ length: 31 }, (_, i) => i + 1)
          )}
          {renderFieldInputs("months", [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ])}
          {renderFieldInputs("daysOfWeek", [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
          ])}
          <Button onClick={generateYAML}>Generate YAML</Button>
          {yamlOutput && (
            <div className="relative">
            
              <Button className="absolute top-5 right-5" onClick={() => navigator.clipboard.writeText(yamlOutput)}>
                <LuClipboard className="mr-2 h-4 w-4" /> copy
              </Button>

              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                {yamlOutput}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CronJobGenerator;

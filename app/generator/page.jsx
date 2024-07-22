"use client";
// import React, { useState } from "react";
// import CronForm from "../../components/CronForm";
// import { generateYAML } from '../../utils/generateYAML';

import CronJobGenerator from "../../components/CronJobGenerator";

export default function generator() {
  //   const [yamlOutput, setYamlOutput] = useState("");

  //   const handleFormSubmit = (cronExpression, taskName, taskCommand) => {
  //     const yaml = generateYAML(cronExpression, taskName, taskCommand);
  //     setYamlOutput(yaml);
  //   };

  return (
    <>
      {/* <div>
        <h1>Cron Job YAML Generator</h1>
        <CronForm onSubmit={handleFormSubmit} />
        {yamlOutput && (
          <div>
            <h2>Generated YAML</h2>
            <pre>{yamlOutput}</pre>
            <button onClick={() => navigator.clipboard.writeText(yamlOutput)}>
              Copy to Clipboard
            </button>
          </div>
        )}
      </div> */}
      <div className="container mx-auto py-6">
        <CronJobGenerator />
      </div>
    </>
  );
}

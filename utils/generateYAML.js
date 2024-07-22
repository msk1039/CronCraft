import yaml from 'yaml';

export function generateYAML(cronExpression, taskName, taskCommand) {
  const workflow = {
    name: taskName,
    on: {
      schedule: [{ cron: cronExpression }]
    },
    jobs: {
      build: {
        'runs-on': 'ubuntu-latest',
        steps: [
          { name: 'Checkout repository', uses: 'actions/checkout@v2' },
          { name: 'Run a command', run: taskCommand }
        ]
      }
    }
  };

  return yaml.stringify(workflow);
}
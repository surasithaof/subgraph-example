const prompts = require("prompts")
const shell = require("shelljs")

async function run() {
  const environment = await prompts({
    type: "select",
    name: "environment",
    message: "Select a environment to deploy",
    choices: [
      { title: "Localhost", value: "local" },
      { title: "Dev", value: "dev" },
    ],
  })
  const label = await prompts({
    type: "list",
    name: "label",
    message: `Which version label to use? (e.g. "v0.0.1")`,
    initial: "v0.0.1",
  })
  shell.exec(`npm run create-${environment.environment}`)
  shell.exec(`npm run deploy-${environment.environment} -- -l=${label.label}`)
}

run().catch(error => {
  console.error(error)
  process.exitCode = 1
})

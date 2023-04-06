const Handlebars = require("handlebars")
const fs = require("fs")

async function generateMenifest() {
  const template = fs.readFileSync("src/subgraph.template.yaml", "utf8")

  Handlebars.registerHelper("incremented", index => {
    index++
    return index
  })

  const compiledTemplate = Handlebars.compile(template)
  const configValue = fs.readFileSync("config/config.json", "utf8")
  const config = JSON.parse(configValue)

  const output = compiledTemplate(config)

  fs.writeFileSync("subgraph.yaml", output)
}

generateMenifest()

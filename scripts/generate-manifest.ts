const fs = require("fs")
const Handlebars = require("handlebars")

const template = fs.readFileSync("subgraph.template.yaml", "utf8")

Handlebars.registerHelper("incremented", index => {
  index++
  return index
})

const compiledTemplate = Handlebars.compile(template)
const configValue = fs.readFileSync("config/config.json", "utf8")
const config = JSON.parse(configValue)

const output = compiledTemplate(config)

fs.writeFileSync("subgraph.yaml", output)

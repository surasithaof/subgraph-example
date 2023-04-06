/* eslint-disable @typescript-eslint/no-var-requires */
const prompts = require("prompts")
const fs = require("fs")

async function run() {
  const configFile = "config/config.json"

  let existDealFactoryContractAddresses = []
  if (fs.existsSync(configFile)) {
    const configValue = fs.readFileSync(configFile, "utf8")
    const existConfig = JSON.parse(configValue)
    existDealFactoryContractAddresses = existConfig.dealFactoryContractAddresses
  }

  const response = await prompts([
    {
      type: "select",
      name: "network",
      message: "Select a network",
      choices: [
        { title: "Mainnet", value: "mainnet" },
        { title: "Ropsten", value: "ropsten" },
        { title: "Rinkeby", value: "rinkeby" },
        { title: "Kovan", value: "kovan" },
        { title: "Goerli", value: "goerli" },
        { title: "Localhost", value: "localhost" },
      ],
    },
    {
      type: "number",
      name: "startBlock",
      message: "Enter a start block number",
      initial: 0,
    },
    {
      type: "list",
      name: "dealFactoryContractAddresses",
      message:
        "Enter one or more deal factory contract addresses (separated by commas)",
      initial: existDealFactoryContractAddresses?.toString(),
      separator: ",",
      validate: value => {
        const addresses = value.replace(" ", "").split(",")
        const invalidAddress = addresses.find(
          address => !address.startsWith("0x") || address.length != 42
        )
        if (invalidAddress) {
          return `Invalid contract address: ${invalidAddress}`
        } else if (value.length == 0) {
          return `Please input at least one contract address`
        }
        return true
      },
    },
  ])
  if (
    response?.network == undefined ||
    response?.startBlock == undefined ||
    response?.dealFactoryContractAddresses == undefined
  ) {
    return
  }

  const config = {
    network: response.network,
    startBlock: response.startBlock,
    dealFactoryContractAddresses: response.dealFactoryContractAddresses,
  }

  const configJson = JSON.stringify(config, null, 2)
  fs.writeFileSync(configFile, configJson)

  console.log(`Config file created with the following values:\n${configJson}`)
}

run().catch(error => {
  console.error(error)
  process.exitCode = 1
})

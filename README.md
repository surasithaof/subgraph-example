# ABC VMS - Subgraph

## Overview

This subgraph for the ABC VMS project (ERC1155 for deals).

### Setting Up

Run the following command to install dependencies:

```bash
npm i
```

or use Yarn

```bash
yarn
```

### Configuration

In [`configs/config.json`](config/config.json), you should config which factory contract addresses to listen and start block number to sync data.

> For Kaleido Non-Prod, `startBlock` must be latest block! because we are not have archive node that store historical states.

### Deployment to Local Environment

1. Start [Ganache UI](https://trufflesuite.com/ganache/) with port `8545` as your local blokchain.
2. run `docker-compose up -d` to start graphnode, IPFS and database.
3. Deploy contract to your ganache (DealsFactoryContract and DealsContract). You can deploy contracts using [Remix IDE](https://remix.ethereum.org/) or [Hardhat](https://hardhat.org/)
4. Set deal factory contract addresses and start block in [`configs/config.json`](config/config.json).
5. run `npm run prepare` to replace config value to create subgraph manifest file ([`subgraph.yaml`](subgraph.yaml)) from subgraph template ([`subgraph.template.yaml`](subgraph.template.yaml)).
6. run `npm run compile` to compile the code to WebAssembly
7. run `npm run local:setup` to create subgrap. (You can run only first time, If you create subgraph already, you don't need to run this command again)
8. run `npm run local:deploy` to deploy subgraph.

Then, you can access subgraph endpoint at [`http://localhost:8000/subgraphs/name/abc/vms`](http://localhost:8000/subgraphs/name/abc/vms).

### Deployment to Other Environment

1. Deploy contracts (DealsFactoryContract and DealsContract)
2. Set deal factory contract addresses and start block in [`configs/config.json`](config/config.json). (for Non-Prod use latest block heigh number for start block)
3. run `npm run prepare` to replace config value to create subgraph manifest file ([`subgraph.yaml`](subgraph.yaml)) from subgraph template ([`subgraph.template.yaml`](subgraph.template.yaml)).
4. run `npm run compile` to replace config value to create subgraph manifest file (`subgraph.yaml`) from subgraph template (`subgraph.template.yaml`).
5. run `npm run <dev|stg|prod>:setup` to create subgrap. (You can run only first time, If you create subgraph already, you don't need to run this command again)
6. run `npm run <dev|stg|prod>:deploy` to deploy subgraph.

### Query

You can see the example queries document [here](docs/queries.md)

### Referent

- [SubGraph configuration and deploy](https://ascendbit.atlassian.net/wiki/spaces/DEVOPS/pages/2165833813/SubGraph+configuration+and+deploy)
- [Deploy Subgraphs to Any EVM](https://medium.com/coinmonks/deploy-subgraphs-to-any-evm-aaaccc3559f)
- [OpenZeppelin Subgraphs](https://docs.openzeppelin.com/subgraphs/0.1.x/)
- [OpenZeppelin example query](https://docs.openzeppelin.com/subgraphs/0.1.x/examples/query)
- [Ubeswap - subgraph workshop](https://github.com/dabit3/ubeswap-subgraph-workshop)
- [Defining a Subgraph](https://thegraph.academy/developers/defining-a-subgraph/)
- [Creating subgraphs for multiple smart contracts](https://learn.figment.io/tutorials/creating-subgraphs-for-multiple-smart-contracts)
- [Deploying a Subgraph to the Hosted Service](https://thegraph.com/docs/en/deploying/deploying-a-subgraph-to-hosted/)

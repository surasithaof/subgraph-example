import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { NewDealsContract } from "../generated/DealsFactory-1/DealsFactory"

export function createNewDealsContractEvent(
  contractAddress: Address,
  merchant: Address
): NewDealsContract {
  const newDealsContractEvent = changetype<NewDealsContract>(newMockEvent())

  newDealsContractEvent.parameters = []

  newDealsContractEvent.parameters.push(
    new ethereum.EventParam(
      "contractAddress",
      ethereum.Value.fromAddress(contractAddress)
    )
  )
  newDealsContractEvent.parameters.push(
    new ethereum.EventParam("merchant", ethereum.Value.fromAddress(merchant))
  )

  return newDealsContractEvent
}

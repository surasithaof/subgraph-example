import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
  createMockedFunction,
} from "matchstick-as/assembly/index"
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"
import { handleNewDealsContract } from "../src/mapping"
import { createNewDealsContractEvent } from "./deals-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    const contractAddress = Address.fromString(
      "0x74586a1576e5edfee54F1Aa425a31976A8D15e78"
    )
    const merchant = Address.fromString(
      "0xf13296793E2cef69dd319dB31A64647C2A434B17"
    )
    const baseUri = "vms.test"

    const argsArray: Array<ethereum.Value> = [
      ethereum.Value.fromAddress(merchant),
      ethereum.Value.fromString(baseUri),
    ]
    createMockedFunction(
      contractAddress,
      "createDealsContract",
      "createDealsContract(address, string):(address)"
    )
      .withArgs(argsArray)
      .returns([ethereum.Value.fromAddress(merchant)])

    createMockedFunction(contractAddress, "merchant", "merchant():(address)")
      .withArgs([])
      .returns([ethereum.Value.fromAddress(merchant)])

    createMockedFunction(contractAddress, "uri", "uri(uint256):(string)")
      .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))])
      .returns([ethereum.Value.fromString(baseUri)])

    const newNewDealsContractEvent = createNewDealsContractEvent(
      contractAddress,
      merchant
    )
    handleNewDealsContract(newNewDealsContractEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("DealContract created and stored", () => {
    assert.entityCount("DealContract", 1)

    const expectMerchant = "0xf13296793e2cef69dd319db31a64647c2a434b17"
    const expectBaseUri = "vms.test"
    // 0x74586a1576e5edfee54f1aa425a31976a8d15e78 is the default address used in newMockEvent() function
    assert.fieldEquals(
      "DealContract",
      "0x74586a1576e5edfee54f1aa425a31976a8d15e78",
      "merchant",
      expectMerchant
    )
    assert.fieldEquals(
      "DealContract",
      "0x74586a1576e5edfee54f1aa425a31976a8d15e78",
      "baseUri",
      expectBaseUri
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

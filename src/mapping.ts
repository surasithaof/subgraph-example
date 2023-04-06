import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  DealContract,
  DealOwner,
  DealToken,
  UserDeal,
} from "../generated/schema"
import { Deals as DealsTemplate } from "../generated/templates"
import { NewDealsContract as NewDealsContractEvent } from "../generated/DealsFactory-1/DealsFactory"

import { log } from "@graphprotocol/graph-ts"
import {
  Deals,
  NewDeal as NewDealEvent,
  TransferSingle as TransferSingleEvent,
} from "../generated/DealsFactory-1/Deals"

const ZERO_ADDRESS_STRING = "0x0000000000000000000000000000000000000000"
const ZERO = BigInt.fromI32(0)

export function handleNewDealsContract(event: NewDealsContractEvent): void {
  log.info("handleNewDealsContract called", [])
  log.info("merchant: {}", [event.params.merchant.toHexString()])
  const merchant = event.params.merchant
  const dealContractAddress = event.params.contractAddress
  log.info("create deal contract dealContractAddress: {}, merchant:{}", [
    dealContractAddress.toHexString(),
    merchant.toHexString(),
  ])

  const dealContract = Deals.bind(event.params.contractAddress)
  const dealContractRecord = new DealContract(dealContractAddress.toHexString())
  const try_merchant = dealContract.try_merchant()
  dealContractRecord.merchant = try_merchant.reverted
    ? ""
    : try_merchant.value.toHexString()
  const try_uri = dealContract.try_uri(ZERO)
  dealContractRecord.baseUri = try_uri.reverted ? "" : try_uri.value

  log.info("dealContract create : {}", [dealContractRecord.id])
  DealsTemplate.create(event.params.contractAddress)
  dealContractRecord.save()
}

// Owner
export function fetchOwner(address: Address): DealOwner {
  let owner = DealOwner.load(address.toHex())
  if (owner) {
    return owner as DealOwner
  }
  owner = new DealOwner(address.toHex())
  owner.save()
  return owner as DealOwner
}

export function handleNewDeal(event: NewDealEvent): void {
  log.info("handleNewDeal called", [])

  const contractAddress = event.address
  const deals = Deals.bind(contractAddress)
  let contract = DealContract.load(contractAddress.toHex())
  if (!contract) {
    log.info("create DealContract", [])

    contract = new DealContract(contractAddress.toHex())
    const try_merchant = deals.try_merchant()
    contract.merchant = try_merchant.reverted
      ? ""
      : try_merchant.value.toHexString()
    const try_uri = deals.try_uri(ZERO)
    contract.baseUri = try_uri.reverted ? "" : try_uri.value
    contract.save()
  }

  const tokenId = event.params.id
  const maxSupply = event.params.maxSupply
  const expirationDate = event.params.expirationDate
  const dealTokenId = contract.merchant.concat("_").concat(tokenId.toString())
  log.info("create dealToken tokenId:{}, maxSupply:{}, expirationDate: {}", [
    tokenId.toString(),
    maxSupply.toString(),
    expirationDate.toString(),
  ])

  const dealToken = new DealToken(dealTokenId)
  dealToken.uri = contract.baseUri
  dealToken.tokenId = tokenId
  dealToken.maxSupply = maxSupply
  dealToken.totalSupply = ZERO
  dealToken.expirationDate = expirationDate
  dealToken.contract = contract.id

  log.info("dealToken create : {}", [dealToken.id])
  dealToken.save()
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  log.info("handleTransferSingle called", [])

  const contractAddress = event.address
  const deals = Deals.bind(contractAddress) as Deals
  let contract = DealContract.load(contractAddress.toHex())
  if (!contract) {
    contract = new DealContract(contractAddress.toHex())
    const try_merchant = deals.try_merchant()
    contract.merchant = try_merchant.reverted
      ? ""
      : try_merchant.value.toHexString()
    const try_uri = deals.try_uri(ZERO)
    contract.baseUri = try_uri.reverted ? "" : try_uri.value
    contract.save()
  }

  // Token Part
  const from = event.params.from
  const to = event.params.to
  const tokenId = event.params.id
  const dealTokenId = contract.merchant.concat("_").concat(tokenId.toString())
  const amount = event.params.value

  const try_deal = deals.try_deals(tokenId)
  if (try_deal.reverted) {
    log.info("try_deal reverted -> token id {}", [tokenId.toString()])
    return
  }

  let dealToken = DealToken.load(dealTokenId)
  if (!dealToken) {
    dealToken = new DealToken(dealTokenId)
    dealToken.uri = contract.baseUri
    dealToken.tokenId = tokenId
    dealToken.maxSupply = try_deal.value.getMaxSupply()
    dealToken.totalSupply = try_deal.value.getTotalSupply()
    dealToken.expirationDate = try_deal.value.getExpirationDate()
    dealToken.contract = contract.id

    log.info("dealToken create : {}", [dealToken.id])
    dealToken.save()
  }
  // Issue Voucher
  if (from.toHexString() == ZERO_ADDRESS_STRING) {
    const newOwner = fetchOwner(to)
    handleIssueVoucher(dealTokenId, newOwner, amount)
  } else if (to.toHexString() == contract.merchant) {
    const oldOwner = fetchOwner(from)
    handleRedeemVoucher(dealTokenId, oldOwner, amount)
  }
}

function handleIssueVoucher(
  dealTokenId: string,
  newOwner: DealOwner,
  // eslint-disable-next-line @typescript-eslint/ban-types
  amount: BigInt
): void {
  log.info("handleTransferSingle start issue voucher", [])

  const dealToken = DealToken.load(dealTokenId)
  if (!dealToken) {
    log.info("handleTransferSingle issue voucher -> not found deal token {}", [
      dealTokenId,
    ])
    return
  }
  log.info("handleTransferSingle issue voucher -> deal token {}", [
    dealToken.id,
  ])

  const userDealId = newOwner.id.concat("_").concat(dealTokenId)
  let userDeal = UserDeal.load(userDealId)
  if (!userDeal) {
    userDeal = new UserDeal(userDealId)
    userDeal.owner = newOwner.id
    userDeal.detail = dealTokenId
    userDeal.issuedBalance = ZERO
    userDeal.redeemedBalance = ZERO
  }

  userDeal.issuedBalance = userDeal.issuedBalance.plus(amount)
  userDeal.save()

  dealToken.totalSupply = dealToken.totalSupply.plus(amount)
  dealToken.save()
  log.info("handleTransferSingle complete issue voucher", [])
}

function handleRedeemVoucher(
  dealTokenId: string,
  oldOwner: DealOwner, // eslint-disable-next-line @typescript-eslint/ban-types
  amount: BigInt
): void {
  log.info("handleTransferSingle start redeem voucher", [])

  const dealToken = DealToken.load(dealTokenId)
  if (!dealToken) {
    log.info("handleTransferSingle redeem voucher -> not found deal token {}", [
      dealTokenId,
    ])
    return
  }
  log.info("handleTransferSingle redeem voucher -> deal token {}", [
    dealToken.id,
  ])

  const userDealId = oldOwner.id.concat("_").concat(dealTokenId)
  const userDeal = UserDeal.load(userDealId)
  if (!userDeal) {
    return
  }

  userDeal.redeemedBalance = userDeal.redeemedBalance.plus(amount)
  userDeal.issuedBalance = userDeal.issuedBalance.minus(amount)
  userDeal.save()

  log.info("handleTransferSingle complete redeem voucher", [])
}

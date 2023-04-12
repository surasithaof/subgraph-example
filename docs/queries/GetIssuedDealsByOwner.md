# Get issued deals by owner

## Query function

```gql
query GetIssuedDealsByOwner(
  $ownerWalletAddress: String!
  $now: BigInt
  $limit: Int!
  $skip: Int!
) {
  dealOwner(id: $ownerWalletAddress, limit: $limit, skip: $skip) {
    id
    userDeals(
      first: $limit
      skip: $skip
      where: { issuedBalance_gt: 0, detail_: { expirationDate_gt: $now } }
      orderBy: latestRedeemTime
      orderDirection: desc
    ) {
      id
      detail {
        contract {
          merchant
        }
        expirationDate
        tokenId
        uri
      }
      issuedBalance
    }
  }
}
```

## Query variables

```json
{
  "ownerWalletAddress": "0x4cd43a57543e991d7888d291a5ca5fa6f14d49ee",
  "now": 1683087751,
  "limit": 10,
  "skip": 0
}
```

## Example response

```json
{
  "data": {
    "dealOwner": {
      "id": "0x4cd43a57543e991d7888d291a5ca5fa6f14d49ee",
      "userDeals": [
        {
          "id": "0x4cd43a57543e991d7888d291a5ca5fa6f14d49ee_0x093fe54508502ec0e4eba8a60c1f8ce18f423878_1",
          "detail": {
            "contract": {
              "merchant": "0x093fe54508502ec0e4eba8a60c1f8ce18f423878"
            },
            "now": "1682914736",
            "tokenId": "1",
            "uri": "https://vms.test/VMSM001/deals/{id}"
          },
          "issuedBalance": "1"
        }
      ]
    }
  }
}
```

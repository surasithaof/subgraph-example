# Get redeemed deals by owner

## Query function

```gql
query GetRedeemedDealsByOwner(
  $ownerWalletAddress: String!
  $now: BigInt!
  $after: BigInt!
  $limit: Int!
  $skip: Int!
) {
  dealOwner(id: $ownerWalletAddress, limit: $limit, skip: $skip) {
    id
    userDeals(
      first: $limit
      skip: $skip
      where: {
        redeemedBalance_gt: 0
        latestRedeemTime_gte: $after
        detail_: { expirationDate_gt: $now }
      }
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
      redeemedBalance
    }
  }
}
```

## Query variables

```json
{
  "ownerWalletAddress": "0x96026e065d16f3ac5adb9f97b342ebc113f11bfb",
  "now": 1683087751,
  "after": 1676022506,
  "limit": 10,
  "skip": 0
}
```

## Example response

```json
{
  "data": {
    "dealOwner": {
      "id": "0x96026e065d16f3ac5adb9f97b342ebc113f11bfb",
      "userDeals": [
        {
          "id": "0x96026e065d16f3ac5adb9f97b342ebc113f11bfb_0x52985dec1c40ff5ff3a774bc51763dbb504df7ae_1",
          "detail": {
            "contract": {
              "merchant": "0x52985dec1c40ff5ff3a774bc51763dbb504df7ae"
            },
            "now": "1683087751",
            "tokenId": "1",
            "uri": "https://vms.test/VMSM01/deals/{id}"
          },
          "redeemedBalance": "1"
        }
      ]
    }
  }
}
```

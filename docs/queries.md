# Query functions

## Get issued deals by owner

### Query function

```gql
query GetIssuedDealsByOwner(
  $ownerWalletAddress: String!
  $limit: Int!
  $skip: Int!
) {
  dealOwner(id: $ownerWalletAddress, limit: $limit, skip: $skip) {
    id
    userDeals(first: $limit, skip: $skip, where: { issuedBalance_gt: 0 }) {
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

### Query variables

```json
{
  "ownerWalletAddress": "0x4cd43a57543e991d7888d291a5ca5fa6f14d49ee",
  "limit": 10,
  "skip": 0
}
```

### Example response

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
            "expirationDate": "1682914736",
            "tokenId": "1",
            "uri": "https://example.test/M001/deals/{id}"
          },
          "issuedBalance": "1"
        }
      ]
    }
  }
}
```

---

## Get expired or redeemed deals by owner

### Query function

```gql
query GetExpiredOrRedeemedDealsByOwner(
  $ownerWalletAddress: String!
  $expirationDate: BigInt!
  $limit: Int!
  $skip: Int!
) {
  dealOwner(id: $ownerWalletAddress, limit: $limit, skip: $skip) {
    id
    userDeals(
      first: $limit
      skip: $skip
      where: {
        or: [
          { redeemedBalance_gt: 0 }
          { detail_: { expirationDate_gte: $expirationDate } }
        ]
      }
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
      issuedBalance
    }
  }
}
```

### Query variables

```json
{
  "ownerWalletAddress": "0x96026e065d16f3ac5adb9f97b342ebc113f11bfb",
  "expirationDate": 1683087751,
  "limit": 10,
  "skip": 0
}
```

### Example response

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
            "expirationDate": "1683087751",
            "tokenId": "1",
            "uri": "https://example.test/M01/deals/{id}"
          },
          "redeemedBalance": "1",
          "issuedBalance": "1"
        }
      ]
    }
  }
}
```

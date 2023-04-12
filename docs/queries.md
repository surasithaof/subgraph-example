# Query functions

## Get issued deals by owner

### Query function

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

### Query variables

```json
{
  "ownerWalletAddress": "0x4cd43a57543e991d7888d291a5ca5fa6f14d49ee",
  "now": 1683087751,
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

---

## Get redeemed deals by owner

### Query function

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

### Query variables

```json
{
  "ownerWalletAddress": "0x96026e065d16f3ac5adb9f97b342ebc113f11bfb",
  "now": 1683087751,
  "after": 1676022506,
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

---

## Get expired deals by owner

### Query function

```gql
query GetExpiredDealsByOwner(
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
        detail_: { expirationDate_lte: $now, expirationDate_gte: $after }
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
      issuedBalance
    }
  }
}
```

### Query variables

```json
{
  "ownerWalletAddress": "0x96026e065d16f3ac5adb9f97b342ebc113f11bfb",
  "now": 1683087751,
  "after": 1676022506,
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
            "now": "1683087751",
            "tokenId": "1",
            "uri": "https://vms.test/VMSM01/deals/{id}"
          },
          "redeemedBalance": "1",
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
        or: [
          { redeemedBalance_gt: 0, latestRedeemTime_gte: $after }
          { detail_: { expirationDate_lte: $now, expirationDate_gte: $after } }
        ]
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
      issuedBalance
    }
  }
}
```

### Query variables

```json
{
  "ownerWalletAddress": "0x96026e065d16f3ac5adb9f97b342ebc113f11bfb",
  "now": 1683087751,
  "after": 1676022506,
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
            "now": "1683087751",
            "tokenId": "1",
            "uri": "https://vms.test/VMSM01/deals/{id}"
          },
          "redeemedBalance": "1",
          "issuedBalance": "1"
        }
      ]
    }
  }
}
```

---

## Get deals by user deal id

### Query function

```gql
query GetUserDeal($userDealId: ID) {
  userDeal(id: $userDealId) {
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
```

### Query variables

```json
{
  "userDealId": "0x1a9c74c172a5cc2225bb32d9225a096f8b495d4d_0x89b447ffcbde1dd32e9a46e82b56f5e0565ea568_1"
}
```

### Example response

```json
{
  "data": {
    "userDeal": {
      "id": "0x1a9c74c172a5cc2225bb32d9225a096f8b495d4d_0x89b447ffcbde1dd32e9a46e82b56f5e0565ea568_1",
      "detail": {
        "contract": {
          "merchant": "0x89b447ffcbde1dd32e9a46e82b56f5e0565ea568"
        },
        "now": "1735664400",
        "tokenId": "1",
        "uri": "https://api-dev.abc-dev.network/vms-light-api-go/v1/orgs/579bd5d9-3a7f-4d6c-af93-7744504bae4d/merchants/VMSM5/deals/{id}"
      },
      "redeemedBalance": "0",
      "issuedBalance": "1"
    }
  }
}
```

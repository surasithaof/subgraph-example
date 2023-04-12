# Get deals by user deal id

## Query function

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

## Query variables

```json
{
  "userDealId": "0x1a9c74c172a5cc2225bb32d9225a096f8b495d4d_0x89b447ffcbde1dd32e9a46e82b56f5e0565ea568_1"
}
```

## Example response

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

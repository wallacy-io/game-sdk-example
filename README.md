# Game SDK

## Integration

`WallacyGameSDK` will be inject into webview when launching game , view [sdk.d.ts](./src/sdk.d.ts) to know how to use SDK.

### Mock SDK for development

In development, you can create a mock SDK to test integration, Ex: [mock_sdk.ts](./src/mock_sdk.ts)

### Server APIs

Endpoint: TBD

### Submit score

- Path: `/api/v1/game_sdk/score`
- Method: `POST`
- Authentication: Add header `X-Client-Secret: CLIENT_SECRET`
- Data: `JSON`
  ```json
  {
    "gameToken": "string",
    "score": 100,
    "signature": "string"
  }
  ```

#### Verify in game purchase receipt

- Path: `/api/v1/game_sdk/purchase`
- Method: `POST`
- Authentication: Add header `X-Client-Secret: CLIENT_SECRET`
- Data: `JSON`
  ```json
  {
    "receipt": "string"
  }
  ```
- Response: `JSON`
  ```json
  {
    "transactionId": "string",
    "tournamentId": "string",
    "gameplayId": "string",
    "item": {
      "id": "string",
      "name": "string",
      "price": 99
    },
    "timestamp": "ISO 8601 timestamp"
  }
  ```

## Development

```sh
$ yarn
$ yarn dev
```

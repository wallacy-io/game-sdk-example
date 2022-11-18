# Game SDK

## Integration

`WallacyGameSDK` will be injected into webview when launching game , view [sdk.d.ts](./src/sdk.d.ts) to know how to use SDK.

1. First step: initialize SDK: `WallacyGameSDK.init()`
2. Get player info & tournament info: `WallacyGameSDK.getPlayer()`, `WallacyGameSDK.getTournament()`
3. Before user play game: Call `WallacyGameSDK.play()` to get game token. User must have ticket to play, call this function will cost 1 ticket.
4. If game has in-game item, user can buy with `WallacyGameSDK.buyInGameItem()`, if success it return a receipt that can be send to server to verify through S2S API.
5. Game over: Call `WallacyGameSDK.signResult()` to sign game play result, then send signature along with game token to game server, game server send score to Wallacy throgh S2S API.

### Mock SDK for development

In development, you can create a mock SDK to test integration, Ex: [mock_sdk.ts](./src/mock_sdk.ts)

### Server APIs

Endpoint: TBD

#### Submit score

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

- Path: `/api/v1/game_sdk/purchased_item`
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

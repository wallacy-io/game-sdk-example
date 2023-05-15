# Game SDK

## Integration

`WallacyGameSDK` will be injected into webview when launching game , view [sdk.d.ts](./src/sdk.d.ts) to know how to use SDK.

1. First step: initialize SDK: `WallacyGameSDK.init()`
2. Get player info & tournament info: `WallacyGameSDK.getPlayer()`, `WallacyGameSDK.getTournament()`
3. Before user play game: Call `WallacyGameSDK.play()` to get game token. User must have ticket to play, call this function will cost 1 ticket.
4. If game has in-game item, user can buy with `WallacyGameSDK.buyInGameItem()`, if success it returns a receipt that can be send to game server to verify through S2S API.
5. Game over: Call `WallacyGameSDK.signResult()` to sign game play result, then send signature along with game token to game server, game server should use this data to submit score to Wallacy through S2S API.

### Error handling

Example:

```ts
try {
  const res = await WallacyGameSDK.play();
} catch (e: Error) {
  switch (e.code) {
    case ErrorCode.TourNotAvailable:
    // do sth
    case ErrorCode.SystemError:
    // do sth
  }
}
```

### Mock SDK for development

In development, you can create a mock SDK to test integration, Ex: [mock_sdk.ts](./src/mock_sdk.ts)

### Server APIs

Endpoint:
  - dev: https://cms-dev.wallacy.io
  - prod: https://api.wallacy.io

#### Submit score

- Path: `/api/v1/game_sdk/score`
- Method: `POST`
- Authentication: Add header:
  - `X-Client-Id: CLIENT_ID`
  - `X-Client-Secret: CLIENT_SECRET`
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
- Authentication: Add header:
  - `X-Client-Id: CLIENT_ID`
  - `X-Client-Secret: CLIENT_SECRET`
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

#### Get tournament info

- Path: `/api/v/1/game_sdk/tournaments/:tournamentId`
- Method: `GET`
- Authentication: Add header
  - `X-Client-Id: CLIENT_ID`
  - `X-Client-Secret: CLIENT_SECRET`
- Data: `JSON`: View type `Tournament` in `sdk.d.ts`

## Development

```sh
$ yarn
$ yarn dev
```

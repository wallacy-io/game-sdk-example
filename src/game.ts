import MockSDK from './mock_sdk';

const app = () => ({
  player: {},
  gameplay: {} as any,
  tournament: {},
  items: [] as InGameItem[],
  async init() {
    WallacyGameSDK.init({
      clientId: 'fake-client',
    });

    this.player = await WallacyGameSDK.getPlayer();
    this.tournament = (await WallacyGameSDK.getTournament()) || {};
    const itemData = await WallacyGameSDK.getInGameItems().catch();
    this.items = itemData.items || [];
  },
  async play() {
    // Game client should call game API to init new gameplay and get gameplayId;
    const gameplayId = 'gameplay1';

    const { token } = await WallacyGameSDK.play();
    this.gameplay = {
      id: gameplayId,
      score: 0,
      token,
    };
  },
  newScore(score: number) {
    WallacyGameSDK.triggerHapticFeedback('impactLight');
    this.gameplay.score = score;
    WallacyGameSDK.trackScore(this.gameplay.id, this.gameplay.score);
  },
  async gameover() {
    const signature = await WallacyGameSDK.signResult(
      'gameplay-1',
      this.gameplay.token,
      this.gameplay.score,
    );

    // After sign result, game client should send signature & game token to game server.
    // Game server should call S2S API to send score to Wallacy.
    console.log('game client should send this data to game server', {
      signature,
      token: this.gameplay.token,
      score: this.gameplay.score,
    });

    this.gameplay = {};
  },
  getSDKVersion() {
    return WallacyGameSDK.getVersion();
  },
  reload() {
    location.reload();
  },
  openShop() {
    WallacyGameSDK.showShop();
  },
  openLeaderboard() {
    WallacyGameSDK.showLeaderboard();
  },
});

Object.assign(window, { app });

if (!window.WallacyGameSDK) {
  Object.assign(window, { WallacyGameSDK: MockSDK });
}

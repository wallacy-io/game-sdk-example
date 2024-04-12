let requestId = 0;

const sdk = {
  async init(params: SDKInitParams) {
    return await this.dispatch<{ currentTimestamp: string }>('INIT', params);
  },
  async getPlayer() {
    return await this.dispatch<Player>('GET_PLAYER');
  },
  async getTournament() {
    const t = await this.dispatch<Tournament>('GET_TOURNAMENT');
    if (!t.id) return;

    return t;
  },
  async buyTickets() {
    return await this.dispatch<{ balance: number; tickets: number }>('BUY_TICKET');
  },
  async play() {
    return await this.dispatch<PlayResponse>('PLAY');
  },
  async trackScore(gamePlayId: string, score: number) {
    return await this.dispatch<void>('TRACK_SCORE', { gamePlayId, score });
  },
  async signResult(gamePlayId: string, gameToken: string, score: number) {
    return await this.dispatch<string>('SIGN_RESULT', { gamePlayId, gameToken, score });
  },
  async showLeaderboard() {
    return await this.dispatch<void>('SHOW_LEADERBOARD');
  },
  async showShop() {
    return await this.dispatch<void>('SHOW_SHOP');
  },
  async getLeaderboard(req: GetLeaderboardRequest) {
    return await this.dispatch<GetLeaderboardResponse>('GET_LEADERBOARD', req);
  },
  async getInGameItems() {
    return await this.dispatch<{ items: InGameItem[] }>('GET_INGAME_ITEMS');
  },
  async buyInGameItem(itemId: string, gameplayId?: string) {
    return await this.dispatch<BuyInGameItemResponse>('BUY_INGAME_ITEM', {
      itemId,
      gameplayId,
    });
  },
  async exit(confirm = true) {
    return await this.dispatch<void>('EXIT', confirm);
  },
  async exitToListGames(confirm = true) {
    return await this.dispatch<void>('EXIT_TO_LIST_GAMES', confirm);
  },
  getVersion() {
    return 'v1';
  },
  async triggerHapticFeedback(type: HapticFeedbackType) {
    await this.dispatch('TRIGGER_HAPTIC_FEEDBACK', type);
  },
  async useInGameItem(itemId: string, gamePlayId?: string) {
    return await this.dispatch<UseInGameItemResponse>('USE_INGAME_ITEM', { itemId, gamePlayId });
  },

  requests: {} as Record<number, { resolve: (data: any) => any; reject: (reason: string) => any }>,
  async dispatch<T>(action: string, data?: any, timeout = 60): Promise<T> {
    return new Promise((resolve, reject) => {
      requestId++;
      if (timeout) {
        setTimeout(() => {
          reject('timeout');
          delete this.requests[requestId];
        }, timeout * 1000);
      }

      this.requests[requestId] = { resolve, reject };
      const msg = { source: 'game-sdk', requestId, action, data };
      // console.log('SDK.dispatch', msg);
      window.parent.postMessage(msg);
    });
  },
  onMessage(event: MessageEvent) {
    if (typeof event.data !== 'object') return;

    const { requestId, ...payload } = event.data;
    if (!this.requests[requestId]) return;

    // console.log('SDK.onMesasge', event.data);
    const { resolve, reject } = this.requests[requestId]!;
    if (payload.error) {
      const err: any = new Error(payload.error);
      err.code = payload.code;
      reject(err);
    } else {
      resolve(payload?._payload || payload);
    }
    delete this.requests[requestId];
  },
};

window.addEventListener('message', sdk.onMessage.bind(sdk));
window.WallacyGameSDK = sdk;

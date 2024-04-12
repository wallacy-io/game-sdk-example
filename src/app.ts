import { camelCase } from 'lodash';
import z from 'zod';

const app = {
  viewport: document.getElementById('game-viewport') as HTMLIFrameElement | null,
  start() {
    window.addEventListener('message', this._onMessage.bind(this));
  },

  onInit(params: SDKInitParams) {
    // TODO: implement later

    console.log('init', params);
  },
  onGetPlayer() {
    // TODO: implement later

    const player: Player = {
      id: 'p1',
      balance: 100,
      name: 'Player 1',
      avatar: 'https://thispersondoesnotexist.com/',
      level: 10,
      inventory: [],
    };

    return player;
  },
  onGetTournament() {
    // TODO: implement later

    const tour: Tournament = {
      id: 'tour1',
      name: 'tour1',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      entryFee: 0,
      entryTickets: 10,
      prizePool: {
        total: 0,
      },
      tickets: 10,
      totalPlayers: 100,
    };

    return tour;
  },
  onGetIngameItems() {
    const items: InGameItem[] = [];

    return { items };
  },
  onPlay() {
    // TODO: implement later
    const res: PlayResponse = {
      token: 'abcxyz',
      remainingTickets: 9,
    };

    return res;
  },
  onTrackScore(gameplayId: string, score: number) {
    console.log('track score', gameplayId, score);
  },
  onBuyTickets() {
    throw new Error('not supported');
  },
  onBuyInGameItem(itemId: string, gameplayId?: string) {
    console.log('buy item', itemId, gameplayId);

    const res: BuyInGameItemResponse = {
      receipt: 'xxx',
      item: {
        id: 'item1',
        name: 'Booster',
        price: 10,
      },
    };

    return res;
  },
  onUseInGameItem(itemId: string, gameplayId?: string) {
    console.log('use item', itemId, gameplayId);

    const res: UseInGameItemResponse = {
      success: true,
      inventory: [],
    };

    return res;
  },
  onTriggerHapticFeedback(type: HapticFeedbackType) {
    // TODO: implement later
  },
  onSignResult(gamePlayId: string, gameToken: string, score: number) {
    console.log('sign result', gamePlayId, gameToken, score);

    const sig = 'abc123';

    return sig;
  },
  onShowLeaderboard() {
    console.log('show leaderboard');
  },
  onShowShop() {
    console.log('open shop');
  },
  onGetLeaderboard(req: GetLeaderboardRequest) {
    const res: GetLeaderboardResponse = {
      players: [],
    };

    return res;
  },
  onExit() {
    console.log('exit');
  },
  onExitToListGames() {
    console.log('exit to list games');
  },

  async _onMessage(event: MessageEvent) {
    const schema = z.object({
      source: z.enum(['game-sdk']),
      action: z.string().min(1),
      data: z.any(),
      requestId: z.number(),
    });

    const result = schema.safeParse(event.data);
    if (!result.success) return;

    const { data, action, requestId } = result.data;
    let res;
    try {
      const handleMethod = camelCase('on_' + action);
      const handler = (this as any)[handleMethod];

      if (!handler || typeof handler !== 'function') {
        throw newError(
          `missing handle func ${handleMethod} for action ${action}`,
          errorCodes.SystemError,
        );
      }

      res = await handler.call(this, data);
    } catch (e) {
      res = { error: `${e}`, code: (e as any)?.code || -1 };
      console.error('handle err', e);
    }

    // console.log('send response', this.viewport, requestId, res);
    this.viewport?.contentWindow?.postMessage(
      {
        ...(res || { _payload: undefined }),
        requestId: requestId,
      },
      '*',
    );
  },
};

function newError(msg: string, code?: ErrorCode) {
  const err = new Error(msg);
  err.code = code;

  return err;
}

app.start();

const errorCodes = {
  SystemError: -1, // something went wrong
  InvalidRequest: 10,
  TourNotAvailable: 100, // tournament has ended or disabled
  NotEnoughGEM: 110, // no enought GEM to buy tickets or items
  InvalidScore: 120, // score was not accepted (cheat detected)
  UserReject: 130, // User reject transaction (buy tickets or items)
  NotEnoughTicket: 140, // Not enough ticket to play game
};

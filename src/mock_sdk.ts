const MockSDK: GameSDK = {
  init({ clientId }) {
    console.log('SDK initialized: ', clientId);
  },
  async getPlayer() {
    return Promise.resolve({
      id: 'player1',
      avatar:
        'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/b4/b4c90e60fb1c0fab00d338028cd158d42f33b9d0_full.jpg',
      name: 'Faker',
      balance: 100,
    });
  },
  async getTournament() {
    return Promise.resolve({
      id: 'tour1',
      name: 'Tour 1',
      tickets: 10,
      startTime: '2022-10-18T08:24:41.870Z',
      endTime: '2022-12-18T08:24:41.870Z',
      totalPlayers: 10,
      prizePool: {
        total: 1000,
        distribution: {
          1: { value: 500 },
          2: { value: 300 },
          3: { value: 200 },
        },
      },
    });
  },
  async play() {
    console.log('SDK: ticket - 1');
    return Promise.resolve({ token: 'game-token-1', remainingTickets: 0 });
  },
  async showLeaderboard() {
    console.log('SDK: Showing leaderboard');
  },
  async showShop() {
    console.log('SDK: Showing shop, user can buy ticket here.');
  },
  async getInGameItems() {
    return Promise.resolve({ items: [] });
  },
  async buyInGameItem(id: string, gameplayId?: string) {
    return Promise.resolve({
      status: 'SUCCESS',
      errorCode: 0,
      message: '',
      receipt: 'xxx',
      item: {
        id,
        name: 'item 1',
        price: 99,
      },
    });
  },
  async getLeaderboard(req) {
    return Promise.resolve({
      players: [],
    });
  },
  async signResult(id, token, score) {
    console.log('SDK: signing result', id, token, score);

    return Promise.resolve('fake-signature');
  },
  getVersion() {
    return '0.1-mock';
  },
  exit() {},
};

export default MockSDK;

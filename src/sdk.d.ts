interface GameSDK {
  /** SDK must be initialized first */
  init(params: SDKInitParams): Promise<{
    // ISO8601 date string
    currentTimestamp: string;
  }>;
  getPlayer(): Promise<Player>;
  /** Return current tournament, null = practice mode */
  getTournament(): Promise<Tournament | null>;
  buyTickets(): Promise<{ balance: number; tickets: number }>;
  /** Call play will cost player 1 ticket and return a token to submit score */
  play(): Promise<PlayResponse>;
  /** Sign game play result and return signature to submit score */
  signResult(gamePlayId: string, gameToken: string, score: number): Promise<string>;
  showLeaderboard(): Promise<void>;
  showShop(): Promise<void>;
  getLeaderboard(req: GetLeaderboardRequest): Promise<GetLeaderboardResponse>;
  getInGameItems(): Promise<{ items: InGameItem[] }>;
  buyInGameItem(itemId: string, gameplayId?: string): Promise<BuyInGameItemResponse>;
  /** quit game, close webview */
  exit();
  getVersion(): string;
}

declare var WallacyGameSDK: GameSDK;

interface Player {
  id: string;
  name: string;
  /** Image URL */
  avatar?: string;
  /** total GEM of user */
  balance: number;
}

interface Tournament {
  id: string;
  name: string;
  /** ISO 8601 timestamp */
  startTime: string;
  /** ISO 8601 timestamp */
  endTime: string;
  /** total tickets of current player */
  tickets: number;
  totalPlayers: number;
  entryFee: number;
  entryTickets: number;
  prizePool: {
    /** total gem of prize pool at current timestamp */
    total: number;
    /** rank => prize value */
    distribution: Record<number, { value: number; percent?: number }>;
  };
}

interface InGameItem {
  id: string;
  name: string;
  price: number;
}

interface SDKInitParams {
  /** default to latest version */
  version?: string;
  clientId: string;
}

interface GetLeaderboardRequest {
  limit: number;
  after: string;
  before: string;
}

type LeaderboardItem = Player & { rank: number; score: number };

interface GetLeaderboardResponse {
  players: LeaderboardItem[];
  me?: LeaderboardItem;
}
interface BuyInGameItemResponse {
  status: 'SUCCESS' | 'FAILED' | 'CANCELED';
  errorCode: number;
  message: string;
  receipt?: string;
  item: InGameItem;
}

interface PlayResponse {
  /** One time token, use to submit score */
  token: string;
  remainingTickets: number;
}

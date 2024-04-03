interface GameSDK {
  /** SDK must be initialized first */
  init(params: SDKInitParams): Promise<{
    // ISO8601 date string
    currentTimestamp: string;
  }>;
  getPlayer(): Promise<Player>;
  /** Return current tournament, undefined = practice mode */
  getTournament(): Promise<Tournament | undefined>;
  buyTickets(): Promise<{ balance: number; tickets: number }>;
  /** Call play will cost player 1 ticket and return a token to submit score */
  play(): Promise<PlayResponse>;
  /** Call every time player's score change */
  trackScore(gamePlayId: string, score: number): Promise<void>;
  /** Sign game play result and return signature to submit score */
  signResult(gamePlayId: string, gameToken: string, score: number): Promise<string>;
  showLeaderboard(): Promise<void>;
  showShop(): Promise<void>;
  getLeaderboard(req: GetLeaderboardRequest): Promise<GetLeaderboardResponse>;
  getInGameItems(): Promise<{ items: InGameItem[] }>;
  buyInGameItem(itemId: string, gameplayId?: string): Promise<BuyInGameItemResponse>;
  /** quit game, close webview */
  exit(confirm: boolean = true);
  /** quit game and back to list games **/
  exitToListGames(confirm: boolean = true);
  triggerHapticFeedback(type: HapticFeedbackType): Promise<void>;
  getVersion(): string;
}

declare var WallacyGameSDK: GameSDK;

interface Player {
  id: string;
  name: string;
  level?: number;
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
  receipt: string;
  item: InGameItem;
}

interface PlayResponse {
  /** One time token, use to submit score */
  token: string;
  remainingTickets: number;
}

interface Error {
  code?: number;
}

type HapticFeedbackType =
  | 'impactLight'
  | 'impactMedium'
  | 'impactHeavy'
  | 'impactRigid'
  | 'impactSoft'
  | 'notiSuccess'
  | 'notiWarning'
  | 'notiError';

enum ErrorCode {
  SystemError = -1, // something went wrong
  InvalidRequest = 10,
  TourNotAvailable = 100, // tournament has ended or disabled
  NotEnoughGEM = 110, // no enought GEM to buy tickets or items
  InvalidScore = 120, // score was not accepted (cheat detected)
  UserReject = 130, // User reject transaction (buy tickets or items)
  NotEnoughTicket = 140, // Not enough ticket to play game
}

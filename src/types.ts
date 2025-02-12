enum PlayerAction {
  HIT = 'hit',
  STAND = 'stand',
}
enum GameState {
  PLAYER_WIN = 'PLAYER_WIN',
  DEALER_WIN = 'DEALER_WIN',
  TIE = 'TIE',
  DEALER_CONTINUE = 'DEALER_CONTINUE',
  DEALER_LOSE = 'DEALER_LOSE',
}
type RoundStates = {
  cardIndex: number;
  gameRound: number;
  shuffledCards: string[];
  playerHand: string[];
  dealerHand: string[];
};
type CardsInHand = {
  playerHand: string[];
  dealerHand: string[];
};

export { PlayerAction, GameState, RoundStates, CardsInHand };

import PromptSync from 'prompt-sync';
import { cards } from '../card';
import { GameState, RoundStates } from '../types';

const prompt = PromptSync();

function sliceCard(card: string): string {
  return card.slice(0, -1);
}

function shuffleArray(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function checkGame(playerFunds: number): boolean {
  if (playerFunds === 0) {
    console.log('Game over. You have no funds left.');
    return true;
  }
  return false;
}

function getPlayerBet(playerFunds: number, Num: string): number {
  console.log(Num);
  console.log(`Player's funds: $${playerFunds}`);
  let bet: number = Number(prompt('Enter your bet: $'));
  while (isNaN(bet) || bet <= 0 || bet > playerFunds) {
    console.log(
      isNaN(bet)
        ? 'Invalid bet. Please enter a number.'
        : bet <= 0
        ? 'Bet must be greater than zero.'
        : `Insufficient funds. Please enter a lower bet than ${playerFunds}.`
    );
    bet = Number(prompt('Enter your bet: $'));
  }
  return bet;
}

function checkBlackJack(cardsInHand: string[]): boolean {
  const card1: string = sliceCard(cardsInHand[0]);
  const card2: string = sliceCard(cardsInHand[1]);
  const isBlackJack: boolean =
    (card1 === 'A' && calculateHandValue([card2]) === 10) ||
    (card2 === 'A' && calculateHandValue([card1]) === 10);
  return isBlackJack;
}
function calculateHandValue(cardsInHand: string[]): number {
  let cardsTotal: number = 0;
  for (let card of cardsInHand) {
    const cardValue: string = sliceCard(card);
    if (Number.isNaN(Number(cardValue))) {
      if (['J', 'K', 'Q'].includes(cardValue)) {
        cardsTotal += 10;
      } else {
        const remaining: number = 21 - cardsTotal;
        remaining >= 11 ? (cardsTotal += 11) : (cardsTotal += remaining);
      }
    } else {
      cardsTotal += Number(cardValue);
    }
  }
  return cardsTotal;
}

function checkPlayerBust(playerCards: string[], dealerCards: string[]) {
  let playerTotal: number = calculateHandValue(playerCards);
  let dealerTotal: number = calculateHandValue(dealerCards);
  if (playerTotal > 21) {
    console.log(`Your hand: ${playerCards} (Total: ${playerTotal} - Bust!)`);
    console.log(`Dealer's hand: ${dealerCards} (Total: ${dealerTotal})`);
    return true;
  } else {
    return false;
  }
}

function resolveDealerTurn(
  playerCards: string[],
  dealerCards: string[]
): GameState {
  let playerTotal: number = calculateHandValue(playerCards);
  let dealerTotal: number = calculateHandValue(dealerCards);
  console.log(`Dealer's hand: ${dealerCards} (Total: ${dealerTotal})`);
  if (dealerTotal > 21) {
    console.log(`Dealer bust (total: ${dealerTotal})`);
    return GameState.DEALER_LOSE;
  }
  if (dealerTotal >= 17) {
    if (playerTotal > dealerTotal) {
      return GameState.PLAYER_WIN;
    } else if (playerTotal < dealerTotal) {
      return GameState.DEALER_WIN;
    } else {
      return GameState.TIE;
    }
  } else {
    return GameState.DEALER_CONTINUE;
  }
}

function initializeNewRound(state: RoundStates) {
  let { cardIndex, gameRound, shuffledCards, playerHand, dealerHand } = state;
  if (cardIndex >= shuffledCards.length - 10) {
    shuffledCards = shuffleArray(cards);
    cardIndex = 0;
  }
  gameRound = 0;
  playerHand.length = 0;
  playerHand.push(shuffledCards[cardIndex++], shuffledCards[cardIndex++]);
  dealerHand.length = 0;
  dealerHand.push(shuffledCards[cardIndex++], shuffledCards[cardIndex++]);
  return {
    cardIndex,
    gameRound,
    playerHand,
    dealerHand,
  };
}
function getPlayerMovement(): string {
  let movement = prompt('Your action (hit/stand): ').toLowerCase().trim();
  while (!['hit', 'stand'].includes(movement)) {
    console.log('Invalid move. Enter "hit" or "stand".');
    movement = prompt('Your action (hit/stand): ').toLowerCase().trim();
  }
  return movement;
}
function checkWinner(
  state: { playerFunds: number },
  bet: number,
  gameState: GameState
) {
  switch (gameState) {
    case GameState.PLAYER_WIN:
    case GameState.DEALER_LOSE:
      state.playerFunds += bet;
      console.log(`You win ${bet}`);
      break;
    case GameState.DEALER_WIN:
      state.playerFunds -= bet;
      console.log(`Dealer wins. You lost ${bet}`);
      break;
    case GameState.TIE:
      console.log("It's push! Your bet is returned");
      break;
  }
  return state.playerFunds;
}

export {
  checkBlackJack,
  shuffleArray,
  getPlayerBet,
  checkGame,
  calculateHandValue,
  checkPlayerBust,
  resolveDealerTurn,
  initializeNewRound,
  getPlayerMovement,
  checkWinner,
};

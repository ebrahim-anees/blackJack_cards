import blackJack from '../functions/blackJack';
import { cards } from './card';
import {
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
} from './utils';
import { PlayerAction } from './types';

let shuffledCards: string[] = shuffleArray(cards);
let cardIndex = 0;
let gameRound = 0;
let playerHand: string[] = [];
let dealerHand: string[] = [];
let isPlayerTurn = true;
let playerFunds = 100;
let bet = 0;

playerHand.push(shuffledCards[cardIndex++], shuffledCards[cardIndex++]);
dealerHand.push(shuffledCards[cardIndex++], shuffledCards[cardIndex++]);
const startGame = () => {
  while (isPlayerTurn) {
    if (checkGame(playerFunds)) break;
    if (gameRound === 0) bet = getPlayerBet(playerFunds, '1');
    gameRound++;
    if (
      gameRound === 1 &&
      (checkBlackJack(playerHand) || checkBlackJack(dealerHand))
    ) {
      blackJack(playerHand, dealerHand, playerFunds, bet);
      ({ cardIndex, gameRound, playerHand, dealerHand } = initializeNewRound({
        cardIndex,
        gameRound,
        shuffledCards,
        playerHand,
        dealerHand,
      }));
      if (checkGame(playerFunds)) break;
      bet = getPlayerBet(playerFunds, '2');
    } else {
      console.log(
        `Your hand: ${playerHand} (Total: ${calculateHandValue(playerHand)})`
      );
      gameRound === 1
        ? console.log(`Dealer's hand: ${dealerHand[0]}, [hidden]`)
        : null;
      const playerMovement = getPlayerMovement();
      if (playerMovement === PlayerAction.HIT) {
        playerHand.push(shuffledCards[cardIndex++]);
        if (checkPlayerBust(playerHand, dealerHand)) {
          console.log(`You bust and lost $${bet}`);
          playerFunds -= bet;
          ({ cardIndex, gameRound, playerHand, dealerHand } =
            initializeNewRound({
              cardIndex,
              gameRound,
              shuffledCards,
              playerHand,
              dealerHand,
            }));
          if (checkGame(playerFunds)) break;
        }
      } else if (playerMovement === PlayerAction.STAND) {
        isPlayerTurn = false;
        handleDealerTurn();
      } else {
        console.log('Invalid move');
      }
    }
  }
};
const handleDealerTurn = () => {
  let state = resolveDealerTurn(playerHand, dealerHand);
  while (state === 'DEALER_CONTINUE') {
    dealerHand.push(shuffledCards[cardIndex++]);
    state = resolveDealerTurn(playerHand, dealerHand);
  }
  playerFunds = checkWinner({ playerFunds }, bet, state);
  ({ cardIndex, gameRound, playerHand, dealerHand } = initializeNewRound({
    cardIndex,
    gameRound,
    shuffledCards,
    playerHand,
    dealerHand,
  }));

  isPlayerTurn = true;
  if (!checkGame(playerFunds)) startGame();
};
startGame();

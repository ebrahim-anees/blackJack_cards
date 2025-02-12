import { checkBlackJack, calculateHandValue } from '../src/utils';
const blackJack = (
  playerHand: string[],
  dealerHand: string[],
  playerFunds: number,
  bet: number
) => {
  if (checkBlackJack(playerHand)) {
    console.log(`Your hand: ${playerHand} (Blackjack!)`);
    console.log(`Dealer's hand: ${dealerHand[0]}, [hidden]`);
    const betWon = Math.round((bet / 3) * 2);
    console.log(`You win $${betWon}! (3:2 payout for Blackjack)`);
    playerFunds += betWon;
  } else if (checkBlackJack(dealerHand)) {
    console.log(
      `Your hand: ${playerHand} (Total: ${calculateHandValue(playerHand)})`
    );
    console.log(`Dealer's hand: ${dealerHand[0]}, [hidden]`);
    console.log(`Dealer's reveals: ${dealerHand} (Blackjack!)`);
    console.log(`Dealer has Blackjack. You lose ${bet}`);
    playerFunds -= bet;
  }
};
export default blackJack;

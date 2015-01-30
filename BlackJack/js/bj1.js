var dealerCards = [];  // Arrays holding the DisplayCard objects used to show the cards
var playerCards = [];

dealerCards.count = 0;  // Number of cards actually in the dealer's hand
playerCards.count = 0;   // Number of cards actually in the player's hand

var deck = new Deck();

var gameInProgress = false;

var bet;
var betInput;
var money;
var moneyDisplay;
var message;

var standButton, hitButton, dealButton;  // objects representing the buttons, so I can enable/disable them

function setup() {
    for (var i = 1; i <= 5; i++) {
       dealerCards[i] = new DisplayedCard("dealer" + i);
       dealerCards[i].cardContainer.style.display = "none";
       playerCards[i] = new DisplayedCard("player" + i);
       playerCards[i].cardContainer.style.display = "none";
    }
    message = document.getElementById("message");
    standButton = document.getElementById("standButton");
    hitButton = document.getElementById("hitButton");
    newGameButton = document.getElementById("newGameButton");
    moneyDisplay = document.getElementById("money");
    money = 100;
    moneyDisplay.innerHTML = "$" + money;
    betInput = document.getElementById("bet");
    betInput.value = 10;
    betInput.disabled = false;
    standButton.disabled = true;
    hitButton.disabled = true;
    newGameButton.disabled = false;
}


function dealCard(cards, runOnFinish, faceDown) {
    var crd = deck.nextCard();
    cards.count++;
    if (faceDown)
       cards[cards.count].setFaceDown();
    else
       cards[cards.count].setFaceUp();
    cards[cards.count].setCard(crd);
    new Effect.SlideDown(cards[cards.count].cardContainer, {
       duration: 0.5,
       queue: "end",
       afterFinish: runOnFinish
    });
}

function getTotal(hand) {
   var total = 0;
   var ace = false;
   for (var i = 1; i <= hand.count; i++) {
       total += Math.min(10, hand[i].card.value); 
       if (hand[i].card.value == 1)
          ace = true;
   }
   if (total + 10 <= 21 && ace)
      total += 10;
   return total;
}

function startGame() {
   if (!gameInProgress) {
      var betText = betInput.value;
      if ( ! betText.match(/^[0-9]+$/) || betText < 1 || betText > money) {
          message.innerHTML = "Bet must be a number between 1 and " + money + 
               ".<br>Fix this problem and press New Game again.";
          new Effect.Shake("betdiv");
          return;
      }
      betInput.disabled = true;
      bet = Number(betText);
      for (var i = 1; i <= 5; i++) {
          playerCards[i].cardContainer.style.display = "none";
          playerCards[i].setFaceDown();
          dealerCards[i].cardContainer.style.display = "none";
          dealerCards[i].setFaceDown();
      }
      message.innerHTML = "Dealing Cards";
      deck.shuffle();
      dealerCards.count = 0;
      playerCards.count = 0;
      dealCard(playerCards);
      dealCard(dealerCards);
      dealCard(playerCards);
      dealCard(dealerCards, function() {
             standButton.disabled = false;
             hitButton.disabled = false;
             newGameButton.disabled = true;
             gameInProgress = true;
             var dealerTotal = getTotal(dealerCards);
             var playerTotal = getTotal(playerCards);
             if (dealerTotal == 21) {
                if (playerTotal == 21)
                    endGame(false, "You both have Blackjack, but dealer wins on ties.");
                else
                    endGame(false, "Dealer has Blackjack.");
             }
             else if (playerTotal == 21)
                endGame(true, "You have Blackjack.");
             else
                message.innerHTML = "You have " + playerTotal +".  Hit or Stand?";
          }, true);
   }
}

function endGame(win, why) {
     if (win)
         money += bet;
     else
         money -= bet;
     message.innerHTML = (win ? "Congratulations! You win.  " : "Sorry! You lose.  ") + why + 
           (money > 0 ? "<br>Click New Game to play again." : "<br>Looks like you've run out of money!");
     standButton.disabled = true;
     hitButton.disabled = true;
     newGameButton.disabled = true;
     gameInProgress = false;
     if (dealerCards[2].faceDown) {
       dealerCards[2].cardContainer.style.display = "none";
       dealerCards[2].setFaceUp();
       new Effect.SlideDown(dealerCards[2].cardContainer, { duration: 0.5, queue: "end" });
     }
     new Effect.Fade(moneyDisplay, {
        duration: 0.5,
        queue: "end",
        afterFinish: function() {
            moneyDisplay.innerHTML = "$" + money;
            new Effect.Appear(moneyDisplay, {
               duration: 0.5,
               queue: "end",
               afterFinish: function() {
                   if (money <= 0) {
                        betInput.value = "BUSTED";
                        new Effect.Shake(moneyDisplay);
                   }
                   else {
                       if (bet > money)
                          betInput.value = money;
                       standButton.disabled = true;
                       hitButton.disabled = true;
                       newGameButton.disabled = false;
                       betInput.disabled = false;
                   }
               }
            });
        }
     });
}


function dealersTurnAndEndGame() {
    message.innerHTML = "Dealer's turn...";
    dealerCards[2].cardContainer.style.display = "none";
    dealerCards[2].setFaceUp();
    var takeNextCardOrFinish = function() {
       new Effect.SlideDown(dealerCards[dealerCards.count].cardContainer, {
          duration: 0.5,
          queue: "end",
          afterFinish: function() {
              var dealerTotal = getTotal(dealerCards);
              if (dealerCards.count < 5 && dealerTotal <= 16) {
                  dealerCards.count++;
                  dealerCards[dealerCards.count].setCard(deck.nextCard());
		          dealerCards[dealerCards.count].setFaceUp();
                  takeNextCardOrFinish();
              }
              else if (dealerTotal > 21)
                 endGame(true, "Dealer has gone over 21.");
              else if (dealerCards.count == 5)
                 endGame(false, "Dealer took 5 cards without going over 21.");
              else {
                 var playerTotal = getTotal(playerCards);
                 if (playerTotal > dealerTotal)
                    endGame(true, "You have " + playerTotal + ". Dealer has " + dealerTotal + ".");
                 else if (playerTotal < dealerTotal)
                    endGame(false, "You have " + playerTotal + ". Dealer has " + dealerTotal + ".");
                 else
                    endGame(false, "You and the dealer are tied at " + playerTotal + ".");
              }
          }
       });
    };
    takeNextCardOrFinish();
}

function hit() {
   if (!gameInProgress)
      return;
   standButton.disabled = true;
   hitButton.disabled = true;
   dealCard(playerCards, function() {
      var playerTotal = getTotal(playerCards);
      if (playerTotal > 21)
         endGame(false, "YOU WENT OVER 21!");
      else if (playerCards.count == 5)
         endGame(true, "You took 5 cards without going over 21.");
      else if (playerTotal == 21)
         dealersTurnAndEndGame();
      else {
         message.innerHTML = "You have " + playerTotal + ". Hit or Stand?";
         hitButton.disabled = false;
         standButton.disabled = false;
      }
   });
}

function stand() {
   if (!gameInProgress)
      return;
   hitButton.disabled = true;
   standButton.disabled = true;
   dealersTurnAndEndGame();
}

onload=setup;


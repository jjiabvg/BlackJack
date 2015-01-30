var money = 1000;
var deck = [];
var playerHand = [];
var playerHandValue = 0;
var dealerHand = [];
var dealerHandValue = 0;
var numInDeck = 0;
var playerCardNum = 0;
var dealerCardNum = 0;
var playerScore = 0;
var dealerScore = 0;
var playerNumAces = 0;
var dealerNumAces = 0;
var betMon = 0;
var dd = false;


function card(suit, cardValue) {
    this.suit = suit;
    this.cardValue = cardValue;
    this.url = getImage(suit, cardValue);
}


function makeDeck() {
    for (var i = 0; i < 100; ++i)
        deck[i] = new card(randSuitGenerate(), randNumGenerate());
}

function getImage(suit, cardValue) {

    return "images/" + cardValue + suit + ".png";
}

function randSuitGenerate() {
    var randSuit = Math.floor((Math.random() * 4) + 1);
    if (randSuit == 1)
        return "spade";
    else if (randSuit == 2)
        return "heart";
    else if (randSuit == 3)
        return "club";
    else
        return "diamond";
}

function randNumGenerate() {
    var randNum = Math.floor((Math.random() * 13) + 1);
    if (randNum == 1)
        return "A";
    else if (randNum == 11)
        return "J";
    else if (randNum == 12)
        return "Q";
    else if (randNum == 13)
        return "K";
    else
        return randNum;
}


function givePlayerCard() {
    playerHand[playerCardNum] = deck[numInDeck];
    if (deck[numInDeck].cardValue == "A") {
        playerNumAces++;
    }
    playerCardNum++;
    numInDeck++;
    calculatePlayerScore();

}

function giveDealerCard() {
    dealerHand[dealerCardNum] = deck[numInDeck];
    if (deck[numInDeck].cardValue == "A") {
        dealerNumAces++;
    }
    dealerCardNum++;
    numInDeck++;
    calculateDealerScore();
}



function calculatePlayerScore() {
    playerHandValue = 0;

    for (var t = 0; t < playerHand.length; t++) {
        if (playerHand[t].cardValue == "J") {
            playerHandValue += 10;
        } else if (playerHand[t].cardValue == "Q") {
            playerHandValue += 10;
        } else if (playerHand[t].cardValue == "K") {
            playerHandValue += 10;
        } else if (playerHand[t].cardValue == "A") {
            playerHandValue += playerNumAces;
        } else {
            playerHandValue += parseInt(playerHand[t].cardValue);
        }
    }
    if (playerHandValue + 10 <= 21) {
        if (playerNumAces > 0) {
            playerHandValue += 10;
        }
    };
    document.getElementById('PlayerScore').value = playerHandValue;
}

function calculateDealerScore() {
    dealerHandValue = 0;
    for (var t = 0; t < dealerHand.length; t++) {
        if (dealerHand[t].cardValue == "A")
            dealerHandValue += dealerNumAces;
        else if (dealerHand[t].cardValue == "J")
            dealerHandValue += 10;
        else if (dealerHand[t].cardValue == "Q")
            dealerHandValue += 10;
        else if (dealerHand[t].cardValue == "K")
            dealerHandValue += 10;
        else
            dealerHandValue += parseInt(dealerHand[t].cardValue);
    }
    if (dealerHandValue + 10 < 21) {
        if (dealerNumAces > 0) {
            dealerNumAces += 10;
        }
    };
}

function Win() {
    money = +betMon * 2;
}

function hit() {
    calculatePlayerScore();
    if (playerHandValue > 21) {
        document.getElementById('place').value = 'You lost, bust.'
    } else {
        givePlayerCard();
        calculatePlayerScore();
        document.getElementById('doubleDown').disabled = true;

    }

}

function bett() {
    temp = document.getElementById("betAmount").value;
    if (isNaN(temp))
        document.getElementById("betAmount").value = "Enter a real number please";
    else if (temp > money) {
        document.getElementById("betAmount").value = "You cannot bet more than what you have in your wallet";
    } else if (temp == null || temp == '') {
        document.getElementById("betAmount").value = "enter money";
    } else {
        money -= parseInt(temp);
        betMon = temp;
        document.getElementById("betAmount").value = betMon;
        document.getElementById('Deal').disabled = false;
        document.getElementById('Bet').disabled = true;

    }
    document.getElementById("place").value = 'You have ' + money +' dollar';
}

function stand() {
    while (dealerHandValue < 17) {
        giveDealerCard();
        calculateDealerScore();
    }
    var dealercard = '';
    $.each(dealerHand, function(index, value) {
        if (index === 0)
            dealercard += "<img src = \'" + value.url + "\''>";
        else
            dealercard += "<img src = \'" + "images/BackVertical.png" + "\''>";
    });
    over();
    document.getElementById('Hit').disabled = true;
    document.getElementById('Stand').disabled = true;
    document.getElementById('doubleDown').disabled = true;


}

function dealCards() {
    if (playerHandValue > 21) {
        alert('bust, you loses')
        hitButton.disabled = false;
    } else {
        givePlayerCard();
        givePlayerCard();
        giveDealerCard();
        giveDealerCard();
        calculatePlayerScore();
        calculateDealerScore();
    }
    document.getElementById('Deal').disabled = true;
    document.getElementById('Hit').disabled = false;
    document.getElementById('Stand').disabled = false;
    document.getElementById('doubleDown').disabled = false;
    document.getElementById('Bet').disabled = true;


}

function doubleDown() {
    if (betMon * 2 < money) {
        betMon *= 2;
        money -= betMon;
        dd = true;
        document.getElementById("doubleDown").disabled = true;

    } else {
        document.getElementById("place").innerHTML = "Your Wallet isn't big enough to do this bruh";
        document.getElementById("doubleDown").disabled = true;

    }
}



function over() {
    document.getElementById('DealerScore').value = dealerHandValue;

    if (playerHandValue > 21) {
        document.getElementById('place').value = "bust, you lost."
        $('#dealCards').value = '';
        $('#playerCards').value = '';
        document.getElementById('Stand').disabled = true;
    } else if (dealerHandValue > 21) {
        document.getElementById('place').value = "Dealer bust, you won."
        if (dd) {
            money += betMon * 3;
        }
        money += betMon * 2;
    } else if (playerHandValue > dealerHandValue) {
        document.getElementById('place').value = "Congradulation, you won."
        if (dd) {
            money += betMon * 3;
        }
        money += betMon * 2;

    } else if (playerHandValue <= dealerHandValue) {
        document.getElementById('place').value = "Dealer won, try again."

    }
    document.getElementById("NewGame").disabled = false;

}

function newGame() {
    playerHand = [];
    playerHand.length = 0;
    playerHandValue = 0;
    dealerHand = [];
    dealerHand.length = 0;
    dealerHandValue = 0;
    numInDeck = 0;
    playerCardNum = 0;
    dealerCardNum = 0;
    playerScore = 0;
    dealerScore = 0;
    playerNumAces = 0;
    dealerNumAces = 0;
    betMon = 0; 
    document.getElementById('DealerScore').value = '';
    document.getElementById('PlayerScore').value = '';
    document.getElementById('Bet').disabled = false;
    document.getElementById("NewGame").disabled = true;
    document.getElementById("Stand").disabled = true;
    document.getElementById("doubleDown").disabled = true;






}

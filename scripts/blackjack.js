/**/
document.getElementById('testiframe').addEventListener('load', loaded);

function loaded() {
  setTimeout(function () {
    document.getElementById('loader').style.display = 'none';
    document.querySelector('.main').style.display = 'block';
  }, 1000);
}

let player = {
  cards: [],
  total: 0,
  bank: localStorage.getItem('theMONEY') || '2500',
};
let dealer = {
  cards: [],
  total: 0,
};
let drawnCards = [];
let pot = 0;

function deal() {
  player.cards = [];
  dealer.cards = [];
  player.total = 0;
  dealer.total = 0;
  drawnCards = [];
  document.getElementById('winner').innerHTML = 'result..';
  let playerCards = document.getElementById('player-cards');
  while (playerCards.firstChild) {
    playerCards.removeChild(playerCards.firstChild);
  }
  let dealerCards = document.getElementById('dealer-cards');
  while (dealerCards.firstChild) {
    dealerCards.removeChild(dealerCards.firstChild);
  }

  draw(player);
  draw(player);
  draw(dealer);
  play();
  document.getElementById('deal').style.visibility = 'hidden';
  document.getElementById('hit').style.visibility = 'visible';
  document.getElementById('stand').style.visibility = 'visible';
  document.getElementById('place').style.visibility = 'hidden';
}

function draw(person) {
  const number = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
  const suit = ['♠', '♦', '♥', '♣'];
  const randomSuit = Math.floor(Math.random() * suit.length);
  const random = Math.floor(Math.random() * number.length);
  console.log(randomSuit);
  let newCard = number[random] + ' ' + suit[randomSuit];

  drawnCards.forEach((card) => {
    if (card == newCard) {
      newCard = '';
      draw(person);
    }
  });
  if (newCard != '') {
    if (
      number[random] == 'K' ||
      number[random] == 'Q' ||
      number[random] == 'J'
    ) {
      person.total = person.total + 10;
    } else if (number[random] == 'A' && person.total < 11) {
      person.total = person.total + 11;
    } else if (number[random] == 'A' && person.total > 10) {
      person.total = person.total + 1;
    } else {
      person.total = person.total + number[random];
    }

    drawnCards.push(newCard);
    person.cards.push(newCard);
  }
}
function play() {
  player.cards.forEach((card) => {
    let div = document.createElement('div');
    div.className = 'card slide';
    div.innerHTML = card;

    let value = document.createElement('p');
    value.innerHTML = card;
    value.className = 'card-suit';
    div.appendChild(value);

    document.getElementById('player-cards').appendChild(div);
  });
  dealer.cards.forEach((card) => {
    let div = document.createElement('div');
    div.className = 'card slide';
    div.innerHTML = card;
    let value = document.createElement('p');
    value.innerHTML = card;
    value.className = 'card-suit';
    div.appendChild(value);
    document.getElementById('dealer-cards').appendChild(div);
  });
  let div = document.createElement('div');
  div.className = 'card slide';
  div.id = 'flip';
  document.getElementById('dealer-cards').appendChild(div);
  document.getElementById('coins').style.visibility = 'hidden';
  total();
  if (player.total == 21) {
    stand();
  }
}
function hit() {
  draw(player);
  let newCard = document.createElement('div');
  newCard.className = 'card slide';
  newCard.innerHTML = player.cards[player.cards.length - 1];
  let value = document.createElement('p');
  value.innerHTML = newCard.innerHTML;
  value.className = 'card-suit';

  newCard.appendChild(value);

  document.getElementById('player-cards').appendChild(newCard);
  total();
  if (player.total > 21) {
    draw(dealer);
    total();
    winner(dealer);
    document.getElementById('flip').style = 'display:none';
    let newCard = document.createElement('div');
    newCard.className = 'card slide';
    newCard.innerHTML = dealer.cards[dealer.cards.length - 1];

    let value = document.createElement('p');
    value.innerHTML = newCard.innerHTML;
    value.className = 'card-suit';

    newCard.appendChild(value);

    document.getElementById('dealer-cards').appendChild(newCard);
  }
}
function total() {
  document.getElementById('player-total').innerHTML =
    ' Your Total: ' + player.total;
  document.getElementById('dealer-total').innerHTML =
    ' Dealer Total: ' + dealer.total;
}

function stand() {
  draw(dealer);
  document.getElementById('flip').style = 'display:none';
  var card4 = document.createElement('div');
  card4.className = 'card slide mx-1';
  card4.innerHTML = dealer.cards[dealer.cards.length - 1];
  let value = document.createElement('p');
  value.innerHTML = card4.innerHTML;
  value.className = 'card-suit';

  card4.appendChild(value);
  document.getElementById('dealer-cards').appendChild(card4);
  total();
  while (player.total > dealer.total && dealer.total < 21) {
    stand();
  }

  if (dealer.total > 21) {
    winner(player);
  } else if (player.total == 21 && dealer.total != 21) {
    winner(player);
  } else if (dealer.total == 21 && player.total != 21) {
    winner(dealer);
  } else if (dealer.total == player.total) {
    winner(draw);
  } else {
    if (player.total < dealer.total) {
      winner(dealer);
    } else {
      winner(player);
    }
  }
}
function bet(amount = 'all') {
  if (amount == 'all') {
    amount = player.bank;
  }
  if (amount <= player.bank) {
    pot = pot + amount;
    player.bank = player.bank - amount;

    localStorage.setItem('theMONEY', player.bank);
    let highScores = localStorage.getItem('theMONEY');
    console.log(highScores);
    document.getElementById('bet').innerHTML = 'Bet: $' + pot;
    document.getElementById('player-bank').innerHTML =
      'Your have: $' + highScores;

    newPot();
  }
}
function winner(person) {
  switch (person) {
    case dealer:
      pot = 0;
      document.getElementById('bet').innerHTML = 'Bet: $' + pot;
      localStorage.setItem('theMONEY', player.bank);
      let highScores = localStorage.getItem('theMONEY');
      console.log(highScores);
      document.getElementById('player-bank').innerHTML =
        'Your have: $' + highScores;
      document.getElementById('winner').innerHTML = 'Dealer Wins!!!!';
      document.getElementById('place').style.visibility = 'visible';
      document.getElementById('coins').style.visibility = 'visible';
      newPot();
      break;

    case player:
      player.bank = player.bank + pot * 2;
      pot = 0;
      document.getElementById('bet').innerHTML = 'Bet: $' + pot;
      localStorage.setItem('theMONEY', player.bank);
      let highScores2 = localStorage.getItem('theMONEY');
      console.log(highScores2);
      document.getElementById('player-bank').innerHTML =
        'Your have: $' + highScores2;
      document.getElementById('winner').innerHTML = 'You Win!!!!';

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      document.getElementById('place').style.visibility = 'visible';
      document.getElementById('coins').style.visibility = 'visible';

      newPot();
      break;

    case draw:
      document.getElementById('bet').innerHTML = 'Bet: $' + pot;
      localStorage.setItem('theMONEY', player.bank);
      let highScores3 = localStorage.getItem('theMONEY');
      console.log(highScores2);
      document.getElementById('player-bank').innerHTML =
        'Your have: $' + highScores3;
      document.getElementById('winner').innerHTML = 'Draw!!!!';
      document.getElementById('place').style.visibility = 'visible';
      document.getElementById('hit').style.visibility = 'hidden';
      document.getElementById('stand').style.visibility = 'hidden';
      document.getElementById('deal').style.visibility = 'visible';
      document.getElementById('coins').style.visibility = 'visible';
      break;
  }
}

function newPot() {
  if (pot == 0) {
    document.getElementById('hit').style.visibility = 'hidden';
    document.getElementById('stand').style.visibility = 'hidden';
    document.getElementById('deal').style.visibility = 'hidden';
  } else {
    document.getElementById('deal').style.visibility = 'visible';
  }
}

function init() {
  let storedMode = sessionStorage.getItem('key');
  console.log(storedMode);
  if (!storedMode) {
    storedMode = player.bank;
    sessionStorage.setItem('key', player.bank);
  }
  newGame(storedMode);
}
init();

function newGame() {
  let mode = sessionStorage.getItem('key');
  if (mode) {
    document.getElementById('winner').innerHTML = '';
    localStorage.setItem('theMONEY', player.bank);
    let newGameLocalStorage = localStorage.getItem('theMONEY');
  
    document.getElementById('place').style.visibility = 'visible';
    let playerBet = (document.getElementById('player-bank').innerHTML =
      'Your have: $' + newGameLocalStorage);
    document.getElementById('player-bank').innerHTML =
      'Your have: $' + newGameLocalStorage;
    document.getElementById('bet').innerHTML = 'Bet: $' + pot;
    newPot();
    sessionStorage.setItem('mode', playerBet);
  }
}

function checkList(list, element) {
  let found = false;
  for (let i = 0; i < list.length(); i++) {
    if (list[i] == element) {
      found = true;
    }
  }
  return found;
}

function checkList2(list, element) {
  for (let i = 0; i < list.length(); i++) {
    if (list[i] == element) {
      return true;
    }
  }
  return false;
}


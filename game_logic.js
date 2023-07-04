'use strict';

const ranks = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['♦', '♥', '♠', '♣'];
const ranknames = ['6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
const suitnames = ['diamonds', 'hearts', 'spades', 'clubs'];

const CARD_HEIGHT = 100;

class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
    this.suitname = suitnames[suits.indexOf(suit)];
    this.rankname = ranknames[ranks.indexOf(rank)];
    this.value = this.set_value(rank);
  }

  set_value(rank) {
    let value = 0;
    if (rank === '10' || rank === 'Q' || rank === 'K') {
      value = 10;
    }
    if (rank === 'A') {
      value = 15;
    }
    if (rank === 'J') {
      value = 20;
    }
    return value;
  }

  toString() {
    return this.suit + this.rank;
  }

  set_suitname(suit) {
    this.suitname = suitnames[suits.indexOf(suit)];
  }

  set_rankname(rank) {
    this.rankname = ranknames[ranks.indexOf(rank)];
  }
}

class JsuitChooser {
  constructor() {
    this.suits = ['♦', '♥', '♠', '♣'];
    this.suit = '';
  }

  toggle() {
    this.suits.unshift(this.suits.pop());
    this.suit = this.suits[0];
  }

  toggle_to(suit) {
    while (this.suit !== suit) {
      this.toggle();
    }
    this.suit = this.suits[0];
  }

  clear_suit() {
    this.suit = '';
  }
}

const jsuitChooser = new JsuitChooser();

class EightChooser {
  constructor() {
    this.eights = ['a', 'n'];
    this.decision = '';
  }

  toggle() {
    this.eights.unshift(this.eights.pop());
    this.decision = this.eights[0];
  }

  toggle_to(dec) {
    while (this.decision !== dec) {
      this.toggle();
    }
    this.decision = this.eights[0];
  }

  clear_decision() {
    this.decision = '';
  }
}

const eightChooser = new EightChooser();

class BridgeChooser {
  constructor() {
    this.bridge = ['y', 'n'];
    this.decision = '';
  }

  toggle() {
    this.bridge.unshift(this.bridge.pop());
    this.decision = this.bridge[0];
  }

  toggle_to(dec) {
    while (this.decision !== dec) {
      this.toggle();
    }
    this.decision = this.bridge[0];
  }

  clear_decision() {
    this.decision = '';
  }
}

const bridgeChooser = new BridgeChooser();

class JpointsChooser {
  constructor() {
    this.jpoints = ['m', 'p'];
    this.decision = '';
  }

  toggle() {
    this.jpoints.unshift(this.jpoints.pop());
    this.decision = this.jpoints[0];
  }

  toggle_to(dec) {
    while (this.decision !== dec) {
      this.toggle();
    }
    this.decision = this.jpoints[0];
  }

  clear_decision() {
    this.decision = '';
  }
}

const jpointsChooser = new JpointsChooser();

class RoundChooser {
  constructor() {
    this.round = ['n', 'c'];
    this.decision = '';
  }

  toggle() {
    this.round.unshift(this.round.pop());
    this.decision = this.round[0];
  }

  toggle_to(dec) {
    while (this.decision !== dec) {
      this.toggle();
    }
    this.decision = this.round[0];
  }

  clear_decision() {
    this.decision = '';
  }
}

const roundChooser = new RoundChooser();

class Deck {
  constructor(blind = null, stack = null) {
    if (blind === null) {
      this.blind = [];

      for (const suit of suits) {
        for (const rank of ranks) {
          const card = new Card(suit, rank);
          this.blind.push(card);
        }
      }
      this.shuffle_blind();
    } else {
      this.blind = blind;
    }

    if (stack === null) {
      this.stack = [];
    } else {
      this.stack = stack;
    }

    this.cards_played = [];
    this.bridge_monitor = [];
    this.shuffles = 1;
    this.is_visible = false;
  }

  toggle_is_visible() {
    this.is_visible = !this.is_visible;
  }

  shuffle_blind() {
    let audio = new Audio('./sounds/shuffling.mp3');
    if (is_sound_on()) {
      audio.play();
    }
    this.blind =
      (this.blind,
      this.blind
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value));
  }

  stack_as_str() {
    let stack = '';
    for (let card of this.stack) {
      stack = card.toString() + ' ' + stack;
    }
    return stack;
  }

  blind_as_str() {
    let blind = '';
    for (let card of this.blind) {
      blind = card.toString() + ' ' + blind;
    }
    return blind;
  }

  card_from_blind() {
    if (this.blind.length === 0) {
      this.blind = JSON.parse(JSON.stringify(this.stack));
      this.stack = [];
      this.stack.push(this.blind.pop());
      this.shuffle_blind();
      this.shuffles += 1;
    }
    if (this.blind.length > 0) {
      return this.blind.pop();
    }
    console.log('not enough cards available');
    process.exit();
  }

  put_card_on_stack(card) {
    jpointsChooser.clear_decision();
    bridgeChooser.clear_decision();
    eightChooser.clear_decision();
    jsuitChooser.clear_suit();

    let audio = new Audio('./sounds/put_card_on_stack.mp3');
    if (is_sound_on()) {
      audio.play();
    }

    this.stack.push(card);
    this.cards_played.push(card);
    this.update_bridge_monitor(card);

    take_snapshot();

    console.log(`${bridge.player.name} has played ${card}`);
    console.log('stack: ', this.stack_as_str());
    console.log('blind: ', this.blind_as_str());

    if (deck.bridge_monitor.length === 4) {
      bridge.ask_for_bridge();
    }

    if (
      this.get_top_card_from_stack().rank === 'J' &&
      this.cards_played.length > 0 &&
      bridge.player.hand.cards.length > 0
    ) {
      bridge.ask_for_jsuit();
    }

    if (
      deck.cards_played.length >= 2 &&
      deck.bridge_monitor.length >= 2 &&
      deck.get_top_card_from_stack().rank === '8'
    ) {
      eightChooser.toggle();
    }

    if (
      deck.get_top_card_from_stack().rank === 'J' &&
      (bridge.player.hand.cards.length === 0 ||
        deck.bridge_monitor.length === 4)
    ) {
      jpointsChooser.toggle();
    }

    if (
      bridge.player.hand.cards.length === 0 &&
      deck.get_top_card_from_stack().rank !== '6' &&
      !bridgeChooser.decision
    ) {
      roundChooser.decision = 'delay';
    }
  }

  get_top_card_from_stack() {
    if (this.stack.length > 0) {
      return this.stack[this.stack.length - 1];
    }
  }

  update_bridge_monitor(card) {
    if (
      card &&
      this.bridge_monitor.length > 0 &&
      card.rank !== this.bridge_monitor[0].rank
    ) {
      this.bridge_monitor = [];
    }
    this.bridge_monitor.push(card);
  }
}

let deck = new Deck();

class Handdeck {
  constructor(cards = null) {
    if (cards === null) {
      this.cards = [];
    } else {
      this.cards = cards;
    }
    this.cards_drawn = [];
    this.possible_cards = [];
  }

  hand_as_str() {
    let hand = '';
    for (let card of this.cards) {
      hand = card.toString() + ' ' + hand;
    }
    return hand;
  }

  count_points() {
    let points = 0;
    for (const card of this.cards) {
      points += card.value;
    }
    return points;
  }

  arrange_hand_cards(pattern = 0) {
    const patterns = [
      ['J', '9', '7', '8', '10', 'Q', 'K', 'A', '6'],
      ['J', 'A', 'K', 'Q', '10', '9', '8', '7', '6'],
      ['9', '8', '7', '6', '10', 'Q', 'K', 'A', 'J'],
    ];

    const sorted_cards = [];

    for (const rank of patterns[pattern]) {
      for (const card of this.cards) {
        if (card.rank === rank) {
          sorted_cards.push(card);
        }
      }
    }
    this.cards = sorted_cards;
  }

  get_possible_cards() {
    /*
    1st move:
    ---------
    general rule:          suit   rank     J
    if stack_card === 'J': Jsuit           J

    2nd move:
    ---------
    general rule:                 rank
    if stack_card === '6': suit     '6'
    if stack_card === 'J':          'J'
    */

    this.possible_cards = [];
    const stack_card = deck.get_top_card_from_stack();

    // # 1st move:
    if (deck.cards_played.length === 0) {
      if (stack_card.rank === 'J') {
        for (const card of this.cards) {
          if (card.suit === jsuitChooser.suit || card.rank === 'J') {
            this.possible_cards.push(card);
          }
        }
      } else {
        for (const card of this.cards) {
          if (
            card.rank === stack_card.rank ||
            card.suit === stack_card.suit ||
            card.rank === 'J'
          ) {
            this.possible_cards.push(card);
          }
        }
      }
      return this.possible_cards;
    }

    // # 2nd move
    if (deck.cards_played.length > 0) {
      if (stack_card.rank === '6') {
        for (const card of this.cards) {
          if (
            card.rank === stack_card.rank ||
            card.suit === stack_card.suit ||
            card.rank === 'J'
          ) {
            this.possible_cards.push(card);
          }
        }
      } else if (stack_card.rank === 'J') {
        for (const card of this.cards) {
          if (card.rank === 'J') {
            this.possible_cards.push(card);
          }
        }
      } else {
        for (const card of this.cards) {
          if (card.rank === stack_card.rank) {
            this.possible_cards.push(card);
          }
        }
      }
    }

    return this.possible_cards;
  }

  toggle_possible_cards() {
    if (this.possible_cards.length > 0) {
      const card = this.possible_cards.pop();
      this.cards.splice(this.cards.indexOf(card), 1);
      this.cards.unshift(card);
      this.possible_cards.unshift(card);
    }
  }

  most_suit() {
    var counts = {};

    // Count occurrences of each element
    for (var i = 0; i < this.cards.length; i++) {
      var element = this.cards[i].suit;

      if (counts[element] === undefined) {
        counts[element] = 1;
      } else {
        counts[element]++;
      }
    }

    // Convert Object to array of key/value pairs
    counts = Object.entries(counts);

    counts.sort(function (a, b) {
      return b[1] - a[1]; // Sort in descending order of counts
    });

    if (counts) {
      return counts[0][0];
    }
  }
}

class Player {
  constructor(name, is_robot, score = 0, hand_list = null) {
    this.name = name;
    this.is_robot = is_robot;
    this.score = score;
    this.hand = [];
    if (hand_list === null) {
      this.hand = new Handdeck();
    }
  }

  valueOf() {
    return this.score;
  }

  is_robot() {
    return this.is_robot;
  }

  draw_new_cards() {
    this.hand = new Handdeck();

    for (let c = 1; c <= 5; c++) {
      let card = deck.blind.pop();
      this.hand.cards.push(card);
      console.log(`${this.name} got ${card}`);
    }
  }

  draw_card_from_blind(cards = 1) {
    for (let c = 1; c <= cards; c++) {
      const card = deck.card_from_blind();
      this.hand.cards.push(card);
      this.hand.cards_drawn.push(card);
      console.log(`${this.name} has drawn ${card} from blind`);
      let audio = new Audio('./sounds/draw_card_from_blind.mp3');
      if (is_sound_on()) {
        audio.play();
      }
    }
  }

  must_draw_card() {
    /*
        must draw card, if:
        ---------------------------------
         card   possible  card    draw  next player
        played    card    drawn   card  possible
            1       1       1       N       Y
            1       1       0       N       Y
            1       0       1       N       Y
            1       0       0       N       Y
            0       1       1       N       N
            0       1       0       N       N
            0       0       1       N       Y
            0       0       0       Y       N   <-- must draw card
        '6' on stack:
        -------------
            1       0       .       Y       N   <-- must draw card
        */

    const stack_card = deck.get_top_card_from_stack();
    // played card '6' must be covered
    if (
      deck.cards_played.length > 0 &&
      stack_card.rank === '6' &&
      this.hand.possible_cards.length === 0
    ) {
      return true;
    }
    // at least one card must be played or drawn (if no possible card on hand)
    if (
      deck.cards_played.length === 0 &&
      this.hand.possible_cards.length === 0 &&
      this.hand.cards_drawn.length === 0
    ) {
      return true;
    }
    return false;
  }

  play_card(card = null) {
    if (this.is_robot) {
      this.hand.arrange_hand_cards();
    }

    if (this.hand.get_possible_cards().length > 0) {
      if (card === null) {
        card = this.hand.possible_cards.pop();
        this.hand.cards.splice(this.hand.cards.indexOf(card), 1);
        deck.put_card_on_stack(card);
      } else if (this.hand.possible_cards.includes(card)) {
        this.hand.possible_cards.splice(
          this.hand.possible_cards.indexOf(card),
          1
        );
        this.hand.cards.splice(this.hand.cards.indexOf(card), 1);
        deck.put_card_on_stack(card);
      }
    }
  }

  auto_play() {
    this.hand.arrange_hand_cards();
    do {
      if (this.must_draw_card()) {
        this.draw_card_from_blind();
      }
      while (this.hand.get_possible_cards().length > 0) {
        this.play_card();
      }
    } while (!bridge.is_next_player_possible());
  }
}
class Bridge {
  constructor(number_of_players = 3, is_robot_game = true) {
    this.number_of_players = number_of_players;
    this.is_robot_game = is_robot_game;
    this.number_of_games = 0;
    this.number_of_rounds = 0;
    this.number_of_moves = 0;
  }

  start_game() {
    console.log(`------------- Game  ${this.number_of_games}--------------`);

    this.player_list = [];

    for (let p = 1; p <= this.number_of_players; p++) {
      const player = new Player(`Player_${p}`, this.is_robot_game);
      player.score = 0;
      this.player_list.push(player);
    }

    this.player_list[0].is_robot = false;
    this.init_UI();
    this.number_of_games += 1;
    this.number_of_rounds = 0;

    this.start_round();
  }

  start_round() {
    console.log(`------------- Round ${this.number_of_rounds}--------------`);

    this.number_of_rounds += 1;
    this.number_of_moves = 0;

    deleteAllData();

    jpointsChooser.clear_decision();
    eightChooser.clear_decision();
    bridgeChooser.clear_decision();
    roundChooser.clear_decision();

    deck.bridge_monitor = [];
    deck = new Deck();

    this.player = this.shuffler();
    this.cycle_player_list_to(this.player);

    for (const player in this.player_list) {
      this.player_list[player].draw_new_cards();
    }

    const card = this.player.hand.cards.pop();
    deck.put_card_on_stack(card);
    this.play();
  }

  shuffler() {
    const tmp_player_list = this.player_list
      .slice()
      .sort((a, b) => b.score - a.score);
    return tmp_player_list[0];
  }

  cycle_player_list() {
    this.player_list.push(this.player_list.shift());
    this.player = this.player_list[0];
  }

  cycle_player_list_to(player) {
    while (this.player_list[0] !== player) {
      this.cycle_player_list();
    }
  }

  is_next_player_possible() {
    /*
        next player possible, (except 6 on stack) if:

             card   possible  card    next
            played    card    drawn   player
                1       1       1       Y
                1       1       0       Y
                1       0       1       Y
                1       0       0       Y
                0       1       1       N
                0       1       1       N
                0       1       0       N
                0       0       1       Y
                0       0       0       N       <-- must draw card
               0/1     0/1     0/1      N       <-- & when '6'
        */

    if (
      deck.get_top_card_from_stack().rank === '6' &&
      bridgeChooser.decision !== 'y'
    ) {
      return false;
    }

    if (deck.cards_played.length > 0) {
      return true;
    }

    if (deck.cards_played.length === 0) {
      if (
        this.player.hand.possible_cards.length === 0 &&
        this.player.hand.cards_drawn.length > 0
      ) {
        return true;
      }
      return false;
    }
  }

  activate_next_player() {
    let sevens = 0;
    let eights = 0;
    let aces = 0;
    let key = 'n';

    for (const card of deck.cards_played) {
      if (card.rank === '7') {
        sevens += 1;
      } else if (card.rank === '8') {
        eights += 1;
      } else if (card.rank === 'A') {
        aces += 1;
      }
    }

    if (eights >= 2) {
      key = this.ask_for_eights();
    }

    this.player.hand.cards_drawn = [];
    this.cycle_player_list();
    deck.cards_played = [];

    for (let seven = 0; seven < sevens; seven++) {
      this.player.draw_card_from_blind();
      this.player.hand.cards_drawn = [];
    }

    if (eights > 0 && key === 'n') {
      for (let eight = 0; eight < eights; eight++) {
        this.player.draw_card_from_blind(2);
        this.player.hand.cards_drawn = [];
      }
      this.cycle_player_list();
    }

    if (eights > 0 && key === 'a') {
      let leap = 1;
      while (leap <= eights) {
        if (leap % this.number_of_players !== 0) {
          this.player.draw_card_from_blind(2);
          this.player.hand.cards_drawn = [];
          this.cycle_player_list();
        } else {
          this.cycle_player_list();
          eights += 1;
        }
        leap += 1;
      }
    }

    if (aces > 0) {
      let leap = 1;
      while (leap <= aces) {
        if (leap % this.number_of_players !== 0) {
          this.cycle_player_list();
        } else {
          this.cycle_player_list();
          aces += 1;
        }
        leap += 1;
      }
    }
  }

  ask_for_jsuit() {
    jsuitChooser.toggle_to(this.player.hand.most_suit());
  }

  ask_for_eights() {
    let key;
    if (this.player.is_robot) {
      key = ['a', 'n'].sort(() => 0.5 - Math.random())[0];
      eightChooser.toggle_to(key);
      return key;
    }

    key = eightChooser.decision;
    return key;
  }

  ask_for_jpoints() {
    let key;
    if (this.player.is_robot) {
      key = ['m', 'p'].sort(() => 0.5 - Math.random())[0];
      jpointsChooser.toggle_to(key);
      return key;
    }
    key = jpointsChooser.decision;
    return key;
  }

  ask_for_bridge() {
    let key;
    if (
      this.player.hand.count_points() === 0 ||
      this.player.hand.cards.length === 0
    ) {
      key = 'y';
    } else if (this.player.hand.count_points() >= 25) {
      key = 'n';
    } else {
      key = ['y', 'n'].sort(() => 0.5 - Math.random())[0];
    }
    bridgeChooser.toggle_to(key);
    return key;
  }

  count_round() {
    if (deck.get_top_card_from_stack().rank === 'J') {
      const key = jpointsChooser.decision;

      this.player.score -=
        20 *
        Math.min(deck.cards_played.length, deck.bridge_monitor.length) *
        deck.shuffles;

      if (key === 'p') {
        for (const player of this.player_list) {
          player.score +=
            20 *
            Math.min(deck.cards_played.length, deck.bridge_monitor.length) *
            deck.shuffles;
        }
      }
    }

    this.activate_next_player();

    for (const player of this.player_list) {
      player.score += player.hand.count_points() * deck.shuffles;
      if (player.score === 125) {
        player.score = 0;
      }
    }
  }

  finish_round() {
    if (this.shuffler().score <= 125) {
      this.acknowledge_new_round();
      this.start_round();
    } else {
      this.acknowledge_new_game();
      this.start_game();
    }
  }

  acknowledge_finished_round() {
    if (!deck.is_visible) {
      deck.toggle_is_visible();
      this.updateUI();
    }
    alert(`${this.player.name} has finished this round!`);
  }

  acknowledge_bridge() {
    if (!deck.is_visible) {
      deck.toggle_is_visible();
      this.updateUI();
    }
    alert(`${this.player.name} says Bridge!`);
  }

  acknowledge_new_round() {
    alert(`${this.shuffler().name} will start next round`);
  }

  acknowledge_new_game() {
    const tmp_player_list = this.player_list
      .slice()
      .sort((a, b) => a.score - b.score);
    const winner = tmp_player_list[0].name;
    alert(`The Winner is ...\n${winner}\n+ + + G A M E  O V E R + + + `);
  }

  get_scores() {
    const tmp_player_list = this.player_list
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
    for (let player of tmp_player_list) {
      const { name, score } = player;
      console.log(`${name} score: ${score}`);
    }
  }

  init_UI() {
    let parentElement = document.querySelector('.scores');
    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.firstChild);
    }
    const scores = document.querySelector('.scores');
    for (let i = 2; i <= this.number_of_players; i++) {
      const new_p = document.createElement('p');
      new_p.className = 'score';
      new_p.id = `score_${i}`;
      new_p.innerText = `placeholder score player ${i}`;
      scores.appendChild(new_p);
    }

    parentElement = document.querySelector('.other_players');
    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.firstChild);
    }
    const other_players = document.querySelector('.other_players');
    for (let i = 2; i <= this.number_of_players; i++) {
      const new_p = document.createElement('p');
      new_p.className = 'player';
      new_p.id = `player_${i}`;
      new_p.innerText = `placeholder cards player ${i}`;
      other_players.appendChild(new_p);
    }
  }

  updateUI() {
    this.player.hand.get_possible_cards();

    const tmp_player_list = this.player_list
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));

    let shuffles = document.getElementById('shuffles');
    shuffles.textContent = `Game: ${this.number_of_games} | Round: ${this.number_of_rounds} | Shuffles: ${deck.shuffles}`;

    let parentElement;

    // Scores
    for (let i = 1; i <= tmp_player_list.length; i++) {
      let score = document.getElementById(`score_${i}`);
      score.innerHTML =
        // 'Score ' +
        tmp_player_list[i - 1].name +
        ': ' +
        '<b>' +
        tmp_player_list[i - 1].score +
        '</b>' +
        ' points';
    }

    const score_1 = document.getElementById('score_1');
    score_1.innerHTML =
      // 'Score ' +
      tmp_player_list[0].name +
      ': ' +
      '<b>' +
      tmp_player_list[0].score +
      '</b>';

    // Cards Other Players
    for (let p = 2; p <= this.number_of_players; p++) {
      parentElement = document.querySelector(`#player_${p}`);
      while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
      }

      const cards = document.getElementById(`player_${p}`);
      for (const card of tmp_player_list[p - 1].hand.cards) {
        const img = document.createElement('img');
        if (deck.is_visible) {
          img.src = `./cards/${card.rankname}_of_${card.suitname}.jpg`;
        } else {
          img.src = `./cards/backside_blue.jpg`;
        }
        if (this.player === tmp_player_list[p - 1]) {
          img.style.opacity = 1;
        } else {
          img.style.opacity = 0.6;
        }
        img.height = CARD_HEIGHT;
        cards.appendChild(img);
      }
    }

    // Bridge Monitor
    parentElement = document.querySelector('#bridge_monitor');
    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.firstChild);
    }
    const bridge_monitor = document.getElementById('bridge_monitor');
    for (const card of deck.bridge_monitor) {
      const img = document.createElement('img');
      img.src = `./cards/${card.rankname}_of_${card.suitname}.jpg`;
      img.height = CARD_HEIGHT;
      bridge_monitor.appendChild(img);
    }

    // Table (Blind & Stack)
    parentElement = document.querySelector('#table');
    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.firstChild);
    }

    const table = document.getElementById('table');
    const img = document.createElement('img');
    if (deck.blind[0]) {
      img.src = `./cards/backside_blue.jpg`;
    } else {
      img.src = `./cards/backside_grey.jpg`;
    }
    if (this.player.must_draw_card()) {
      img.src = `./cards/backside_red.jpg`;
    }
    if (this.player.name !== 'Player_1') {
      img.style.opacity = 0.6;
    }
    img.id = 'blind';
    img.height = CARD_HEIGHT * 1;
    table.appendChild(img);
    document.getElementById('blind').addEventListener('click', (event) => {
      event.preventDefault();
      bridge.play('ArrowDown');
    });

    if (roundChooser.decision) {
      const img = document.createElement('img');
      img.src = `./cards/round_${roundChooser.decision}.jpg`;
      img.id = 'round';
      img.height = CARD_HEIGHT * 1;
      table.appendChild(img);
    }

    if (bridgeChooser.decision) {
      const img = document.createElement('img');
      img.src = `./cards/bridge_${bridgeChooser.decision}.jpg`;
      img.id = 'bridge';
      img.height = CARD_HEIGHT * 1;
      table.appendChild(img);

      document.getElementById('bridge').addEventListener('click', (event) => {
        event.preventDefault();
        this.play('ArrowUp');
      });
    }

    if (eightChooser.decision) {
      const img = document.createElement('img');
      img.src = `./cards/eights_for_${eightChooser.decision}.jpg`;
      img.id = 'eights';
      img.height = CARD_HEIGHT * 1;
      table.appendChild(img);
      document.getElementById('eights').addEventListener('click', (event) => {
        event.preventDefault();
        this.play('ArrowDown');
      });
    }

    if (jpointsChooser.decision) {
      const img = document.createElement('img');
      img.src = `./cards/jpoints_${jpointsChooser.decision}.jpg`;
      img.id = 'jpoints';
      img.height = CARD_HEIGHT * 1;
      table.appendChild(img);
      document.getElementById('jpoints').addEventListener('click', (event) => {
        event.preventDefault();
        this.play('ArrowDown');
      });
    }

    if (jsuitChooser.suit) {
      const img = document.createElement('img');
      img.src = `./cards/jsuit_of_${
        suitnames[suits.indexOf(jsuitChooser.suit)]
      }.jpg`;
      img.id = 'jsuit';
      img.height = CARD_HEIGHT * 1;
      table.appendChild(img);
      document.getElementById('jsuit').addEventListener('click', (event) => {
        event.preventDefault();
        this.play('ArrowLeft');
      });
    }

    for (const card of deck.stack.slice().reverse()) {
      const img = document.createElement('img');
      img.src = `./cards/${card.rankname}_of_${card.suitname}.jpg`;
      img.height = CARD_HEIGHT * 1;
      table.appendChild(img);
    }

    // Possible Cards
    parentElement = document.querySelector('#possible_cards');
    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.firstChild);
    }
    if (!roundChooser.decision) {
      const possible_cards = document.getElementById('possible_cards');
      for (const card of this.player.hand.possible_cards) {
        const img = document.createElement('img');
        if (deck.is_visible || this.player.name === 'Player_1') {
          img.src = `./cards/${card.rankname}_of_${card.suitname}.jpg`;
        }
        if (this.player.name === 'Player_1') {
          img.style.opacity = 1;
        } else {
          img.style.opacity = 0.6;
        }
        img.height = CARD_HEIGHT;
        possible_cards.appendChild(img);
        if (this.player.name === 'Player_1') {
          img.addEventListener('click', () => {
            if (!(bridgeChooser.decision === 'y' || roundChooser.decision)) {
              this.player.play_card(card);
              this.updateUI();
            }
          });
        }
      }
    }

    // Cards Player 1
    parentElement = document.querySelector('#player_1');
    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.firstChild);
    }
    const player = document.getElementById('player_1');
    for (const card of tmp_player_list[0].hand.cards) {
      const img = document.createElement('img');
      img.src = `./cards/${card.rankname}_of_${card.suitname}.jpg`;
      if (this.player.name === 'Player_1') {
        img.style.opacity = 1;
      } else {
        img.style.opacity = 0.6;
      }
      img.height = CARD_HEIGHT * 1;
      player.appendChild(img);
      img.addEventListener('click', () => {
        if (!(bridgeChooser.decision === 'y' || roundChooser.decision)) {
          this.player.play_card(card);
          this.updateUI();
        }
      });
    }
  }

  play(key = null) {
    /*
    kb LEFT   :             | Toggle Jsuit   | Toggle Possible Cards
    kb UP     : Play Card   | Toggle Bridge
    kb DOWN   : Draw Card   | Toggle JPoints | Toggle Eights
    kb RIGHT  : Next Player | Confirm Bridge, JPoints, Eights
    */

    if (
      key === 'ArrowRight' &&
      this.player.is_robot &&
      !roundChooser.decision
    ) {
      this.player.auto_play();
      if (roundChooser.decision === 'c') {
        roundChooser.decision = 'delay';
      }
    }

    if (key === 'ArrowLeft') {
      if (jsuitChooser.suit && deck.cards_played.length > 0) {
        jsuitChooser.toggle();
      } else {
        this.player.hand.toggle_possible_cards();
      }
    } else if (key === 'ArrowUp' && !this.player.is_robot) {
      if (
        bridgeChooser.decision &&
        deck.cards_played.length > 0 &&
        !roundChooser.decision &&
        this.player.hand.cards.length > 0
      ) {
        bridgeChooser.toggle();
      } else if (!roundChooser.decision) {
        this.player.play_card();
      }
    }

    if (key === 'ArrowDown' && !this.player.is_robot) {
      if (eightChooser.decision && deck.cards_played.length > 0) {
        eightChooser.toggle();
      } else if (jpointsChooser.decision && deck.cards_played.length > 0) {
        jpointsChooser.toggle();
      } else if (this.player.must_draw_card()) {
        this.player.draw_card_from_blind();
      }
    }

    if (key === 'ArrowRight') {
      if (roundChooser.decision === 'n') {
        this.finish_round();
      } else if (roundChooser.decision === 'c') {
        this.count_round();
        roundChooser.toggle_to('n');
      } else if (roundChooser.decision === 'delay') {
        roundChooser.toggle_to('c');
      } else if (bridgeChooser.decision === 'y') {
        roundChooser.toggle_to('c');
      } else if (
        this.is_next_player_possible() &&
        !this.player.must_draw_card()
      ) {
        this.activate_next_player();
      }
    }

    // Special keys for testing
    if (key === 'v') {
      visButton.click();
    }
    if (key === 'f') {
      this.count_round();
      this.finish_round();
    }
    if (key === 's') {
      this.get_scores();
    }
    if (key === 'd') {
      this.player.hand.cards.pop();
    }
    if (key === 'r') {
      receiveLastData();
    }
    if (
      key in { 6: '6', 7: '7', 8: '8', 9: '9', j: 'j', q: 'q', k: 'k', a: 'a' }
    ) {
      this.player_list[0].hand.cards.push(
        new Card(suits[Math.floor(Math.random() * 4)], key.toUpperCase())
      );
    }

    if (roundChooser.decision !== '') {
      deck.is_visible = true;
    }

    this.updateUI();
  }
}

let bridge;

document.getElementById('new_game').addEventListener('click', (event) => {
  event.preventDefault();
  let num_2 = document.getElementById('num_2');
  let num_4 = document.getElementById('num_4');
  if (num_2.checked === true) {
    bridge = new Bridge(2, true);
    document.getElementById('num_2').checked = true;
  } else if (num_4.checked === true) {
    bridge = new Bridge(4, true);
    document.getElementById('num_4').checked = true;
  } else {
    bridge = new Bridge(3, true);
    document.getElementById('num_3').checked = true;
  }
  bridge.start_game();
});

let visButton = document.getElementById('visButton');
visButton.addEventListener('click', (event) => {
  event.preventDefault();
  deck.toggle_is_visible();
  if (deck.is_visible === false && bridge) {
    visButton.textContent = 'Show Cards of Other Players';
    bridge.updateUI();
  } else if (deck.is_visible === true && bridge) {
    visButton.textContent = 'Hide Cards of Other Players';
    bridge.updateUI();
  }
});

document.addEventListener('keydown', (event) => {
  bridge.play(event.key);
});

document.getElementById('toggle').addEventListener('click', (event) => {
  event.preventDefault();
  bridge.play('ArrowLeft');
});

document.getElementById('play').addEventListener('click', (event) => {
  event.preventDefault();
  bridge.play('ArrowUp');
});

document.getElementById('draw').addEventListener('click', (event) => {
  event.preventDefault();
  bridge.play('ArrowDown');
});

document.getElementById('next').addEventListener('click', (event) => {
  event.preventDefault();
  bridge.play('ArrowRight');
});

// Activate next Player by 'right click'
document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  bridge.play('ArrowRight');
});

document.getElementById('shuffles').addEventListener('click', (event) => {
  event.preventDefault();
});

function is_sound_on() {
  let sound = document.getElementById('sounds');
  let isChecked = sound.checked;

  if (isChecked) {
    return true;
  } else {
    return false;
  }
}

function take_snapshot() {
  sendData({
    player_list: bridge.player_list,
    cards_played: deck.cards_played,
    bridge_monitor: deck.bridge_monitor,
    blind: deck.blind,
    stack: deck.stack,
  });
}

function sendData(data) {
  fetch('http://localhost:3000/api/blobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

function receiveLastData() {
  fetch('http://localhost:3000/api/blobs')
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        const lastEntry = data[data.length - 1];

        const gameData = lastEntry; 
        console.log(gameData);

        bridge.player_list = gameData.player_list.slice();
        deck.cards_played = gameData.cards_played.slice();
        deck.bridge_monitor = gameData.bridge_monitor.slice();
        deck.blind = gameData.blind.slice();
        deck.stack = gameData.stack.slice();
        
        bridge.player = bridge.player_list[0];
        console.log('Player:', bridge.player);

        bridge.updateUI();

        deleteLastData();

      } else {
        console.log('No entries found');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function deleteLastData() {
  fetch('http://localhost:3000/api/blobs')
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 1) {
        const lastEntry = data[data.length - 1];
        const lastEntryId = lastEntry._id;

        fetch(`http://localhost:3000/api/blobs/${lastEntryId}`, {
          method: 'DELETE',
        })
          .then((response) => response.json())
          .catch((error) => {
            console.error('Error:', error);
          });
      } else {
        console.log('No entries found');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function deleteAllData() {
  fetch('http://localhost:3000/api/blobs', {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Javascript
$( document ).ready(function() {
	game.init();
});

var game = (function(){
	var Board = function(){
  	//this.value = 3;
  	this.empty = 0;
  	this.X = 1;             //player x, 1st  player according to negamax 1
  	this.O = -1;            // player o, 2nd player according to negamax -1
  	this.wins = [
	    [0,1,2],
    	[3,4,5],
    	[6,7,8],
    	[0,3,6],
    	[1,4,7],
    	[2,5,8],
    	[0,4,8],
    	[2,4,6]
    	];
  	this.gamestate = [0,0,0,0,0,0,0,0,0];
}
	Board.prototype = {
	  copy: function(){
	    var b = new Board();
	    for(var i=0; i<9; i++){
	      b.gamestate[i] = this.gamestate[i];
	    }
	    return b;
	  },
	  move: function(player, pos){
	    this.gamestate[pos] = player;
	  },
	  getMoves: function(){
	    var moves = [];
	    for(var i=0; i<9; i++){
	      if(this.gamestate[i] == this.empty){
	        moves.push(i);
	      }
	    }
	    return moves;
	  },
	  isFull: function(){
	    for(var i=0; i<9; i++){
	      if(this.gamestate[i] == this.empty){
	        return false;
	      }
	    }
	    return true;
	  },
	  getWinner: function(){
	    for(var i=0; i<this.wins.length; i++){
	      var a, b ,c;
	      a = this.gamestate[this.wins[i][0]];
	      b = this.gamestate[this.wins[i][1]];
	      c = this.gamestate[this.wins[i][2]];

	      if(a == b && a == c && a != this.empty){
	        return a;
	      }
	    }
	    return this.empty;
	  },
	  score: function(depth, player){
	    return result = player === -1 ? (11 - depth) : (depth - 11);
	  }
	}

var MiniMax = function(){
  //init values and options
  this.bestMove = 0;
  this.MAX_DEPTH = 8;
  this.loop = 0;
}

MiniMax.prototype = {
  negamax: function(b, depth, player, cb){
  	//console.log(b);
  	//console.log(depth);
  	//console.log(player);
  this.loop++;
    // functions only required when in recursion
    if ( depth > this.MAX_DEPTH ) {
    	return 0; 			// only investigate to a certain depth (horizon), when too deep, return in order to make the game fast enough
    }
	var winner = b.getWinner();
	if ( winner != b.empty ) {
		//console.log(player * board.score(depth));
		return player * b.score(depth, player);
	}

    if ( b.isFull() ){
    	//console.log('board is full');
    	return 0;					// it's a tie game, no points for either player
    }
    // end of recursion only functions

    var bestValue = -100;
    var moveList = b.getMoves();
    var moveAndValue = [];
    for(var i=0; i<moveList.length; i++){
      var boardCopy = b.copy(); //Copy current gamestate
      boardCopy.move(player, moveList[i]);
      var v = -this.negamax(boardCopy, depth + 1, -player)
      bestValue = Math.max( bestValue, v );

      
      if (depth == 0 ) {
      	console.log('Move: ', moveList[i], ' score: ', bestValue);
      	moveAndValue[ moveList[i] ] = bestValue;		// store the move and the value

      	bestValue = -100;
      }

    }
    // execute once all available moves have been evaluated and rated
    if ( depth == 0 ){
    	//console.log('moveAndValue: ', moveAndValue);
    	var bestMoves = [];
    	bestMoves[0] = []; 	bestMoves[1] = [];
    	// what does the function need to return after all moves have been evaluated
    	console.log('All(', this.loop, ') possibilities evaluated...');
    	
    	var copyMandV = moveAndValue.slice();
    	copyMandV.sort(function(a, b){return b-a});
    	var highV = copyMandV[0];

    	for ( var move = 0; move < moveAndValue.length; move++){
    		if ( moveAndValue[move] === highV ) bestMoves[0].push(move);
    		else if (moveAndValue[move] !== undefined ) bestMoves[1].push(move);
    	}
    	cb(bestMoves);
    }

    return bestValue;
  }
}



	var board = new Board();
	var AIPlayer = new MiniMax();
	var AI;					// true computer / false 2 players
	var player = [];		// Object: Name, Icon, Win, Draw
	var difficulty;			// 0 to 100, 100: player never wins
	var draw;
	var turn;				// which player is allowed to make a move
	var start;				// player 0 starts the game

	// private functions
	var loadBoard = function(){
		$('.board').empty();
		for (i = 0; i < 9; i++){
			$('.board').append('<div class="tile" id="' + i + '">');
		}
	}

	var checkWin = function(icon) {

		var winner = board.getWinner() != board.empty ? true : false;
		if (winner) handleWin(icon);
		else if ( board.isFull() ) handleDraw();
		else turn = turn === 0 ? 1 : 0;
	}
	
	var handleWin = function(icon){
		// Optional - add code for flashing winning line
		
		// Take care of the score part
		var won = player[0].icon === icon ? 0 : 1;
		player[won].win++;
		
		var message = player[won].name + ' you are awesome!';
		showScore(player, draw, message);
	}
	var handleDraw = function(){
		// Optional - add code for flashing winning line

		// Take care of the score part
		draw++;
		
		var message = 'Clash of the titans - we have a draw!'
		showScore(player, draw, message);
	}

	var	setGameValues = function(){
		AI = $('.pl-selected').attr('id');
		difficulty = $('#difficulty').val();
		player[0] = {}; player[1] = {};

		// load player names 
		// change icon here
		player[0].name = $('#player1').val() === '' ? 'Player1' : $('#player1').val();
		if ( $('#player2').val() === undefined ) player[1].name = 'Computer AI (' + difficulty + ')';
		else if ( $('#player2').val() === '') player[1].name = 'Player2';
		else player[1].name = $('#player2').val()

		// load player icons
		if (AI === 'true') {
			player[0].icon = $('.icon-selected').attr('id');
			player[1].icon = player[0].icon === 'x' ? 'o' : 'x';
		}
		else {
			player[0].icon = 'x';
			player[1].icon = 'o';
		}

		player[0].win = 0;
		player[1].win = 0;
		draw = 0;

		// change icon here
		if ( player[0].icon === 'x' ) player[0].icon = 1;
		player[1].icon = -player[0].icon
		if ( player[0].icon === board.O ) return 1;
		else return 0;
		//console.log(AI);
		//console.log('player:', player);
	}
	var AIMove = function(moves){
		console.log(moves);
		game.fill(moves[0][0]);
		//var copyMoveVsValue = moveVsValue;
		//copyMoveVsValue.sort( function(a, b) { return a-b } ).reverse();
		//var best = copyMoveVsValue[0];
		//console.log(copyMoveVsValue);
		//console.log(best);
		//game.fill(best);
		/*
		brainstorm on how to fix this
		move[]
		moves = {
			score 			// negamax value
			board 			// place on the board
			cat 			// one, optimal, two next, three remaining, random 1 or 2, from there  a move available
		}
		Cat one, best value
		Cat two, all remaining values

		random according to the difficulty level, cat one / cat two
			then random from the available moves.

		*/

	}
	// public functions
	return {
		init: function(){
			loadBoard();				// visually load the board
			//turn = start = 1;			// needed as next game switches players 
			
			//loadSingle();				// display single player mode menu which loads nextGame(true) on button click
    		loadMulti(); // multi-play only, replace this line with the above once single play is working
    		$('#myBox').css('height', '100%');
		},
		nextGame: function(firstTime){
			//console.log('next game');
			if ( firstTime ) {
				turn = start = setGameValues();
			} else {
				start = start === 0 ? 1 : 0;
				turn = start;					// alternate the first move between players
			}
			$('.tile').empty();
			board.gamestate =  [0,0,0,
					 			0,0,0,
					 			0,0,0];
			$('#myBox').css('height', '0%');
		},
		fill: function(pos){
			if ( board.gamestate[pos] === board.empty ){
				board.move( player[turn].icon, pos )
				// change icon here
				var icon = player[turn].icon === 1 ? 'x' : 'o';
				$('#' + pos).append('<img src="images/' + icon +'.png">');
				checkWin(player[turn].icon);
				// testing
				if ( AI && player[turn].icon === board.O ) {
					AIPlayer.negamax( board, 0, board.O, AIMove );
				}
			}
		}
	}
})();

$('body').on('click', '.tile', function(event){
	game.fill(event.currentTarget.id);
});
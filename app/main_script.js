// Javascript
$( document ).ready(function() {
	game.init(true);
	//game.play();
});

$('.play').on('click', function(){
	game.play();
});

$('body').on('click', '.tile', function(event){
	game.fill(event.currentTarget.id);
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
	  getWinner: function(saveWinPosition){
	    for(var i=0; i<this.wins.length; i++){
	      var a, b ,c;
	      a = this.gamestate[this.wins[i][0]];
	      b = this.gamestate[this.wins[i][1]];
	      c = this.gamestate[this.wins[i][2]];

	      if(a == b && a == c && a != this.empty){
	      	//console.log('saveWinPosition: ', saveWinPosition)
	      	if ( saveWinPosition ) winningRow = this.wins[i];
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
  //this.bestMove = 0;
  this.MAX_DEPTH = 8;
}

MiniMax.prototype = {
  negamax: function(b, depth, player, cb){

    // functions only required when in recursion
    if ( depth > this.MAX_DEPTH ) {
    	return 0; 			// only investigate to a certain depth (horizon), when too deep, return in order to make the game fast enough
    }
	var winner = b.getWinner(false);
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
      	//console.log('Move: ', moveList[i], ' score: ', bestValue);
      	moveAndValue[ moveList[i] ] = bestValue;		// store the move and the value

      	bestValue = -100;
      }

    }
    // execute once all available moves have been evaluated and rated
    if ( depth == 0 ){
    	var bestMoves = [];
    	bestMoves[0] = []; 	bestMoves[1] = [];
    	
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
	var turn;				// which player is allowed to make a move ( 0 = plays first, default x and then 1 = o )
	var start;				// player 0 starts the game
	var winningRow;

	// private functions
	var loadBoard = function(message){
		if ( !message ) $('.board').empty();
		for (i = 0; i < 9; i++){
			$('.board').append('<div class="tile" id="' + i + '"></div>');
		}
	}

	var checkWin = function(icon) {

		var winner = board.getWinner(true) != board.empty ? true : false;
		if (winner) handleWin(icon);
		else if ( board.isFull() ) handleDraw();
		else turn = turn === 0 ? 1 : 0;
	}
	
	var handleWin = function(icon){
		var won = player[0].icon === icon ? 0 : 1;
		// Show a flashing winning line
		var visible = true;
		var count = 0;
		var timer = window.setInterval(blink, 400);
		
		function blink() {
			if ( count < 6 ) {					// hide and display the winning row 3 times (loop 6 times)
				count++;
				var icon = player[won].icon === 1 ? 'x' : 'o';

				if (visible) {
					winningRow.forEach(function(e){
						$( '#' + e ).empty();
					})
				} else {
					winningRow.forEach(function(e){
						$( '#' + e ).append('<img src="images/' + icon +'.png">');
					})
				}
				visible = visible === true ? false : true;

			} else {			// after 3 flashes...
				clearInterval(timer); 	// stop the timer

				player[won].win++;		// increate score
				if ( AI && won === 0 ) upgradeAI();	// smarten AI
				var message = player[won].name + ' you are awesome!';
				showScore(player, draw, message); // display the score view	

			}
		}


	}
	var handleDraw = function(){
		// Take care of the score part
		draw++;
		
		var message = 'Clash of the titans - we have a draw!'
		showScore(player, draw, message);
	}

	var	setGameValues = function(){
		// loads at the start of the app or after a reset of the game
		AI = ( $('.pl-selected').attr('id') === 'true' );

		difficulty = parseInt( $('#difficulty').val() );
		player[0] = {}; player[1] = {};

		// load player names 
		// change icon here
		player[0].name = $('#player1').val() === '' ? 'Player1' : $('#player1').val();
		if ( $('#player2').val() === undefined ) player[1].name = 'AI (' + difficulty + '/100)';
		else if ( $('#player2').val() === '') player[1].name = 'Player2';
		else player[1].name = $('#player2').val()

		// load player icons
		if (AI) {
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
		player[0].icon = ( player[0].icon === 'x' ) ? player[0].icon = 1 : player[0].icon = -1;
		player[1].icon = -player[0].icon
		if ( player[0].icon === board.O ) return 1;
		else return 0;
	}
	var AIMove = function(moves){
		//console.log(moves);
		//console.log('Difficulty: ',difficulty);
		
		var optimal = rand(difficulty);				// returns 0 for optimal move and 1 for sub-optimal move
		var move = rand(moves[optimal])				// which move of the optimal or sub-optimal list should be picked
		if ( move === undefined ) move = rand(moves[0]);		// in case there are no sub-optimal moves
		//console.log('optimal: ', optimal);
		//console.log('move: ', move);
		game.fill(move);
	}
	var upgradeAI = function() {
		if ( difficulty <= 80 ) difficulty += 5;
		else difficulty += 2;
		player[1].name = 'AI (' + difficulty + '/100)';
		console.log('AI has now an intelligence of: ', difficulty);
	}
	var rand = function(choices){
		if (typeof choices === 'number'){									
			var number = Math.floor( (Math.random() * 100) )		// generate a number between 0 and 100
			return number < difficulty ? 0 : 1;						// when number < difficutly optimal move, else sub-optimal

		}
		if (typeof choices === 'object') {									// return a move from the option list
			return choices[Math.floor(Math.random() * choices.length)];
		}
	}
	// public functions
	return {
		init: function(){
			loadBoard(true);				// visually load the board
		},
		play: function(){
			loadSingle();				// display single player mode menu which loads nextGame(true) on button click
    		$('#myBox').css('height', '100%');
    		$('.play').remove();
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
			if ( AI && turn === 1 ) {
				AIMove([[0, 2, 4, 6, 8], [1, 3, 5, 7]]); // if the AI is at play, make a move, either a corner or the middle as optimal moves
			}
		},
		fill: function(pos){
			if ( board.gamestate[pos] === board.empty ){
				board.move( player[turn].icon, pos )
				// change icon here
				var icon = player[turn].icon === 1 ? 'x' : 'o';
				$('#' + pos).append('<img src="images/' + icon +'.png">');
				checkWin(player[turn].icon);
				// testing
				if ( AI && turn === 1 ) {
					AIPlayer.negamax( board, 0, board.O, AIMove );
				}
			}
		}
	}
})();
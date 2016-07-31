// Javascript
$( document ).ready(function() {
	game.init();
});

var game = (function(){
	var board = [0,0,0,
				 0,0,0,
				 0,0,0];
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
		var possWin = [	[0,1,2], [3,4,5], [6,7,8],	// horizontal win
						[0,3,6], [1,4,7], [2,5,8],	// vertical win
						[0,4,8], [2,4,6]			// diagonal win
					  ];
		var x = 0;
		var winner = false;
		while (x < possWin.length && !winner){
			if ( board[possWin[x][0]] === icon && board[possWin[x][1]] === icon && board[possWin[x][2]] === icon ) {
				winner = true;
			}
			x++;
		}
		if (winner) handleWin(icon);
		else if ( !board.includes(0) ) handleDraw();
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

		if ( player[0].icon === 'o' ) return 1;
		else return 0;
		//console.log(AI);
		//console.log('player:', player);
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
			board = [0,0,0,
					 0,0,0,
					 0,0,0];
			$('#myBox').css('height', '0%');
		},
		fill: function(pos){
			if ( board[pos] === 0 ){
				board[pos] = player[turn].icon;
				$('#' + pos).append('<img src="images/' + player[turn].icon +'.png">');
				checkWin(player[turn].icon);
			}
		}
	}
})();

$('body').on('click', '.tile', function(event){
	game.fill(event.currentTarget.id);
});
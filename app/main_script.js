// Javascript
$( document ).ready(function() {
	game.init();
	//showBox();
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
	var start = 0;				// player 0 starts the game
	// private functions
	var reset = function(){
		//console.log('reset game');
		$('.tile').empty();
		board = [0,0,0,
				 0,0,0,
				 0,0,0];
		start = start === 0 ? 1 : 0;
		turn = start					// alternate the first move between players
	}

	var loadBoard = function(){
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
		// add code for flashing winning line
		var won = player[0].icon === icon ? 0 : 1;
		alert (player[won].name + ' you are awesome!!!');
		
		// Take care of the score part
		player[won].win++;
		updateScore();
		reset();
	}
	var handleDraw = function(){
		alert('Clash of the titans - we have a draw!');
		draw++;
		updateScore();
		reset();
	}

	var updateScore = function(){
		console.log(player[0].name + ': ' + player[0].win);
		console.log(player[1].name + ': ' + player[1].win);
		console.log('Draw: ',draw);
	}

	// public functions
	return {
		helper: function(){		// function used to trigger / test inner functions
			reset();
		},
		init: function(){
			loadBoard();
			//game.loadGamePlay();
			start = 1;			// needed as reset switches players 
			reset();
		},
		setGameValues: function(){
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

			console.log(AI);
			console.log(player);
		},
		fill: function(tile){
			var pos = tile.currentTarget.id;
			if ( board[pos] === 0 ){
				board[pos] = player[turn].icon;
				$('#' + pos).append('<img src="images/' + player[turn].icon +'.png">');
				checkWin(player[turn].icon);
			}
		}
	}
})();

$('body').on('click', '.tile', function(event){
	game.fill(event);
});

function showBox() {
    loadSingle();
    $('#myBox').css('height', '100%');
}

function start() {
    game.setGameValues();
    $('#myBox').css('height', '0%');
}

/*
var grabSettings = function() {
	var AI = $('.pl-selected').attr('id');
	var player = []; player[0] = {}; player[1] = {};
	var difficulty = $('#difficulty').val();

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

	console.log(AI);
	console.log(player);
}
*/
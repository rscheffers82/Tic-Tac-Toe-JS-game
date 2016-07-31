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
	var difficulty = 95;	// 0 to 100, 100: player never wins
	var draw = 0;
	var turn;				// which player is allowed to make a move
	var start;				// player 0 starts the game
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

	var loadPlayers = function(){
		player[0] = {
			name: 'Tic Tac Toe King Royko',
			icon: 'x',
			win: 0
		}
		player[1] = {
			//name: 'IA (' + difficulty + ')',
			name: 'Zorana Queen Quick-thinker',
			icon: 'o',
			win: 0
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
			loadPlayers();
			start = 1;			// needed as reset switches players 
			reset();
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


var loadSingle = function(){
    $('.overlaybox-caption').empty();
    $('.overlaybox-content').empty();
    var title = '<span class="pl pl-selected" id="true">Single-player</span> | <span class="pl" id="false">Multi-player</span>';
    var content = '<p>Player: <i class="note">(optional)</i> <input type="text"></p>' +
        '<p>' +
            '<img class="icon icon-selected" id="x" src="images/x.png">' +
            '<img class="icon" id="o" src="images/o.png"">' +
        '</p>' +
        '<p class="note">* x starts the first game</p>' +
        '<p>Difficulty: ' +
            '<select name="difficulty">' +
                '<option value="75">HARD:   Face a butt-kicking AI</option>' +
                '<option value="50">MEDIUM: AI lets you win once in a while ;)</option>' +
                '<option value="25">EASY:   If you are lacking courage</option>' +
            '</select>' +
        '</p>' +
        '<button type="button" onclick="start()">Let\'s get started...</button>';
    $('.overlaybox-caption').append(title);
    $('.overlaybox-content').append(content);
}

var loadMulti = function(){
    $('.overlaybox-caption').empty();
    $('.overlaybox-content').empty();
	var title = '<span class="pl" id="true">Single-player</span> | <span class="pl pl-selected" id="false">Multi-player</span>';
    var content = '<div class="tab">' +
        '<div class="tr">' +
            '<div class="td"><img class="icon" id="x" src="images/x.png"></div>' +
                '<div class="td">' +
                    '<div>Player 1: </div><input type="text">' +
                    '<div class="note less-margin">* x starts the first game</div>' +
                '</div>' +
            '</div>' +

            '<div class="tr">' +
                '<div class="td"><img class="icon" id="o" src="images/o.png"">' +
                '</div>' +
                '<div class="td">' +
                    '<div>Player 2: </div><input type="text"></div>' +
            '</div>' +
        '</div>' +
        
        '<button type="button" onclick="start()">Let\'s get started...</button>';

    $('.overlaybox-caption').append(title);
    $('.overlaybox-content').append(content);
}
var showScore = function(){
    $('.overlaybox-caption').empty();
    $('.overlaybox-content').empty();

    var title = 'Score';
    var content = '<div class="summary">' +
        'Player 1 wins...' +
        '<div class="tab small">' +
           '<div class="result-players tr">' +
                '<div class="td left">Roy Scheffers:</div><div class="td right">7</div>' +
            '</div>' +
            '<div class="result-players tr">' +
                '<div class="td left">IA (easy)</div><div class="td right">2</div>' +
            '</div>' +
            '<div class="result-players tr">' +
                '<div class="td left">Draw:</div><div class="td right">15</div>' +
            '</div>' +
        '</div>' +
    '</div>' +
    '<button type="button" onclick="start()">Play again...</button>' +
    '<button type="button" onclick="start()">Exit</button>';

    $('.overlaybox-caption').append(title);
    $('.overlaybox-content').append(content);

    $('#myBox').css('height', '100%');
}

function showBox() {
    loadSingle();
    //loadMulti();
    $('#myBox').css('height', '100%');
}

function start() {
    $('#myBox').css('height', '0%');
}

$('.overlaybox-caption').on('click', '.pl', function(e){
    console.log(this.id);
    if (this.id === 'true') loadSingle();
    else if (this.id === 'false' ) loadMulti();
});

$('.overlaybox-content').on('click', '.icon' ,function(e){
    console.log(e);

    var cName = e.currentTarget.className;
    $('.' + cName).removeClass(cName + '-selected');
    $('#' + this.id).addClass(cName + '-selected');
});

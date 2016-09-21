$('.overlaybox').on('click', '.pl', function(e){
    // Single / Multi-player selection
    if (this.id === 'true') loadSingle();               // AI mode, true
    else if (this.id === 'false' ) loadMulti();         // Multi-player mode
});

$('.overlaybox').on('click', '.iconSinglePlay' ,function(e){
    // icon change function
    var cName = e.currentTarget.className;
    $('.' + cName).removeClass('icon-selected');
    $('#' + this.id).addClass('icon-selected');
});


var loadSingle = function(){
    $('.overlaybox').empty();
    
    var title = '<div class="overlaybox-caption">' +
    		'<span class="pl pl-selected" id="true">Single-player</span> | <span class="pl" id="false">Multi-player</span>' +
    	'</div>';
    
    var content = '<div class="overlaybox-content">' +
    	'<p>Player: <i class="note">(optional)</i> <input type="text" id="player1"></p>' +
        '<p>' +
            '<img class="iconSinglePlay icon-selected" id="x" src="images/x.png">' +
            '<img class="iconSinglePlay" id="o" src="images/o.png">' +
        '</p>' +
        '<p class="note">* x starts the first game</p>' +
        '<p>Difficulty: ' +
            '<select id="difficulty">' +
                '<option value="100">UNBEATABLE:        It is your destiny to loose</option>' +
                '<option value="90">HARD:               Face a butt-kicking AI</option>' +
                '<option selected value="70">MEDIUM:    AI lets you win once in a while ;)</option>' +
                '<option value="50">EASY:               If you are lacking courage</option>' +
            '</select>' +
        '</p>' +
        '<button type="button" onclick="game.nextGame(true)">Let\'s get started...</button>' + 
        '</div>';
    
    $('.overlaybox').append(title + content);
}

var loadMulti = function(){
    $('.overlaybox').empty();
    
    var title = '<div class="overlaybox-caption">' +
    		'<span class="pl" id="true">Single-player</span> | <span class="pl pl-selected" id="false">Multi-player</span>' +
    	'</div>';
    
    var content = '<div class="overlaybox-content">' +
	    '<div class="tab">' +
    	    '<div class="tr">' +
        	    '<div class="td"><img class="icon" id="x" src="images/x.png"></div>' +
            	'<div class="td">' +
                    '<div>Player 1: </div><input type="text" id="player1">' +
                   	'<div class="note less-margin">* x starts the first game</div>' +
	            '</div>' +
    	    '</div>' +

        	'<div class="tr">' +
            	'<div class="td"><img class="icon" id="o" src="images/o.png"></div>' +
	            '<div class="td">' +
    	            '<div>Player 2: </div><input type="text" id="player2">' + 
    	        '</div>' +
        	'</div>' +
        '</div>' +
        '<button type="button" onclick="game.nextGame(true)">Let\'s get started...</button>' +
    '</div>';

    $('.overlaybox').append(title + content);
}
var showScore = function(player, draw, message){
    $('.overlaybox').empty();

    var title = '<div class="overlaybox-caption">Score</div>';
    var content = '<div class="overlaybox-content">' +
    	'<div class="summary">' +
        	message +
	        '<div class="tab small">' +
    	       '<div class="result-players tr">' +
        	        '<div class="td left">' + player[0].name + '</div>' +
                    '<div class="td right">' + player[0].win + '</div>' +
            	'</div>' +
	            '<div class="result-players tr">' +
    	            '<div class="td left">' + player[1].name + '</div>' +
                    '<div class="td right">' + player[1].win + '</div>' +
        	    '</div>' +
            	'<div class="result-players tr">' +
	                '<div class="td left">Draw:</div><div class="td right">'+ draw +'</div>' +
    	        '</div>' +
        	'</div>' +
	    '</div>' +
    	'<button type="button" onclick="game.nextGame()">Play again...</button>' +
    	'<button type="button" onclick="game.init()">Reset</button>' +
    '</div>';
    $('.overlaybox').append(title + content);

    $('#myBox').css('height', '100%');
}
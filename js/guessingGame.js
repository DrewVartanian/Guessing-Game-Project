//Guesing Game Javascript
//
//By Drew Vartanian

//Generate the game and controls on document ready
$(document).ready(function(){
	game = new GameObj();

	$('.tryAgain').on('click',function(){
		game.tryAgain();
	});
	$('#guessingGameboard').on('click','#hint',function(){
		game.hint();
	});
	$('#guessingGameboard').on('keypress','#guessInput',function(event){
		game.guessCharFilter(event,this);
	});
	$('#guessingGameboard').on('keydown','#guessInput',function(event){
		game.guessInputEnter(event,this);
	});
	$('#guessingGameboard').on('submit','#guessForm',function(event){
		game.guess(event,this);
	});

});

var game;  //The game object

function GameObj(){
	this.TEMP_DESC = ['Super Hot','Hot','Warm','Cold','Ice Cold'];  //Should have 5 entries ordered from most accurate to least accurate
	this.TEMP_DIFFS = [5,10,15,25];									 //Should have 4 entries ordered from lowest to highest
	this.INPUT_RANGE = [1,100];										 //Should have 2 entries ordered from lowest to highest

	this.targetVal;			//Game's target number
	this.guessHistory;		//History of numbers guessed in the current game
	this.hintText;			//The text to be displayed when a hint is asked for;
	this.wonGame;			//Has the game been won yet?

	this.genTarget();
}

//Generates the game
GameObj.prototype.genTarget = function(){
	this.targetVal = Math.floor(Math.random()*this.INPUT_RANGE[1])+this.INPUT_RANGE[0];
	this.guessHistory = [];
	this.hintText= 'Pst! Try '+this.targetVal+'!';
	this.wonGame=false;

	$('#guessingGameboard').find('#main-text').text('Can You Guess my Number?');
	$('#guessingGameboard').find('#sub-text').text("I'm thinking of a number between 1 and 100.  You have five guesses.");
	$('#guessingGameboard').find('#gameScreen').addClass('start');
	$('#guessingGameboard').find('#fire').addClass('glyphicon glyphicon-fire fire-cold');
};

//Clears the board and generates a new game
GameObj.prototype.tryAgain = function(){
	$('#game-modal').modal('hide');
	$('#guessingGameboard').find('.jumbotron').attr({'class':'jumbotron'});
	$('#guessingGameboard').find('#fire').removeClass();
	$('#guessingGameboard').find('#guessInput').val('');
	this.genTarget();
};

//Handels the modal
GameObj.prototype.modalMessage = function(text,showTryAgain){
	if(showTryAgain){
		$('#modal-try-again').removeClass('invisible');
		$('#modal-try-again').addClass('visible');
	}else{
		$('#modal-try-again').removeClass('visible');
		$('#modal-try-again').addClass('invisible');
	}
	$('#game-modal').find('#targetHint').text(text);
	$('#game-modal').modal('show');
};

//Calls for the hint modal
GameObj.prototype.hint = function(){
	this.modalMessage(this.hintText,false);
};

//Attempts to filter input to only allow integers between 1-100
GameObj.prototype.guessCharFilter = function(event,input){

	var val;
	var valNew;

	if(event.keyCode<48 || event.keyCode>57){
		event.preventDefault();
		return;
	}

	val = +$(input).val();
	setTimeout($.proxy(function() {
    	valNew = +$(input).val();
    	if(valNew>this.INPUT_RANGE[1]){
    		if(val===0){
    			$(input).val('');
    		}
    		$(input).val(val);
    	}
    	if(valNew===0){
    		$(input).val('');
    	}
  	}, this), 1);
};

//Submits the input on enter
GameObj.prototype.guessInputEnter = function(event,input){
	if(event.keyCode===13){
		$(input).closest('form').submit();
	}
};

//Handles a winning guess
GameObj.prototype.win = function(){
	var jumbotron = $('#guessingGameboard').find('.jumbotron');
	var fire = $('#guessingGameboard').find('#fire');
	$('#guessingGameboard').find('#main-text').text('Congrats! You Win!');
	$('#guessingGameboard').find('#sub-text').text('You Figured Out I was Thinking of '+this.targetVal+'!');
	fire.removeClass();
	fire.addClass('glyphicon glyphicon-fire fire-win');
	jumbotron.removeClass();
	jumbotron.addClass('jumbotron win');
	this.wonGame=true;
};

//Handles a loosing guess
GameObj.prototype.lose = function(){
	var jumbotron = $('#guessingGameboard').find('.jumbotron');
	var fire = $('#guessingGameboard').find('#fire');
	$('#guessingGameboard').find('#main-text').text('You Lose!');
	$('#guessingGameboard').find('#sub-text').text('It was '+this.targetVal+'. Better Luck Next Time!');
	fire.removeClass();
	fire.addClass('glyphicon glyphicon-fire fire-cold');
	jumbotron.removeClass();
	jumbotron.addClass('jumbotron i-cold');
};

//Handels a wrong guess
GameObj.prototype.wrongGuess = function(value){
	var temp;
	var tempClass;
	var diff;
	var direction;
	var gameScreen = $('#guessingGameboard').find('#gameScreen');
	var fire = gameScreen.find('#fire');

	if(value<this.targetVal){
		direction = 'Higher';
	}else{
		direction = 'Lower';
	}


	diff=Math.abs(value-this.targetVal);

	if(diff<=this.TEMP_DIFFS[0]){
		temp=0;
	}else if(diff<=this.TEMP_DIFFS[1]){
		temp=1;
	}else if(diff<=this.TEMP_DIFFS[2]){
		temp=2;
	}else if(diff<=this.TEMP_DIFFS[3]){
		temp=3;
	}else{
		temp=4;
	}

	$('#guessingGameboard').find('#main-text').text('You Are '+this.TEMP_DESC[temp]+'!');
	$('#guessingGameboard').find('#sub-text').text('You Tried '+value+', Now Try '+direction+'!');
	switch (temp) {
		case 0:
		    tempClass = 's-hot';
		    break;
		case 1:
		    tempClass = 'hot';
		    break;
		case 2:
		    tempClass = 'warm';
		    break;
		case 3:
		    tempClass = 'cold';
		    break;
		default:
		    tempClass = 'i-cold';
	}

	gameScreen.removeClass();
	gameScreen.addClass('jumbotron '+tempClass);
	if(tempClass=='i-cold'){
		tempClass='cold';
	}
	fire.removeClass();
	fire.addClass('glyphicon glyphicon-fire fire-'+tempClass);

};

//Recieves and handles all guesses that are submited
GameObj.prototype.guess = function(event,form){
	var val = +$(form).find('#guessInput').val();

	if(this.wonGame){
		this.modalMessage('Congrats! Think you can do it again?',true);
		event.preventDefault();
		return;
	}

	if(this.guessHistory.length>=5){
		this.modalMessage('What to give it another shot?',true);
		event.preventDefault();
		return;
	}

	if(val > this.INPUT_RANGE[1] || val < this.INPUT_RANGE[0] || isNaN(val)){
		this.modalMessage('You might have better luck trying an integer between 1 and 100!',false);
		event.preventDefault();
		return;
	}

	if(this.guessHistory.indexOf(val)!=-1){
		this.modalMessage('You already guessed '+val+"!  Why don't you try something else?",false);
		event.preventDefault();
		return;
	}

	this.guessHistory.push(val);

	if(val==this.targetVal){
		this.win();
		event.preventDefault();
		return;
	}

	if(this.guessHistory.length===5){
		this.lose();
		event.preventDefault();
		return;
	}

	this.wrongGuess(val);

	$('#guessingGameboard').find('#guessInput').val('');

	event.preventDefault();
};
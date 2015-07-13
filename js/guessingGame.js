//Guesing Game Javascript
//
//By Drew Vartanian


//Generate the game and controls on document ready
$(document).ready(function(){
	genTarget();
	$('.tryAgain').on('click',tryAgain);
	$('#guessingGameboard').on('click','#hint',hint);
	$('#guessingGameboard').on('keypress','#guessInput',guessCharFilter);
	$('#guessingGameboard').on('keydown','#guessInput',guessInputEnter);
	$('#guessingGameboard').on('submit','#guessForm',guess);

});

var TEMP_DESC = ['Super Hot','Hot','Warm','Cold','Ice Cold'];  //Should have 5 entries ordered from most accurate to least accurate
var TEMP_DIFFS = [5,10,15,25];                                 //Should have 4 entries ordered from lowest to highest
var INPUT_RANGE = [1,100];                                     //Should have 2 entries ordered from lowest to highest

var target;					//Game's target number
var guessHistory;			//History of numbers guessed in the current game
var hintText;				//The text to be displayed when a hint is asked for;
var wonGame;				//Has the game been won yet?


//Generates the game
function genTarget(){
	target = Math.floor(Math.random()*INPUT_RANGE[1])+INPUT_RANGE[0];
	guessHistory = [];
	hintText= 'Pst! Try '+target+'!';
	$('#guessingGameboard').find('#main-text').text('Can You Guess my Number?');
	$('#guessingGameboard').find('#sub-text').text("I'm thinking of a number between 1 and 100.  You have five guesses.");
	$('#guessingGameboard').find('#gameScreen').addClass('start');
	$('#guessingGameboard').find('#fire').addClass('glyphicon glyphicon-fire fire-cold');
	wonGame=false;
}

//Clears the board and generates a new game
function tryAgain(){
	$('#game-modal').modal('hide');
	$('#guessingGameboard').find('.jumbotron').attr({'class':'jumbotron'});
	$('#guessingGameboard').find('#fire').removeClass();
	$('#guessingGameboard').find('#guessInput').val('');
	genTarget();
}

//Handels the modal
function modalMessage(text,showTryAgain){
	if(showTryAgain){
		$('#modal-try-again').removeClass('invisible');
		$('#modal-try-again').addClass('visible');
	}else{
		$('#modal-try-again').removeClass('visible');
		$('#modal-try-again').addClass('invisible');
	}
	$('#game-modal').find('#targetHint').text(text);
	$('#game-modal').modal('show');
}

//Calls for the hint modal
function hint(){
	modalMessage(hintText,false);
}

//Attempts to filter input to only allow integers between 1-100
function guessCharFilter(event){
	
	var val;
	var valNew;
	
	if(event.keyCode<48 || event.keyCode>57){
		event.preventDefault();
		return;
	}

	val = +$(this).val();
	setTimeout($.proxy(function() {
    	valNew = +$(this).val();
    	if(valNew>INPUT_RANGE[1]){
    		if(val===0){
    			$(this).val('');
    		}
    		$(this).val(val);
    	}
    	if(valNew===0){
    		$(this).val('');
    	}
  	}, this), 1);
}

//Submits the input on enter
function guessInputEnter(event){
	if(event.keyCode===13){
		$(this).closest('form').submit();
	}
}

//Handles a winning guess
function win(){
	var jumbotron = $('#guessingGameboard').find('.jumbotron');
	var fire = $('#guessingGameboard').find('#fire');
	$('#guessingGameboard').find('#main-text').text('Congrats! You Win!');
	$('#guessingGameboard').find('#sub-text').text('You Figured Out I was Thinking of '+target+'!');
	fire.removeClass();
	fire.addClass('glyphicon glyphicon-fire fire-win');
	jumbotron.removeClass();
	jumbotron.addClass('jumbotron win');
	wonGame=true;
}

//Handles a loosing guess
function lose(){
	var jumbotron = $('#guessingGameboard').find('.jumbotron');
	var fire = $('#guessingGameboard').find('#fire');
	$('#guessingGameboard').find('#main-text').text('You Lose!');
	$('#guessingGameboard').find('#sub-text').text('Better Luck Next Time!');
	fire.removeClass();
	fire.addClass('glyphicon glyphicon-fire fire-cold');
	jumbotron.removeClass();
	jumbotron.addClass('jumbotron i-cold');
}

//Handels a wrong guess
function wrongGuess(value,temp,direction){
	var tempClass;
	var gameScreen = $('#guessingGameboard').find('#gameScreen');
	var fire = gameScreen.find('#fire');

	$('#guessingGameboard').find('#main-text').text('You Are '+TEMP_DESC[temp]+'!');
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

}

//Recieves and handles all guesses that are submited
function guess(event){
	var val = +$(this).find('#guessInput').val();
	var direction;
	var diff;
	var temp;

	if(wonGame){
		modalMessage('Congrats! Think you can do it again?',true);
		event.preventDefault();
		return;
	}

	if(guessHistory.length>=5){
		modalMessage('What to give it another shot?',true);
		event.preventDefault();
		return;
	}

	if(val > INPUT_RANGE[1] || val < INPUT_RANGE[0] || isNaN(val)){
		modalMessage('You might have better luck trying an integer between 1 and 100!',false);
		event.preventDefault();
		return;
	}

	if(guessHistory.indexOf(val)!=-1){
		modalMessage('You already guessed '+val+"!  Why don't you try something else?",false);
		event.preventDefault();
		return;
	}

	guessHistory.push(val);

	if(val==target){
		win();
		event.preventDefault();
		return;
	}

	if(guessHistory.length===5){
		lose();
		event.preventDefault();
		return;
	}
	
	if(val<target){
		direction = 'Higher';
	}else{
		direction = 'Lower';
	}

	
	diff=Math.abs(val-target);

	if(diff<=TEMP_DIFFS[0]){
		temp=0;
	}else if(diff<=TEMP_DIFFS[1]){
		temp=1;
	}else if(diff<=TEMP_DIFFS[2]){
		temp=2;
	}else if(diff<=TEMP_DIFFS[3]){
		temp=3;
	}else{
		temp=4;
	}

	wrongGuess(val,temp,direction);

	$('#guessingGameboard').find('#guessInput').val('');

	event.preventDefault();
}
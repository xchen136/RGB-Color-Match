
var matched;
var rgbColors; 															//array of the 3 or 6 random colors stored in (RGB Value)
var colorPicked;														//color picked for user to guess in (RGB value)
var numSqs = 6;															//number of squares according to difficulty level, starts out in HARD level		
var rounds = 1;															//total# of rounds
var score = 0;												
var firstGuess = true;												
var nthRound = 1;
var container = document.querySelector("#container");					//container containing the squares
var squares = document.querySelectorAll(".square");						//a nodeList of the squares
var rgbDisplay = document.querySelector("#rgb");						//header section that displays the RGB value (textDisplay)
var titleDisplay = document.querySelector("#title");					//title section that displays "Practice Mode" or "Round #" (textDisplay)
var scoreDisplay = document.querySelector("#score");					//title section that displays score in "#/#" or "% Correct" (textDisplay)
var header = document.querySelector("h2");								//entire header section used to change (backgroundColor)
var result = document.querySelector("#result");							//botton result section that displays "Correct" or "Try Again" (textDisplay)
var resetButton = document.querySelector("#reset");         			//button that shows PracticeMode: "Reset" or "Play Again?" | ScoringMode: "Next Round" "New Game" (button)
var modeButton = document.querySelectorAll("#options .mode");           //2 buttons that show "Easy" and "Hard" (button)
var roundsInput = document.querySelector("#rounds");					//number input for setting up # of rounds (input)



init();

//Initial function to be called when this JS file runs
function init(){
	modeButton[1].style.borderBottom = "3px solid #232323";				//starts out in the "HARD" mode
	
	//Setup event listeners
	roundListeners();
	modeButtonListeners();	
	resetListeners()
	squareListeners();

	reset();															
}


//When #rounds change -> actions
function roundListeners(){
	//Add event listener to each round#
	roundsInput.addEventListener("input", function(){		 
		rounds = Number(roundsInput.value);								//store the total rounds	

		//New Game	
		newGame();				
		refreshView();												
		reset();
	});
}


//When EASY/HARD is click -> actions
function modeButtonListeners(){
	//Add event listener to each difficulty level
	for(var i=0; i<modeButton.length; i++){
		modeButton[i].addEventListener("click", function(){

			//Clear the underline effect for both modes
			modeButton[0].style.borderBottom = "none";					
			modeButton[1].style.borderBottom = "none";

			//Add in underline effect for current mode
			this.style.borderBottom = "3px solid #232323";
			this.textContent === "Easy"? numSqs = 3: numSqs = 6;

			//New Game
			newGame();
			refreshView();
			reset();
		});
	}
}


//When the "Reset/Play Again/Next Round/New Game button" is click -> action
function resetListeners(){
	resetButton.addEventListener("click", function(){
		if(gameEnd()){													//if game ended, then new game					
			newGame();
		}																//else, just update display
		refreshView();
		reset();
	});
}


//When a square is click -> action
function squareListeners(){
	for(let i=0; i<numSqs; i++){
		//Add event listener to each square
		squares[i].addEventListener("click", function(){
			//Things only happen when match haven't occur yet
			if(!matched){
				if(this.style.backgroundColor === colorPicked){			//Color Matched 
					result.textContent = "CORRECT!";	
					if(rounds > 1){
						if(firstGuess){									//score only increment when it's matched on 1st guess
							score++;
						}					
						scoringView();									//update page display

						if(lastRound()){
							scoreDisplay.textContent = Math.round((score/rounds)*100) + "% Correct!";
						}
						resetContent();									//determine "Next Round" or "New Game" for resetButton
						resetButton.style.display = "block";
						nthRound++;
					}
					else{
						resetButton.textContent = "Play Again";
					}
					correctColorDisplay();								//display the matching color for the entire page
					matched = true;
					firstGuess = true;
				}
				else{													//Color Unmatched
					result.textContent = "TRY AGAIN!";	
					this.style.opacity = "0";	
					if(rounds > 1){
					firstGuess = false;						
					}
				}				
			}
		})	
	}		
}


//Retrieve and store random colors into an array to return
function generateRandomColors(size){
	var arry = [];

	//Store random colors to the array
	for(var i = 0; i<size; i++){
		arry[i] = randomColor();							
	}	
	return arry;
}
 

//Generate and returns the "RGB value" of a random color
function randomColor(){
	var r = Math.floor( (Math.random()*256));							//pick a level of red from 0-255			
	var g = Math.floor( (Math.random()*256));							//pick a level of green from 0-255
	var b = Math.floor( (Math.random()*256));							//pick a level of blue from 0-255

	return "rgb(" + r + ", " + g + ", " + b + ")";
}


//Randomly pick a color and display it in Header, returns the "RGB Value" of the picked color
function pickColor(colorArry){
	var correctColorIdx = Math.floor(Math.random()*colorArry.length);	//choose a random index, use the array length as it may be 3/6sqaures
	rgbDisplay.textContent = colorArry[correctColorIdx];				//display the "RGB Value" of the picked color
	return colorArry[correctColorIdx];									//return the "RGB Value"
}


//Change the header and squares to the color picked (Display)
function correctColorDisplay(){
	header.style.backgroundColor = colorPicked;	
	for(var x=0; x<squares.length; x++){
		squares[x].style.backgroundColor = colorPicked;
		squares[x].style.opacity = "1";																	
	}
}


//Regenerate Colors (Display)
function reset(){
	result.textContent = "";	
	header.style.backgroundColor = "#232323";							//reset Header to original color
	matched = false;													//new colors are generated, new match = no false guess
	rgbColors = generateRandomColors(numSqs);							//generate new random colors and store them into an array
	colorPicked = pickColor(rgbColors);									//pick a new color for user to guess (RGB value) 

	numSqs === 3? container.style.maxWidth = "350px": container.style.maxWidth = "700px";	

	for(var i=0; i<squares.length; i++){
		numSqs === 3? squares[i].style.margin = "4% 8%": squares[i].style.margin = "2% 4%";

		//Only show and apply color to the squares that have a corresponding (RGB value) in the rgbColors array
		if(rgbColors[i]){												
			squares[i].style.display = "block";
			squares[i].style.backgroundColor = rgbColors[i];				
			squares[i].style.opacity = "1";								
		}
		else{ 
			squares[i].style.opacity = "0";
			squares[i].style.display = "none";
		}			
	}
}


//New Game where score and the Nth round (Reset values) need to be reset
function newGame(){
	score = 0;										
	firstGuess = true;								
	nthRound = 1; 									
}


//Scorekeeping Mode (Display)
function scoringView(){
	resetButton.style.display = "none";				//user cannot reset the color choice 
	refreshScore();									//re-display the score in case updated
	refreshRound();									//re-display the current round in case updated
}


//Practice Mode (Display)
function practiceView(){
	scoreDisplay.style.opacity = "0";				//score is unnecessary
	resetButton.style.display = "block";            //user can reset the color choice 
	resetButton.textContent = "Reset";              //"Reset" button is displayed
	titleDisplay.textContent = "Practice Mode";		//"Practice Mode" is displayed
}


//Re-display practice/scoring view
function refreshView(){
	if(rounds > 1){ 
		scoringView();
	}
	else{
		practiceView();
	}	
}


//Re-display the score in case updated
function refreshScore(){
	scoreDisplay.textContent = "Score: " + score + "/" + rounds;	
	scoreDisplay.style.opacity = "1";			
}


//Re-display the current round in case updated
function refreshRound(){
	if(!lastRound()){
		titleDisplay.textContent = "Round #" + nthRound;
	}
	else{
		titleDisplay.textContent = "Final Round";
	}
}


//Determine if it's the last round
function lastRound(){
	if(nthRound === rounds){
		return true;
	}
	else{
		return false;
	}
}


//Determine if it's the end of game
function gameEnd(){
	if(nthRound > rounds){
		return true;
	}
	else{
		return false;
	}
}


//Determine if it's "Next Round" or "New Game" for button text
function resetContent(){
	if(!lastRound()){
		resetButton.textContent = "Next Round";		
	}
	else{
		resetButton.textContent = "New Game";	
	}
}


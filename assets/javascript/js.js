var myGame;
var answerTime;
var globalTime;
var veryFirstSetUp;
var myInterval;
var myCount;
var myTimeOuts = [];
veryFirstSetUp = true;
globalTime = 15;
answerTime = 4;
myCount = 0;

function checkBackground(){
	clearInterval(myInterval);
	$("#bigMarquee").css("opacity","0");
	
}


function flashAll(duration){
	//flash all bulbs at a cetain interval
	//create array to hold the timeOuts
	for (var i =0; i< myGame.bulbs.length;i++){
		myTimeOuts.push(setInterval(myGame.bulbs[i].flash,duration*2,duration));
	}
}

function changeColorAll(color = 2,end = myGame.bulbs.length){
	//first turn them all white or yellow

	if (color < 3){
		for (var i =0; i< end;i++){
			if (myGame.bulbs[i].color !== color){
				myGame.bulbs[i].changeColor(color);
			}
		}
	} else if (color===3){
		for (var i =0; i< end;i++){
			myGame.bulbs[i].changeColor(i%2);
		}
	}	
}
function roundHouse(duration = 0 ,color = 2,end = myGame.bulbs.length){
	//cycle all of the bulbs
	//first turn them all white
	changeColorAll(color,end);
	//then flash each one just once, one at a time
	for (var i =0; i< end;i++){
		myTimeOuts.push(setTimeout(myGame.bulbs[i].flash,duration*i,duration));
	}
	//total duration of this function is:
	//each bulb has to flash, which takes a total of 'duration'
	//it will flash 'end' number of bulbs
	//total time = (end)(duration)
	return end*duration;

}

function roundHouseStack(duration =0 ,color = 0,end = myGame.bulbs.length){

	changeColorAll(color);

	var previousDuration = end*duration
	roundHouse(duration,color,end);
	myTimeOuts.push(setTimeout(myGame.bulbs[myGame.bulbs.length-1].changeColor,previousDuration+10,2));

	for (var i = 1; i< end;i++){
		myTimeOuts.push(setTimeout(roundHouse,previousDuration,duration,color,end-i));
		previousDuration += (end-i)*duration;
		myTimeOuts.push(setTimeout(myGame.bulbs[myGame.bulbs.length-1-i].changeColor,previousDuration+10,2));
		
	}

	return previousDuration;
}

function stopBulbs(){

	for (var i =0; i< myTimeOuts.length;i++){
		clearInterval(myTimeOuts[i]);
		clearTimeout(myTimeOuts[i]);

	}
	myTimeOuts = [];

}

function timer(stopTime){

	if (myGame.onQuestion){
		myGame.moveEnemy();	
	}
	
	if(myCount === stopTime){
		//stop timer
		clearInterval(myInterval);
		//show next question
		//retart long timer
		var myTime;

		if (stopTime === globalTime){
			//this means I ran out of time on the question
			myGame.showAnswer(myGame.questions[myGame.currQuestion].correctIndex);
			myGame.gotWrong();
		} else {
			//this means the answer sheet is being removed.

			if(myGame.currQuestion === myGame.questions.length-1){
				//I ran out of questions
				console.log("I ran out of questions")
				myGame.win();
			} else if (myGame.currentFriend >= myGame.friendArray.length){
				//this means I have run out of friends and lost the game
				//call lose function
				myGame.lose();

			}else{
				myGame.nextQuestion();
				myGame.onQuestion = true;
				myCount = 0;
				myTime = globalTime;
				myInterval = setInterval(timer,1000,myTime);
			}	
		}
	} else {
		myCount++;
	}
}

$(document).ready(function(){


	//question Object constuctor
	function Question(txt,answers,correctIndex) {
		this.question = txt;
		this.answers = answers;
		this.correctIndex = correctIndex;
	}

	//bulb object constructor
	function Bulb(jqObject,color){
		var self = this;
		this.jqObject = jqObject;
		this.color = color;

		this.changeColor = function(myOption){
			//turns the bulb either white(0), yellow(1), or toggle(2)
			if(myOption < 2){
				self.jqObject.attr("src","assets/images/bulb"+myOption+".png");
				self.color = myOption;
			
			}else if(myOption === 2){
				if (self.color === 0){
					self.jqObject.attr("src","assets/images/bulb1.png");
					self.color = 1;
				} else{
					self.jqObject.attr("src","assets/images/bulb0.png");
					self.color = 0;
				}
			}
		}

		this.flash = function(duration){
			self.changeColor(2);
			setTimeout(self.changeColor,duration,2);
		}

	}

	//game object constructor
	function game() {
		//holds the question objects.
		this.questions = [];
		this.currQuestion = -1;
		//holds all of the marquee bulbs
		this.bulbs = [];
		for (var i = 0; i <10;i++){
			this.questions[i] = new Question(libQuestions[i],libAnswers[i],libIndecies[i]);
		}
		this.bulbCounts = [0,0];
		this.marqueeHeights = [0,0];
		this.orientation = 0;
		this.bothOrientSet = false;
		this.numCorrect = 0;
		this.currentFriend = 0;
		this.friendArray = ["Cordelia","Xander","Oz","Willow","Giles"];
		this.timeRemaining = globalTime;
		this.onQuestion = false;

		
		this.nextQuestion = function(){
			this.currQuestion ++;
			var self = this;
			self.onQuestion = true;
			$("#questionText").html(self.questions[self.currQuestion].question);

			$(".option").each(function(i){
				$(this).html(self.questions[self.currQuestion].answers[i]);
			});

			$("#marquee").show();
			$("#answerMarquee").hide();
			
			myGame.createBulbs();
			stopBulbs();
			setTimeout(roundHouseStack,100,20,0);
		}

		this.showAnswer = function(theAnswer){
			//maybe show some kind of image
			$(".answerFriend").hide();
			$("#friendMsg").empty();

			$("#marquee").toggle();
			$("#answerMarquee").toggle();
			//display correct answer
			$("#correctAnswer").html($(".option").eq(theAnswer).html());

		}

		this.setBulbs = function(index){
			//initializes the bulb count for that specific oriention.\
			var marqueeHeight = parseInt($("#marquee").css("height"));
			var singleBulbHeight = parseFloat($(".col-xs-1").css("width"));
			if (singleBulbHeight> 50){
				singleBulbHeight = 50;
			}

			var bulbCount = Math.ceil(marqueeHeight/singleBulbHeight);

			this.bulbCounts[index] = bulbCount;
			this.marqueeHeights[index] = singleBulbHeight*bulbCount; 
			$("#marquee").css("height",this.marqueeHeights[index]+"px");

		}

		this.createBulbs= function(){

			var marqueeHeight = parseInt($("#marquee").css("height"));
			var singleBulbHeight = parseFloat($(".col-xs-1").css("width"));
			if (singleBulbHeight> 50){
				singleBulbHeight = 50;
			}
			var bulbCount = Math.ceil(marqueeHeight/singleBulbHeight);

			var makeTheBulbs = false;

			if (this.bulbCounts[this.orientation]===bulbCount){
				//do nothing
				if(veryFirstSetUp){
					makeTheBulbs = true;
					veryFirstSetUp = false;
				} else{
					makeTheBulbs = false;	
				}
				
			} else{
				if (this.bothOrientSet === false){
					//set the new oriention
					this.setBulbs(1);
					this.bothOrientSet = true;
					makeTheBulbs = true;
				} else{
					if(this.orientation === 0){
						this.orientation = 1;
						makeTheBulbs = true;
					}else{
						this.orientation = 0;
						makeTheBulbs = true;
					}
				}
			}

			//escape if I do not need to make any bulbs
			if (makeTheBulbs === false){return false;}
			
			var counter = 0;
			bulbCount = this.bulbCounts[this.orientation];
			$("#marquee").css("height",this.marqueeHeights[this.orientation]+"px");

			//first, clear out any existing bulbs
			$("#bulbTopRow").empty();
			$("#bulbBottomRow").empty();
			$("#leftBulb").empty();
			$("#rightBulb").empty();
			//in the array too
			this.bulbs = [];

			//top bulbs
			for (var i = 0 ; i <12;i++){
				
				$("#bulbTopRow").append('<div class="col-xs-1"><img id = "bulb'+counter+'" class = "img-responsive bulb" src="assets/images/bulb'+ (counter%2) +'.png"></div>');
				this.bulbs.push(new Bulb($("#bulb"+counter),counter%2));
				counter++;
			}

			//right bulbs
			for(var i = 0; i<bulbCount;i++){
				$("#rightBulb").append('<img id = "bulb'+counter+'" class = "img-responsive bulb" src="assets/images/bulb' + (counter%2) + '.png">');	
				this.bulbs.push(new Bulb($("#bulb"+counter),counter%2));
				counter++;
			}
			
			//bottom bulbs
			for (var i = 0 ; i <12;i++){
				
				$("#bulbBottomRow").prepend('<div class="col-xs-1"><img id = "bulb'+counter+'" class = "img-responsive bulb" src="assets/images/bulb'+ (counter%2) +'.png"></div>');
				this.bulbs.push(new Bulb($("#bulb"+counter),counter%2));
				counter++;
			}

			//left bulbs
			for(var i = 0; i<bulbCount;i++){
				$("#leftBulb").prepend('<img id = "bulb'+counter+'" class = "img-responsive bulb" src="assets/images/bulb' + (counter%2) + '.png">');	
				this.bulbs.push(new Bulb($("#bulb"+counter),counter%2));
				counter++;
			}

		}

		this.moveEnemy = function(){
			var distance = 85*myCount/globalTime;
			$("#demonPic").css("left", distance+"vw");
			myGame.createBulbs();
		}

		this.changeFriend = function(){
			this.currentFriend ++;
			if (this.currentFriend >= this.friendArray.length){
				return true;
			}
			$("#friendPic").attr("src","assets/images/" + this.friendArray[this.currentFriend] + ".png");

		}
		this.gotCorect = function(){
			//if you got hte question correct,
			//reset the demon
			//increase score
			//alert("Looks like you got lucky...");
			myGame.numCorrect++;
			$("#demonPic").css("left",0+"vw");
			myCount = 0;
			clearInterval(myInterval);
			myInterval = setInterval(timer,1000,answerTime);
			timer(answerTime);
			myGame.onQuestion = false;
			stopBulbs();
			setTimeout(changeColorAll,100,3);
			setTimeout(flashAll,100,100);
		}
		this.gotWrong = function(){
			//if you got the question wrong, or ran out of time...
			//alert("OOO you got it wrong! Ha!");
			$("#demonPic").css("left",0+"vw");
			myGame.changeFriend();
			myCount = 0;
			clearInterval(myInterval)
			
			//restart the timer.
			myInterval = setInterval(timer,1000,answerTime);
			timer(answerTime);
			myGame.onQuestion = false;
			stopBulbs();
			setTimeout(changeColorAll,100,0);
			setTimeout(flashAll,100,200);
			//put up your dead friend
			$(".answerFriend").eq(1).attr("src","assets/images/"+this.friendArray[this.currentFriend-1]+".png");
			$(".answerFriend").show();
			$("#friendMsg").html(this.friendArray[this.currentFriend-1]+ " has died.");
			
		}
		this.lose = function(){
			//I lost the game because all of my friends died.
			$("#friendPic").hide();
			stopBulbs();
			setTimeout(changeColorAll,100,1);
			$("#buffyPic").hide();
			$("#correctAnswer").html("With all of your firends gone, I've got you now!")
			$(".answerFriend").eq(1).css("transform","rotate(270deg)")
			$(".answerFriend").eq(1).attr("src","assets/images/buffy.png");
			$(".answerFriend").show();
			$("#friendMsg").html("Buffy has died.");	
		}
		this.win = function(){
			$("#friendPic").hide();
			$("#buffyPic").hide();
			$("#quizDemonPic").hide();
			$("#demonPic").hide();
			$("#answerMarquee").hide();
			$("#marquee").hide();
			for(var i = myGame.currentFriend; i < myGame.friendArray.length;i++){
				$("#winMarquee").append('<div class = "col-xs-2"><img class = "answerFriend" src="assets/images/'+myGame.friendArray[i]+'.png"></div>');
			}
			$("#winMarquee").append('<h1> Great work, Buffy! You defeated the quiz Demon, and you got '+this.numCorrect+' questions correct!')
			$(".answerFriend").show();
			$("#winMarquee").show();
		}
	}


	$("#startGame").on("click",function () {
		$("#intro").hide();
		myGame.setBulbs(myGame.orientation);
		myGame.createBulbs();
		$("#friendPic").attr("src","assets/images/" + myGame.friendArray[myGame.currentFriend] + ".png");
		//load random question
		
		//put up next question
		myGame.nextQuestion();
		//start Timer
		timer(globalTime);
		myInterval = setInterval(timer,1000,globalTime);
		
	});

	$(".option").on("click",function() {
		//check answer
		var isRight = false;
		var theAnswer = myGame.questions[myGame.currQuestion].correctIndex;
		if( $(".option").index($(this)) === theAnswer ){
			isRight = true;
		}

		//show answer and start timer
		myGame.showAnswer(theAnswer);

		if (isRight===true){
			myGame.gotCorect();
		}else{
			//was wrong
			myGame.gotWrong();
		}
	});

	myGame = new game();
})
var myGame;
var answerTime;
var globalTime;
var veryFirstSetUp;
var myInterval;
var myCount;
veryFirstSetUp = true
globalTime = 15;
answerTime = 3;
myCount = 0;
$(document).ready(function(){


	//question Object constuctor
	function Question(txt,answers,correctIndex) {
		this.question = txt;
		this.answers = answers;
		this.correctIndex = correctIndex;
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
		this.friendArray = ["cordelia","xander","oz","willow","giles"];
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
		}

		this.showAnswer = function(theAnswer){
			$("#marquee").toggle();
			$("#answerMarquee").toggle();
			//display correct answer
			$("#correctAnswer").html($(".option").eq(theAnswer).html());
			//maybe show some kind of image
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
				this.bulbs.push($("#bulb"+counter))
				counter++;
			}

			//right bulbs
			for(var i = 0; i<bulbCount;i++){
				$("#rightBulb").append('<img id = "bulb'+counter+'" class = "img-responsive bulb" src="assets/images/bulb' + (counter%2) + '.png">');	
				this.bulbs.push($("#bulb"+counter))
				counter++;
			}
			
			//bottom bulbs
			for (var i = 0 ; i <12;i++){
				
				$("#bulbBottomRow").prepend('<div class="col-xs-1"><img id = "bulb'+counter+'" class = "img-responsive bulb" src="assets/images/bulb'+ (counter%2) +'.png"></div>');
				this.bulbs.push($("#bulb"+counter))
				counter++;
			}

			//left bulbs
			for(var i = 0; i<bulbCount;i++){
				$("#leftBulb").prepend('<img id = "bulb'+counter+'" class = "img-responsive bulb" src="assets/images/bulb' + (counter%2) + '.png">');	
				this.bulbs.push($("#bulb"+counter))
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
			if (this.currentFriend === this.friendArray.length){
				return true;
			}
			$("#friendPic").attr("src","assets/images/" + this.friendArray[this.currentFriend] + ".png");

		}
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
				setTimeout(alert,10,myGame.friendArray[myGame.currentFriend]+" was captured! Oh no!");
				myGame.changeFriend();
				myTime = answerTime;
				myGame.onQuestion = false;
				$("#demonPic").css("left", 85+"vw");
			} else {
				//this means the answer sheet is being removed.
				myGame.nextQuestion();
				myGame.onQuestion = true;
				myTime = globalTime;
			}

			myInterval = setInterval(timer,1000,myTime);
			myCount = 0;
			//timer(myTime);
		} else {
			myCount++;
		}
	}


	//orientation holds the current orientation of the device.  either 0 or 1, but there is no specific orientation for the number

	myGame = new game();

	
	$("#friendPic").attr("src","assets/images/" + myGame.friendArray[myGame.currentFriend] + ".png");

	$("#startGame").on("click",function () {
		$("#intro").hide();
		myGame.setBulbs(myGame.orientation);
		myGame.createBulbs();
		//load random question
		//start Timer
		myInterval = setInterval(timer,1000,globalTime);
		//put up next question
		myGame.nextQuestion();
	});

	$(".option").on("click",function() {
		//check answer
		var isRight = false;
		var theAnswer = myGame.questions[myGame.currQuestion].correctIndex;
		if( $(".option").index($(this)) === theAnswer ){
			console.log("you got it right");
			isRight = true;
		}

		//show answer and start timer
		myGame.showAnswer(theAnswer);

		if (isRight===true){
			myGame.numCorrect++;
		}else{
			//kill a friend
			myGame.changeFriend;
		}
	});

})
var myGame;
$(document).ready(function(){


	function moveEnemy(){
		timeRemaining--;
		var distance = 85*(globalTime - timeRemaining)/globalTime;
		$("#demonPic").css("left", distance+"vw");
		if (timeRemaining > 0){
			setTimeout(moveEnemy, 1000);	
		} else{
			//out of time!
			setTimeout(alert, 10,"buzz!");
			setTimeout(changeFriend,11);
		}
		
	}

	function changeFriend(){
		currentFriend ++;
		$("#friendPic").attr("src","assets/images/" + friendArray[currentFriend] + ".png");
		timeRemaining = globalTime
		$("#demonPic").css("left", "0vw");
		setTimeout(moveEnemy, 1000);
	}



	function Question(txt,answers,correctIndex) {
		this.question = txt;
		this.answers = answers;
		this.correctIndex = correctIndex;
	}

	function game() {
		//holds the question objects.
		this.questions = [];
		this.currQuestion = -1;
		//holds all of the marquee bulbs
		this.bulbs = [];
		for (var i = 0; i <10;i++){
			this.questions[i] = new Question(libQuestions[i],libAnswers[i],libIndecies[i]);
		}


		this.nextQuestion = function(){
			this.currQuestion ++;
			var self = this;
			$("#questionText").html(self.questions[self.currQuestion].question)
			$(".option").each(function(i){
				$(this).html(self.questions[self.currQuestion].answers[i]);
			});
			myGame.createBulbs();
		}

		this.createBulbs= function(){
			
			var counter = 0;
			var bulbCount = Math.floor(parseInt($("#marquee").css("height"))/parseFloat($(".col-xs-1").css("width"))) -2;
			// var bulbCount = Math.floor(parseInt($("#marquee").css("height"))/50) -1;

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

			$("#marquee").css("min-height", (parseFloat($("#leftBulb").css("width"))*(bulbCount+2)) + "px");
			$("#marquee").css("height", $("#marquee").css("min-height"));

		}
	}

	var globalTime = 10;
	var timeRemaining = globalTime;
	var currentFriend = 0;
	var friendArray = ["cordelia","xander","oz","willow","giles"];
	myGame = new game();
	myGame.createBulbs();
	$.mobile.orientationChangeEnabled = false;
	

	$("#friendPic").attr("src","assets/images/" + friendArray[currentFriend] + ".png");

	$("#startGame").on("click",function () {
		$("#intro").hide();
		//load random question
		//start Timer
		setTimeout(moveEnemy, 1000);
	});
	$( window ).on( "orientationchange", function( event ) {
		myGame.createBulbs();
	});
})
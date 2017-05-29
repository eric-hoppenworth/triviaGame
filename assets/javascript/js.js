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
			//setTimeout(alert, 10,"buzz!");
			setTimeout(changeFriend,11);
		}
		myGame.createBulbs();
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

			var marqueeHeight = parseInt($("#marquee").css("height"));
			var singleBulbHeight = parseFloat($(".col-xs-1").css("width"));
			if (singleBulbHeight> 50){
				singleBulbHeight = 50;
			}
			//var bulbsHeight = parseInt($("#bulbs").css("height"));

			var counter = 0;
			var bulbCount = Math.ceil(marqueeHeight/singleBulbHeight);
			$("#marquee").css("height",(singleBulbHeight*bulbCount)+"px");

			
			// if(bulbsHeight - singleBulbHeight < marqueeHeight && marqueeHeight < bulbsHeight + singleBulbHeight){
			// 	//then I am within 1 bulb of being perfext, so don't adjust.
			// 	return false
			// }

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
	}

	var globalTime = 10;
	var timeRemaining = globalTime;
	var currentFriend = 0;
	var friendArray = ["cordelia","xander","oz","willow","giles"];
	myGame = new game();
	
	//setTimeout(moveEnemy, 1000);


	$("#friendPic").attr("src","assets/images/" + friendArray[currentFriend] + ".png");

	$("#startGame").on("click",function () {
		$("#intro").hide();
		myGame.createBulbs();
		//load random question
		//start Timer
		setTimeout(moveEnemy, 1000);
	});

})
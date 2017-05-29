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
		if (currentFriend === friendArray.length){
			return true;
		}
		$("#friendPic").attr("src","assets/images/" + friendArray[currentFriend] + ".png");
		timeRemaining = globalTime
		$("#demonPic").css("left", "0vw");
		setTimeout(moveEnemy, 1000);
	}


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
		

		this.nextQuestion = function(){
			this.currQuestion ++;
			var self = this;
			$("#questionText").html(self.questions[self.currQuestion].question);

			$(".option").each(function(i){
				$(this).html(self.questions[self.currQuestion].answers[i]);
			});

			myGame.createBulbs();
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

			if (this.bulbCounts[this.oriention]===bulbCount){
				//do nothing
				makeTheBulbs = false;
			} else{
				if (this.bothOrientSet === false){
					//set the new oriention
					this.setBulbs(1);
					this.bothOrientSet = true;
					makeTheBulbs = true;
				} else{
					if(this.oriention === 0){
						this.oriention = 1;
						makeTheBulbs = true;
					}else{
						this.oriention = 0;
						makeTheBulbs = true;
					}
				}
			}

			//escape if I do not need to make any bulbs
			if (makeTheBulbs === false){return false;}
			
			var counter = 0;
			bulbCount = this.bulbCounts[this.oriention];
			$("#marquee").css("height",this.marqueeHeights[this.oriention]+"px");

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

	var globalTime = 30;
	var timeRemaining = globalTime;
	var currentFriend = 0;
	var friendArray = ["cordelia","xander","oz","willow","giles"];

	//orientation holds the current orientation of the device.  either 0 or 1, but there is no specific orientation for the number

	myGame = new game();
	
	$("#friendPic").attr("src","assets/images/" + friendArray[currentFriend] + ".png");

	$("#startGame").on("click",function () {
		$("#intro").hide();
		myGame.setBulbs(myGame.orientation);
		myGame.createBulbs();
		//load random question
		//start Timer
		setTimeout(moveEnemy, 1000);
	});

})
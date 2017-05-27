function moveEnemy(){
	timeRemaining--;
	var distance = 90*timeRemaining/globalTime;
	$("#demonPic").css("right", distance+"%");
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
	var distance = 90*timeRemaining/globalTime;
	$("#demonPic").css("right", distance+"%");
	setTimeout(moveEnemy, 1000);
}

function nextQuestion(){

}

function Question(txt,answers,correctIndex) {
	this.question = txt;
	this.answers = answers;
	this.correctIndex = correctIndex;
}

function game() {
	//holds the question objects.
	this.questions = [];
	for (var i = 0; i <10;i++){
		this.questions[i] = new Question(libQestions[i],libAnswers[i],libIndecies[i]);
	}
}


var globalTime = 10
var timeRemaining = globalTime;
var currentFriend = 0;
var friendArray = ["cordelia","xander","oz","willow","giles"];

$("#friendPic").attr("src","assets/images/" + friendArray[currentFriend] + ".png");

$("#startGame").on("click",function () {
	$("#intro").hide();
	//load random question
	//start Timer
	//setTimeout(moveEnemy, 1000);
});

